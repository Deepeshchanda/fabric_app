import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAdminEmail } from '@/admin';
import { useAuth } from '@/hooks/AuthContext';

type UserMode = 'admin' | 'user';

type DashboardCard = {
  id: string;
  title: string;
  description: string;
  domain: string;
};

type DomainTile = {
  title: string;
  image: string;
  route: string;
};

type PanelDashboard = {
  id: string;
  title: string;
  description: string;
  route: string;
};

type NewReportForm = {
  title: string;
  link: string;
  department: string;
  imageUrl: string;
};

const navItems = ['DOWNLOAD DATA', 'DATA PULSE', 'LEARNING', 'NEED HELP'];

const baseCards: DashboardCard[] = [
  {
    id: 'DB-001',
    title: 'Executive Sales Summary',
    description: 'High-level sales performance across regions.',
    domain: 'Sales',
  },
  {
    id: 'DB-002',
    title: 'Finance Performance Tracker',
    description: 'Monitor costs, revenue and profitability trends.',
    domain: 'P&L',
  },
  {
    id: 'DB-003',
    title: 'Operations Monitoring',
    description: 'Track operational KPIs and performance metrics.',
    domain: 'Business Performance',
  },
  {
    id: 'DB-004',
    title: 'Procurement Health View',
    description: 'Supplier and spend overview in one place.',
    domain: 'Procurement',
  },
  {
    id: 'DB-005',
    title: 'Portfolio Momentum',
    description: 'Portfolio priorities and investment visibility.',
    domain: 'Portfolio',
  },
];

const domainTiles: DomainTile[] = [
  {
    title: 'Sales',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=60',
    route: '/dashboards/sales',
  },
  {
    title: 'Global Opex',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=60',
    route: '/dashboards/global-opex',
  },
  {
    title: 'P&L',
    image:
      'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1400&q=60',
    route: '/dashboards/pl',
  },
  {
    title: 'S&T (Margin Analysis)',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=60',
    route: '/dashboards/pl',
  },
  {
    title: 'Procurement',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=60',
    route: '/dashboards/procurement',
  },
  {
    title: 'Portfolio',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=60',
    route: '/dashboards/portfolio',
  },
  {
    title: 'Business Performance',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=60',
    route: '/dashboards/business-performance',
  },
];

const globalOpexDashboards: PanelDashboard[] = [
  {
    id: 'OPX-001',
    title: 'Global Opex',
    description: 'Operating expenses overview with cost pools',
    route: '/dashboards/global-opex',
  },
  {
    id: 'OPX-002',
    title: 'Staff Cost',
    description: 'Headcount and employee cost analysis',
    route: '/dashboards/global-opex',
  },
  {
    id: 'OPX-003',
    title: 'Travex-Travel Analysis',
    description: 'Travel expenses and trends',
    route: '/dashboards/global-opex',
  },
  {
    id: 'OPX-004',
    title: 'Employee Reimbursement',
    description: 'Reimbursement tracking and expense breakdown',
    route: '/dashboards/global-opex',
  },
  {
    id: 'OPX-005',
    title: 'Opex Trend',
    description: 'Monthly operating expense trends',
    route: '/dashboards/global-opex',
  },
  {
    id: 'OPX-006',
    title: 'Legal Spend',
    description: 'Legal expenditure reporting',
    route: '/dashboards/global-opex',
  },
];

const domainMap: Record<string, PanelDashboard[]> = {
  Sales: [
    {
      id: 'SLS-001',
      title: 'Sales KPI Board',
      description: 'Revenue, growth and conversion summary',
      route: '/dashboards/sales',
    },
    {
      id: 'SLS-002',
      title: 'Region Mix',
      description: 'Performance by market and territory',
      route: '/dashboards/sales',
    },
  ],
  'Global Opex': globalOpexDashboards,
  'P&L': [
    {
      id: 'PL-001',
      title: 'P&L Snapshot',
      description: 'Revenue, cost, margin and variance view',
      route: '/dashboards/pl',
    },
  ],
  'S&T (Margin Analysis)': [
    {
      id: 'ST-001',
      title: 'Margin Analyzer',
      description: 'Scenario-level margin trend analysis',
      route: '/dashboards/pl',
    },
  ],
  Procurement: [
    {
      id: 'PRC-001',
      title: 'Procurement Insights',
      description: 'Supplier health and purchase order lens',
      route: '/dashboards/procurement',
    },
  ],
  Portfolio: [
    {
      id: 'PFL-001',
      title: 'Portfolio Overview',
      description: 'Project and investment tracking cockpit',
      route: '/dashboards/portfolio',
    },
  ],
  'Business Performance': [
    {
      id: 'BIZ-001',
      title: 'Executive Scorecard',
      description: 'Organization-wide KPI and trend analyzer',
      route: '/dashboards/business-performance',
    },
  ],
};

