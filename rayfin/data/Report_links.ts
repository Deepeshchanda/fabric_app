import { entity, authenticated, uuid, text } from '@microsoft/rayfin-core';

// Maps to the existing `Report_links` table in the Testapp Fabric SQL database.
@entity()
@authenticated('read')
@authenticated('create')
export class Report_links {
  @uuid() id!: string;
  @text({ max: 200 }) Domain_Name!: string;
  @text({ max: 200 }) BU!: string;
  @text({ max: 300 }) Report_Name!: string;
  @text({ max: 1000 }) Report_Desc!: string;
  @text({ max: 2048 }) Report_URL!: string;
}
