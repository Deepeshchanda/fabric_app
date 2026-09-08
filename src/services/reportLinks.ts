import { getRayfinClient } from './rayfinClient';

export interface ReportLinkItem {
  id: string;
  Report_Name: string;
  Report_Desc: string;
  Report_URL: string;
  BU: string;
  Domain_Name: string;
}

const REPORT_FIELDS = [
  'id',
  'Report_Name',
  'Report_Desc',
  'Report_URL',
  'BU',
  'Domain_Name',
] as const;

function sortedDistinct(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

/** Distinct Domain_Name values for the Domain tiles. Selects only that column. */
export async function fetchDistinctDomains(): Promise<string[]> {
  const rows = await getRayfinClient()
    .data.Report_links.select(['Domain_Name'])
    .execute();
  return sortedDistinct(rows.map((row) => row.Domain_Name));
}

/** Distinct BU values scoped to one domain, for the BU dropdown. */
export async function fetchDistinctBUs(domain: string): Promise<string[]> {
  const rows = await getRayfinClient()
    .data.Report_links.select(['BU'])
    .where({ Domain_Name: { eq: domain } })
    .execute();
  return sortedDistinct(rows.map((row) => row.BU));
}

/** Reports for a domain, optionally narrowed by BU and a Report_Name search term. */
export async function fetchReports(
  domain: string,
  bu: string | null,
  searchText: string
): Promise<ReportLinkItem[]> {
  const where: Record<string, { eq: string } | { contains: string }> = {
    Domain_Name: { eq: domain },
  };
  if (bu) {
    where.BU = { eq: bu };
  }
  const trimmedSearch = searchText.trim();
  if (trimmedSearch) {
    where.Report_Name = { contains: trimmedSearch };
  }

  return getRayfinClient()
    .data.Report_links.select([...REPORT_FIELDS])
    .where(where)
    .orderBy({ Report_Name: 'asc' })
    .execute();
}

/** Inserts a new report row directly into the Report_links table. */
export async function createReportLink(
  input: Omit<ReportLinkItem, 'id'>
): Promise<ReportLinkItem> {
  return getRayfinClient().data.Report_links.create(input);
}
