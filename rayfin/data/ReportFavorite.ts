import { entity, authenticated, uuid, text, one } from '@microsoft/rayfin-core';
import { Report_links } from './Report_links.js';

// Row-level: each signed-in user can only see/manage their own favorites.
@entity()
@authenticated('*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class ReportFavorite {
  @uuid() id!: string;
  @text() user_id!: string;
  @uuid() report_id!: string;
  @one(() => Report_links, { optional: true }) report?: Report_links;
}
