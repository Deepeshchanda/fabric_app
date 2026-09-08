import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/AuthContext';
import { fetchAdminEmails } from '@/services/adminUsers';
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
  type FavoriteReport,
} from '@/services/reportFavorites';
import {
  createReportLink,
  fetchDistinctBUs,
  fetchDistinctDomains,
  fetchReports,
  type ReportLinkItem,
} from '@/services/reportLinks';

type UserMode = 'admin' | 'user';

type DomainTile = {
  title: string;
  image: string;
};

type NewReportForm = {
  Domain_Name: string;
  BU: string;
  Report_Name: string;
  Report_Desc: string;
  Report_URL: string;
};

const navItems = ['DOWNLOAD DATA', 'DATA PULSE', 'LEARNING', 'NEED HELP'];

// Background images for known domains; unrecognized Domain_Name values fall back to DEFAULT_DOMAIN_IMAGE.
const DOMAIN_TILE_IMAGES: Record<string, string> = {
  Sales:
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=60',
  'Global Opex':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=60',
  'P&L':
    'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1400&q=60',
  'S&T (Margin Analysis)':
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=60',
  Procurement:
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=60',
  Portfolio:
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=60',
  'Business Performance':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=60',
};

const DEFAULT_DOMAIN_IMAGE =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=60';

