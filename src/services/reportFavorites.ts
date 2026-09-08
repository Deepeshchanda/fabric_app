import { getRayfinClient } from './rayfinClient';

export interface FavoriteReport {
  favoriteId: string;
  report_id: string;
  Report_Name: string;
  Report_Desc: string;
  Report_URL: string;
  Domain_Name: string;
  BU: string;
}

/** The signed-in user's own favorited reports (row-level policy scopes this server-side). */
export async function fetchFavorites(): Promise<FavoriteReport[]> {
  const rows = await getRayfinClient()
    .data.ReportFavorite.select([
      'id',
      'report_id',
      'report.Report_Name',
      'report.Report_Desc',
      'report.Report_URL',
      'report.Domain_Name',
      'report.BU',
    ])
    .execute();

  return rows
    .filter((row) => row.report)
    .map((row) => ({
      favoriteId: row.id,
      report_id: row.report_id,
      Report_Name: row.report!.Report_Name,
      Report_Desc: row.report!.Report_Desc,
      Report_URL: row.report!.Report_URL,
      Domain_Name: row.report!.Domain_Name,
      BU: row.report!.BU,
    }));
}

export async function addFavorite(userId: string, reportId: string): Promise<string> {
  const created = await getRayfinClient().data.ReportFavorite.create({
    user_id: userId,
    report_id: reportId,
  });
  return created.id;
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  await getRayfinClient().data.ReportFavorite.delete({ id: favoriteId });
}
