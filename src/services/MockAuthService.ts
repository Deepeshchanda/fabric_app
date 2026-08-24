import type { RayfinClient } from '@microsoft/rayfin-client';

import type { BlankAppSchema } from '../../rayfin/data/schema';

import { type AuthUser, type IAuthService, toAuthUser } from './IAuthService';

const LOCAL_SESSION_KEY = 'rayfin.local.mockUser';
const LOCAL_USER = {
  id: 'local-dev-user',
  email: 'dev@contoso.com',
  createdAt: new Date(0).toISOString(),
  metadata: null,
} as const;

function readLocalUser(): AuthUser | null {
  try {
    const value = window.localStorage.getItem(LOCAL_SESSION_KEY);
    return value ? (JSON.parse(value) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeLocalUser(user: AuthUser): void {
  window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
}

/**
 * Local-development auth service. Used when the API URL targets localhost.
 *
 * This frontend-only variant does not require a running backend and stores
 * the mock session in localStorage so local refreshes stay signed in.
 */
export class MockAuthService implements IAuthService {
  readonly fabricAuthEnabled = false;

  constructor(_client: RayfinClient<BlankAppSchema>) {}

  async signIn(): Promise<AuthUser> {
    const user = toAuthUser(LOCAL_USER);
    writeLocalUser(user);
    return user;
  }

  async signOut(): Promise<void> {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return readLocalUser();
  }

  async initEmbeddedAuth(): Promise<AuthUser | null> {
    // Embedded Fabric flow is not used in local-dev mode.
    return null;
  }
}
