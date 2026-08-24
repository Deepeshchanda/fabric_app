import { Link } from 'react-router-dom';

type Metric = {
  label: string;
  value: string;
  delta: string;
};

type ChartBlock = {
  title: string;
  subtitle: string;
};

export function DemoDashboardLayout({
  title,
  subtitle,
  metrics,
  blocks,
}: {
  title: string;
  subtitle: string;
  metrics: Metric[];
  blocks: ChartBlock[];
}) {
  return (
    <div className="min-h-screen bg-[#eef1ff] text-slate-900">
      <header className="border-b border-violet-200 bg-white/95">
        <div className="mx-auto flex h-12 w-full max-w-[1240px] items-center justify-between px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs font-semibold text-violet-700 hover:underline">
              Back to Home
            </Link>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold tracking-wide text-slate-600">
              DEMO DASHBOARD
            </span>
          </div>
          <span className="text-xs font-semibold text-violet-700">Dr Reddy's Analytics</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-4 py-5 lg:px-5">
        <section className="rounded-xl border border-white/80 bg-white p-4 shadow-md shadow-violet-900/5">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 md:text-[20px]">{title}</h1>
          <p className="mt-1 text-[13px] text-slate-600">{subtitle}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-lg border border-slate-200 bg-slate-50/80 p-2.5"
              >
                <p className="text-[11px] uppercase tracking-[0.1em] text-slate-500">{metric.label}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{metric.value}</p>
                <p className="text-xs text-emerald-600">{metric.delta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-2">
          {blocks.map((block, idx) => (
            <article
              key={block.title}
              className="rounded-xl border border-white/80 bg-white p-3.5 shadow-md shadow-violet-900/5"
            >
              <h2 className="text-[13px] font-semibold text-slate-900 md:text-sm">{block.title}</h2>
              <p className="text-xs text-slate-500">{block.subtitle}</p>

              <div className="mt-3 h-36 rounded-lg border border-slate-200 bg-gradient-to-br from-violet-50 to-white p-2.5">
                <div className="flex h-full items-end gap-2">
                  {[35, 60, 45, 72, 58, 81, 66].map((height, index) => (
                    <div key={`${idx}-${index}`} className="flex-1 rounded-md bg-violet-200/80" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
