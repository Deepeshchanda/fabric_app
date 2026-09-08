import { getRayfinClient } from './rayfinClient';

/** Emails granted admin access via the AdminUsers table (lowercased). */
export async function fetchAdminEmails(): Promise<string[]> {
  const rows = await getRayfinClient()
    .data.AdminUsers.select(['EmailId'])
    .execute();
  return rows.map((row) => row.EmailId.trim().toLowerCase());
}
