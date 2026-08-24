import { DemoDashboardLayout } from '@/components/DemoDashboardLayout';

export function SalesDashboardPage() {
  return (
    <DemoDashboardLayout
      title="Sales Dashboard"
      subtitle="Revenue performance, regional trends, and category contribution overview."
      metrics={[
        { label: 'Revenue', value: '$42.8M', delta: '+6.2% vs last month' },
        { label: 'Orders', value: '18.4K', delta: '+2.1% vs last month' },
        { label: 'Avg Deal', value: '$2.3K', delta: '+1.4% vs last month' },
        { label: 'Conversion', value: '34.7%', delta: '+0.8 pts vs last month' },
      ]}
      blocks={[
        { title: 'Monthly Sales Trend', subtitle: 'Trailing 12-month revenue movement' },
        { title: 'Region Performance', subtitle: 'North, South, East, West comparison' },
        { title: 'Product Category Breakdown', subtitle: 'Contribution by product families' },
        { title: 'Sales KPI Heatmap', subtitle: 'Priority metrics by business unit' },
      ]}
    />
  );
}
