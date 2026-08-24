import { DemoDashboardLayout } from '@/components/DemoDashboardLayout';

export function PortfolioDashboardPage() {
  return (
    <DemoDashboardLayout
      title="Portfolio Dashboard"
      subtitle="Project portfolio status, investment pacing, and strategic alignment."
      metrics={[
        { label: 'Active Projects', value: '38', delta: '5 projects in initiation' },
        { label: 'On Track', value: '76%', delta: '+4 pts vs previous month' },
        { label: 'At Risk', value: '18%', delta: '-2 pts vs previous month' },
        { label: 'Investment Used', value: '$9.7M', delta: '61% of annual allocation' },
      ]}
      blocks={[
        { title: 'Project Status Board', subtitle: 'On track, at risk, and delayed distribution' },
        { title: 'Investment Tracking', subtitle: 'Planned vs consumed by strategic themes' },
        { title: 'Capacity Heatmap', subtitle: 'Team bandwidth and allocation pressure' },
        { title: 'Milestone Progress', subtitle: 'Quarterly milestone completion velocity' },
      ]}
    />
  );
}
