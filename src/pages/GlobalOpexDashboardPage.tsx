import { DemoDashboardLayout } from '@/components/DemoDashboardLayout';

export function GlobalOpexDashboardPage() {
  return (
    <DemoDashboardLayout
      title="Global Opex Dashboard"
      subtitle="Operating expense control across cost centers, budget lines, and trends."
      metrics={[
        { label: 'Total Opex', value: '$14.9M', delta: '+3.4% vs budget' },
        { label: 'Cost Centers', value: '27', delta: '2 centers over threshold' },
        { label: 'Variance', value: '$0.8M', delta: '-1.1% vs previous month' },
        { label: 'Run Rate', value: '$1.24M', delta: 'Within quarterly guardrails' },
      ]}
      blocks={[
        { title: 'Budget vs Actual', subtitle: 'Variance by major expense bucket' },
        { title: 'Monthly Spend Trend', subtitle: 'Rolling spend trend and seasonal peaks' },
        { title: 'Cost Center Analysis', subtitle: 'Top drivers by organizational unit' },
        { title: 'Expense Mix', subtitle: 'People, travel, legal, and infrastructure split' },
      ]}
    />
  );
}
