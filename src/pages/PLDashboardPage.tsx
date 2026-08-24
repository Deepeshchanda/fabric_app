import { DemoDashboardLayout } from '@/components/DemoDashboardLayout';

export function PLDashboardPage() {
  return (
    <DemoDashboardLayout
      title="P&L Dashboard"
      subtitle="Revenue, cost, profit, and margin variance across business lines."
      metrics={[
        { label: 'Revenue', value: '$61.2M', delta: '+5.0% quarter-to-date' },
        { label: 'Cost', value: '$39.5M', delta: '+2.3% quarter-to-date' },
        { label: 'Profit', value: '$21.7M', delta: '+9.9% quarter-to-date' },
        { label: 'Margin %', value: '35.5%', delta: '+1.5 pts quarter-to-date' },
      ]}
      blocks={[
        { title: 'Variance Analysis', subtitle: 'Actuals vs plan by major account lines' },
        { title: 'Profit Waterfall', subtitle: 'Stepwise movement from revenue to net profit' },
        { title: 'Margin Trend', subtitle: 'Monthly margin trajectory and outliers' },
        { title: 'Segment Contribution', subtitle: 'Profit contribution by product segments' },
      ]}
    />
  );
}