export function HomePage() {
  const { user, signOut } = useAuth();

  const [mode, setMode] = useState<UserMode>('user');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [domainNames, setDomainNames] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [carouselStart, setCarouselStart] = useState(0);
  const [panelSearch, setPanelSearch] = useState('');
  const [panelBU, setPanelBU] = useState('All');
  const [buOptions, setBuOptions] = useState<string[]>([]);
  const [panelReports, setPanelReports] = useState<ReportLinkItem[]>([]);
  const [dbAdminEmails, setDbAdminEmails] = useState<string[]>([]);
  const [newReport, setNewReport] = useState<NewReportForm>({
    Domain_Name: '',
    BU: '',
    Report_Name: '',
    Report_Desc: '',
    Report_URL: '',
  });
  const [addReportError, setAddReportError] = useState('');
  const [favorites, setFavorites] = useState<FavoriteReport[]>([]);

  const userDisplayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'Not available';
  const isAdminUser = dbAdminEmails.includes(user?.email?.trim().toLowerCase() ?? '');
  const userInitials = userDisplayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U';

  const favoriteReportIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.report_id)),
    [favorites]
  );

  const visibleFavorites = useMemo(() => {
    const max = favorites.length;
    const items: FavoriteReport[] = [];
    for (let i = 0; i < Math.min(3, max); i += 1) {
      items.push(favorites[(carouselStart + i) % max]);
    }
    return items;
  }, [favorites, carouselStart]);

  const domainTiles: DomainTile[] = useMemo(
    () =>
      domainNames.map((name) => ({
        title: name,
        image: DOMAIN_TILE_IMAGES[name] ?? DEFAULT_DOMAIN_IMAGE,
      })),
    [domainNames]
  );

  // Load distinct Domain_Name values once for the Domain tiles.
  useEffect(() => {
    let cancelled = false;
    fetchDistinctDomains()
      .then((domains) => {
        if (!cancelled) setDomainNames(domains);
      })
      .catch((error) => {
        console.error('Failed to load domains', error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load AdminUsers-granted emails once, merged with the bootstrap admin list.
  useEffect(() => {
    let cancelled = false;
    fetchAdminEmails()
      .then((emails) => {
        if (!cancelled) setDbAdminEmails(emails);
      })
      .catch((error) => {
        console.error('Failed to load admin users', error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load the signed-in user's favorited reports once.
  useEffect(() => {
    let cancelled = false;
    fetchFavorites()
      .then((items) => {
        if (!cancelled) setFavorites(items);
      })
      .catch((error) => {
        console.error('Failed to load favorites', error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Repopulate the BU dropdown whenever the selected domain changes.
  useEffect(() => {
    if (!selectedDomain) {
      setBuOptions([]);
      return;
    }
    let cancelled = false;
    setPanelBU('All');
    setPanelSearch('');
    fetchDistinctBUs(selectedDomain)
      .then((bus) => {
        if (!cancelled) setBuOptions(bus);
      })
      .catch((error) => {
        console.error('Failed to load BUs', error);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDomain]);

  // Re-run the server-side filtered query whenever domain, BU, or search text changes.
  useEffect(() => {
    if (!selectedDomain) {
      setPanelReports([]);
      return;
    }
    let cancelled = false;
    const handle = setTimeout(() => {
      fetchReports(selectedDomain, panelBU === 'All' ? null : panelBU, panelSearch)
        .then((reports) => {
          if (!cancelled) setPanelReports(reports);
        })
        .catch((error) => {
          console.error('Failed to load reports', error);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [selectedDomain, panelBU, panelSearch]);

  const nextCards = () => {
    if (favorites.length === 0) return;
    setCarouselStart((current) => (current + 1) % favorites.length);
  };

  const prevCards = () => {
    if (favorites.length === 0) return;
    setCarouselStart((current) => (current - 1 + favorites.length) % favorites.length);
  };

  const toggleFavorite = async (report: ReportLinkItem) => {
    if (!user?.id) return;
    const existing = favorites.find((favorite) => favorite.report_id === report.id);
    try {
      if (existing) {
        await removeFavorite(existing.favoriteId);
        setFavorites((current) =>
          current.filter((favorite) => favorite.favoriteId !== existing.favoriteId)
        );
      } else {
        const favoriteId = await addFavorite(user.id, report.id);
        setFavorites((current) => [
          ...current,
          {
            favoriteId,
            report_id: report.id,
            Report_Name: report.Report_Name,
            Report_Desc: report.Report_Desc,
            Report_URL: report.Report_URL,
            Domain_Name: report.Domain_Name,
            BU: report.BU,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  const addReport = async () => {
    if (!newReport.Domain_Name.trim() || !newReport.Report_Name.trim()) return;
    setAddReportError('');
    try {
      await createReportLink({
        Domain_Name: newReport.Domain_Name.trim(),
        BU: newReport.BU.trim(),
        Report_Name: newReport.Report_Name.trim(),
        Report_Desc: newReport.Report_Desc.trim(),
        Report_URL: newReport.Report_URL.trim(),
      });
      setNewReport({ Domain_Name: '', BU: '', Report_Name: '', Report_Desc: '', Report_URL: '' });
      setShowAddModal(false);

      fetchDistinctDomains()
        .then(setDomainNames)
        .catch((error) => console.error('Failed to reload domains', error));
      if (selectedDomain) {
        fetchDistinctBUs(selectedDomain)
          .then(setBuOptions)
          .catch((error) => console.error('Failed to reload BUs', error));
        fetchReports(selectedDomain, panelBU === 'All' ? null : panelBU, panelSearch)
          .then(setPanelReports)
          .catch((error) => console.error('Failed to reload reports', error));
      }
    } catch (error) {
      console.error('Failed to create report', error);
      setAddReportError('Could not save the report. Please try again.');
    }
  };

  const openReport = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#d9ddf7] text-slate-900">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.62),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(105,74,220,0.25),transparent_38%),linear-gradient(180deg,#dfe3ff_0%,#ccd4ff_60%,#c2ceff_100%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(145deg,rgba(255,255,255,0.18)_0%,transparent_45%,rgba(109,80,224,0.10)_100%)]" />

      <header className="sticky top-0 z-30 border-b border-violet-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-[1320px] items-center justify-between px-4 lg:px-5">
          <div className="flex items-center gap-2 text-violet-700">
            <div className="grid h-5 w-5 place-items-center rounded-full bg-violet-700 text-[10px] font-bold text-white">
              ◉
            </div>
            <span className="text-[18px] font-semibold leading-none">Ask.mi</span>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="flex items-center gap-3 md:gap-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="text-[10px] font-semibold tracking-wide text-slate-700 transition hover:text-violet-700 sm:text-[11px] md:text-[12px]"
                >
                  {item}
                </button>
              ))}

              {isAdminUser && (
                <div className="rounded-full border border-violet-200 bg-violet-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setMode('user')}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      mode === 'user' ? 'bg-violet-700 text-white' : 'text-violet-700'
                    }`}
                  >
                    Normal User
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('admin')}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      mode === 'admin' ? 'bg-violet-700 text-white' : 'text-violet-700'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((current) => !current)}
                className="grid h-9 w-9 place-items-center rounded-full bg-violet-700 text-[11px] font-bold text-white shadow"
                aria-label="Profile actions"
              >
                {userInitials}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-11 z-40 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Signed in as</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{userDisplayName}</p>
                  <p className="text-xs text-slate-600">{userEmail}</p>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-8 pt-6 lg:px-5">
        <section className="reveal-up">
          <h1 className="welcome-flow text-[24px] font-semibold tracking-tight text-slate-900 lg:text-[28px]">
            Welcome back,
            <span className="name-marquee text-violet-700" role="text" aria-label={userDisplayName}>
              <span className="name-marquee__track" aria-hidden="true">
                <span>{userDisplayName}</span>
                <span>{userDisplayName}</span>
              </span>
            </span>
          </h1>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-white/80 bg-white px-3 py-2.5 shadow-lg shadow-violet-900/10">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-orange-300 to-violet-500 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6" />
                <path d="m19 19-3.5-3.5" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Try asking Blink - Show me the OpEx breakdown"
              className="w-full bg-transparent text-[15px] text-slate-600 outline-none placeholder:text-slate-400 md:text-[17px]"
            />
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full border-2 border-violet-600 text-violet-600"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="m13 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        <section className="mt-7 reveal-up">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[24px] font-semibold tracking-tight text-slate-900 md:text-[27px]">Favourite Dashboards</h2>
            <div className="flex items-center gap-3">
              {mode === 'admin' && (
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="rounded-md bg-violet-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-violet-600"
                >
                  Add Placeholder
                </button>
              )}
              <button type="button" className="text-[13px] font-semibold text-violet-700 hover:underline">
                View All
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={prevCards}
              className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 text-3xl text-slate-400 transition hover:text-violet-700"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextCards}
              className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 text-3xl text-slate-400 transition hover:text-violet-700"
            >
              ›
            </button>

            <div className="grid gap-3 md:grid-cols-3">
              {favorites.length === 0 && (
                <p className="col-span-full text-sm text-slate-500">
                  No favourites yet — star a report to see it here.
                </p>
              )}
              {visibleFavorites.map((favorite) => (
                <article
                  key={favorite.favoriteId}
                  className="rounded-xl border border-white/80 bg-white/95 p-3 shadow-md shadow-violet-900/10"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-700 text-white">
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 18h16" />
                        <path d="M7 14V9" />
                        <path d="M12 14V6" />
                        <path d="M17 14v-3" />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1 pr-1">
                      <h3 className="line-clamp-2 min-h-[2.5em] text-[16px] font-semibold leading-[1.25] text-slate-900 md:text-[17px]">
                        {favorite.Report_Name}
                      </h3>
                      <p className="mt-1 line-clamp-2 min-h-[2.3em] text-[12px] leading-[1.25] text-slate-500 md:text-[13px]">
                        {favorite.Report_Desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        removeFavorite(favorite.favoriteId)
                          .then(() => {
                            setFavorites((current) =>
                              current.filter((item) => item.favoriteId !== favorite.favoriteId)
                            );
                          })
                          .catch((error) => console.error('Failed to remove favorite', error));
                      }}
                      aria-label="Remove from favourites"
                      className="pt-0.5 text-lg text-amber-400 transition hover:text-amber-500"
                    >
                      ★
                    </button>
                  </div>

                  <div className="mt-2.5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openReport(favorite.Report_URL)}
                      className="w-full rounded-md bg-violet-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-violet-600"
                    >
                      View report
                    </button>
                    {mode === 'admin' && (
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 reveal-up">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-[27px] font-semibold tracking-tight text-slate-900 md:text-[30px]">Domains</h2>
            <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-violet-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {domainTiles.map((tile) => (
              <button
                key={tile.title}
                type="button"
                onClick={() => setSelectedDomain(tile.title)}
                className="group relative h-24 overflow-hidden rounded-xl text-left shadow-md shadow-violet-900/20 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-900/30 md:h-[7.25rem]"
              >
                <img src={tile.image} alt={tile.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-950/82 to-violet-600/48" />
                <span className="absolute bottom-2.5 left-3.5 max-w-[85%] text-[15px] font-semibold leading-[1.1] text-white md:text-[16px]">
                  {tile.title}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {selectedDomain && (
        <>
          <button
            type="button"
            aria-label="Close panel"
            className="fixed inset-0 z-40 bg-slate-900/20"
            onClick={() => setSelectedDomain(null)}
          />
          <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-[560px] border-l border-slate-200 bg-white shadow-2xl lg:w-[34vw]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
                <h3 className="text-[19px] font-semibold text-slate-900">{selectedDomain} Dashboards</h3>
                <button
                  type="button"
                  onClick={() => setSelectedDomain(null)}
                  className="text-xl text-slate-500 transition hover:text-slate-900"
                >
                  ×
                </button>
              </div>

              <div className="border-b border-slate-200 px-5 py-3.5">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-medium text-slate-700">
                    Search :
                    <input
                      value={panelSearch}
                      onChange={(event) => setPanelSearch(event.target.value)}
                      placeholder="Dashboard name"
                      className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-violet-400"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-700">
                    Select BU:
                    <select
                      value={panelBU}
                      onChange={(event) => setPanelBU(event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-violet-400"
                    >
                      <option value="All">All</option>
                      {buOptions.map((bu) => (
                        <option key={bu} value={bu}>
                          {bu}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3.5">
                <div className="space-y-2.5">
                  {panelReports.map((item) => (
                    <article
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openReport(item.Report_URL)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openReport(item.Report_URL);
                        }
                      }}
                      className="flex w-full items-start justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-left transition hover:border-violet-300 hover:bg-violet-50/40"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-violet-700 text-white">
                          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 18h16" />
                            <path d="M7 14V9" />
                            <path d="M12 14V6" />
                            <path d="M17 14v-3" />
                          </svg>
                        </span>
                        <span>
                          <span className="block text-[16px] font-semibold text-slate-900">{item.Report_Name}</span>
                          <span className="block text-[14px] text-slate-500">{item.Report_Desc}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void toggleFavorite(item);
                        }}
                        aria-label={
                          favoriteReportIds.has(item.id) ? 'Remove from favourites' : 'Add to favourites'
                        }
                        className={`pt-1 text-xl transition ${
                          favoriteReportIds.has(item.id)
                            ? 'text-amber-400'
                            : 'text-slate-300 hover:text-amber-300'
                        }`}
                      >
                        {favoriteReportIds.has(item.id) ? '★' : '☆'}
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 p-4">
                <button
                  type="button"
                  onClick={() => setSelectedDomain(null)}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-violet-100 px-3 py-3 text-left text-violet-900 transition hover:bg-violet-200"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-700 text-white">▣</span>
                  <span className="text-[16px] font-semibold">Back to Home</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Add New Report Placeholder</h3>
            <div className="mt-4 grid gap-3">
              <input
                type="text"
                value={newReport.Domain_Name}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    Domain_Name: event.target.value,
                  }))
                }
                maxLength={200}
                placeholder="Domain Name"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <input
                type="text"
                value={newReport.BU}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    BU: event.target.value,
                  }))
                }
                maxLength={200}
                placeholder="BU"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <input
                type="text"
                value={newReport.Report_Name}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    Report_Name: event.target.value,
                  }))
                }
                maxLength={300}
                placeholder="Report Name"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <textarea
                value={newReport.Report_Desc}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    Report_Desc: event.target.value,
                  }))
                }
                maxLength={1000}
                rows={3}
                placeholder="Report Description"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <input
                type="text"
                value={newReport.Report_URL}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    Report_URL: event.target.value,
                  }))
                }
                maxLength={2048}
                placeholder="Report URL"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              {addReportError && (
                <p className="text-sm text-red-600">{addReportError}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void addReport()}
                className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
