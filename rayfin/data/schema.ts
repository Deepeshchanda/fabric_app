import type { AdminUsers } from './AdminUsers.js';
import type { ReportFavorite } from './ReportFavorite.js';
import type { Report_links } from './Report_links.js';

export type AppSchema = {
  Report_links: Report_links;
  AdminUsers: AdminUsers;
  ReportFavorite: ReportFavorite;
};

export const schema = [];
