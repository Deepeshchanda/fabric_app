import { DemoDashboardLayout } from '@/components/DemoDashboardLayout';

export function ProcurementDashboardPage() {
  return (
    <DemoDashboardLayout
      title="Procurement Dashboard"
      subtitle="Supplier performance, purchase order efficiency, and spend analysis."
      metrics={[
        { label: 'Total Spend', value: '$18.1M', delta: '+4.1% vs last quarter' },
        { label: 'Suppliers', value: '143', delta: '8 newly onboarded' },
        { label: 'PO Cycle Time', value: '4.6 days', delta: '-0.7 days improvement' },
        { label: 'On-time Delivery', value: '92.4%', delta: '+2.0 pts vs last quarter' },
      ]}
      blocks={[
        { title: 'Spend Analysis', subtitle: 'Category and supplier spend distribution' },
        { title: 'Supplier Metrics', subtitle: 'Quality, SLA adherence, and lead times' },
        { title: 'PO Insights', subtitle: 'Volume, approval time, and aging profile' },
        { title: 'Savings Opportunities', subtitle: 'Contract leakage and consolidation targets' },
      ]}
    />
  );
}
