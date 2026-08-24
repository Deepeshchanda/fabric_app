import { DemoDashboardLayout } from '@/components/DemoDashboardLayout';

export function BusinessPerformanceDashboardPage() {
  return (
    <DemoDashboardLayout
      title="Business Performance Dashboard"
      subtitle="Executive scorecard with KPI summaries and trend-based diagnostics."
      metrics={[
        { label: 'Enterprise KPI Score', value: '84/100', delta: '+3 points vs last month' },
        { label: 'Growth Index', value: '1.18', delta: '+0.06 vs last month' },
        { label: 'Efficiency Index', value: '0.91', delta: '+0.04 vs last month' },
        { label: 'Risk Alerts', value: '7', delta: '-2 alerts vs last month' },
      ]}
      blocks={[
        { title: 'Executive Scorecard', subtitle: 'Balanced scorecard across core dimensions' },
        { title: 'KPI Summary', subtitle: 'Health status across priority objectives' },
        { title: 'Trend Analysis', subtitle: 'Leading and lagging indicator movement' },
        { title: 'Performance by Unit', subtitle: 'Cross-functional business performance scan' },
      ]}
    />
  );
}
