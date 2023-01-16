import { RouteObjectPermission, RouperClientParams } from './types';
export default class RouperClient {
    protected routes: RouteObjectPermission[];
    protected storageKey: string;
    protected storage?: Storage;
    constructor(params?: RouperClientParams);
    setStorageKey(storageKey?: string): void;
    getStorageKey(): string;
    setStorage(storage?: Storage): void;
    getStorage(): Storage | undefined;
    setRoutes(routes: RouteObjectPermission[]): void;
    getRoutes(): RouteObjectPermission[];
    setClaims(claims: string[] | null): void;
    getClaims(): string[] | null;
}
