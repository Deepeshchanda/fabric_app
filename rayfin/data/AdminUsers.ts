import { entity, authenticated, uuid, int, email } from '@microsoft/rayfin-core';

// Any signed-in user can read this list so the app can check whether their own
// email has been granted admin access. Each row can only be updated/deleted by
// the user it belongs to — new rows must be inserted directly (e.g. Fabric SQL),
// since DAB's row-level policy can't verify "caller already has a row here"
// against a table that doesn't exist yet for that caller.
@entity()
@authenticated('read')
@authenticated(['update', 'delete'], {
  policy: (claims, item) => claims.email.eq(item.EmailId),
})
export class AdminUsers {
  @uuid() id!: string;
  @int() Sno!: number;
  @email({ max: 320, unique: true }) EmailId!: string;
}