export function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [mode, setMode] = useState<UserMode>('user');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainTile | null>(null);
  const [carouselStart, setCarouselStart] = useState(0);
  const [panelSearch, setPanelSearch] = useState('');
  const [panelBU, setPanelBU] = useState('Reports');
  const [newReport, setNewReport] = useState<NewReportForm>({
    title: '',
    link: '',
    department: '',
    imageUrl: '',
  });
  const [cards, setCards] = useState<DashboardCard[]>(baseCards);

  const userDisplayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'Not available';
  const isAdminUser = isAdminEmail(user?.email);
  const userInitials = userDisplayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U';

  const visibleCards = useMemo(() => {
    const max = cards.length;
    const items: DashboardCard[] = [];
    for (let i = 0; i < Math.min(3, max); i += 1) {
      items.push(cards[(carouselStart + i) % max]);
    }
    return items;
  }, [cards, carouselStart]);

  const panelItems = useMemo(() => {
    if (!selectedDomain) return [];
    const base = domainMap[selectedDomain.title] ?? [];
    const searched = panelSearch.trim().toLowerCase();
    return base.filter((item) => {
      if (panelBU !== 'Reports' && panelBU !== 'All') return false;
      if (!searched) return true;
      return (
        item.title.toLowerCase().includes(searched) ||
        item.description.toLowerCase().includes(searched)
      );
    });
  }, [selectedDomain, panelSearch, panelBU]);

  const nextCards = () => {
    setCarouselStart((current) => (current + 1) % cards.length);
  };

  const prevCards = () => {
    setCarouselStart((current) => (current - 1 + cards.length) % cards.length);
  };

  const addReport = () => {
    if (!newReport.title.trim()) return;
    const description =
      newReport.department.trim() || 'Custom report placeholder pending SQL data binding.';
    const fresh: DashboardCard = {
      id: `DB-${String(cards.length + 1).padStart(3, '0')}`,
      title: newReport.title.trim(),
      description,
      domain: newReport.department.trim() || 'Custom',
    };
    setCards((current) => [fresh, ...current]);
    setNewReport({ title: '', link: '', department: '', imageUrl: '' });
    setShowAddModal(false);
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
              {visibleCards.map((card) => (
                <article
                  key={card.id}
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
                        {card.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 min-h-[2.3em] text-[12px] leading-[1.25] text-slate-500 md:text-[13px]">
                        {card.description}
                      </p>
                    </div>

                    <button type="button" className="pt-0.5 text-lg text-slate-300 hover:text-violet-700">
                      ☆
                    </button>
                  </div>

                  <div className="mt-2.5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open('/dashboards/sales', '_blank', 'noopener,noreferrer')}
                      className="w-full rounded-md bg-violet-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-violet-600"
                    >
                      Open report 📊
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
                onClick={() => setSelectedDomain(tile)}
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
                <h3 className="text-[19px] font-semibold text-slate-900">{selectedDomain.title} Dashboards</h3>
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
                      <option>Reports</option>
                      <option>All</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3.5">
                <div className="space-y-2.5">
                  {panelItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.route)}
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
                          <span className="block text-[16px] font-semibold text-slate-900">{item.title}</span>
                          <span className="block text-[14px] text-slate-500">{item.description}</span>
                        </span>
                      </div>
                      <span className="pt-1 text-xl text-slate-300">☆</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 p-4">
                <button
                  type="button"
                  onClick={() => navigate(selectedDomain.route)}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-violet-100 px-3 py-3 text-left text-violet-900 transition hover:bg-violet-200"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-700 text-white">▣</span>
                  <span className="text-[16px] font-semibold">Explore - Create your own reports</span>
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
                value={newReport.title}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Report Name"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <input
                type="text"
                value={newReport.link}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    link: event.target.value,
                  }))
                }
                placeholder="Report Link"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <input
                type="text"
                value={newReport.department}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    department: event.target.value,
                  }))
                }
                placeholder="Department"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
              <input
                type="text"
                value={newReport.imageUrl}
                onChange={(event) =>
                  setNewReport((current) => ({
                    ...current,
                    imageUrl: event.target.value,
                  }))
                }
                placeholder="Image URL"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-400"
              />
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
                onClick={addReport}
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
