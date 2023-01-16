import { RouteObjectPermission, RouperClientParams } from './types';
import { ROUPER_STORAGE_KEY_CLAIMS } from './utils/constants';

export default class RouperClient {
  protected routes: RouteObjectPermission[] = [];
  protected storageKey: string = ROUPER_STORAGE_KEY_CLAIMS;
  protected storage?: Storage = window.localStorage;

  constructor(params?: RouperClientParams) {
    this.setStorageKey(params?.storageKeyClaims);
    this.setStorage(params?.storage);
  }

  setStorageKey(storageKey?: string) {
    if (storageKey) {
      this.storageKey = storageKey;
    }
  }

  getStorageKey() {
    return this.storageKey;
  }

  setStorage(storage?: Storage) {
    if (storage) {
      this.storage = storage;
    } else {
      this.storage = window.localStorage;
    }
  }

  getStorage() {
    return this.storage;
  }

  setRoutes(routes: RouteObjectPermission[]) {
    this.routes = routes;
  }

  getRoutes() {
    return this.routes as RouteObjectPermission[];
  }

  setClaims(claims: string[] | null) {
    const storage = this?.getStorage();

    if (storage) {
      if (claims) {
        storage.setItem(this.getStorageKey(), JSON.stringify(claims));
      } else {
        storage.removeItem(this.getStorageKey());
      }
    }
  }

  getClaims(): string[] | null {
    const storage = this?.getStorage();

    if (!storage) return null;

    const claimsStorage = storage.getItem(this.getStorageKey());

    return claimsStorage ? JSON.parse(claimsStorage) : null;
  }
}
