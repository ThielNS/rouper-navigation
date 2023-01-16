import { NonIndexRouteObject, RouteObject } from 'react-router-dom';
import RouperClient from '../RouperClient';
import RouterPermissionClient from '../RouperClient';

export declare type CustomRouteObjectReturn = Omit<RouteObject, 'index'>;

export declare type CustomRouteObject = Omit<
  NonIndexRouteObject,
  'children' | 'index'
> & {
  children?: RouteObjectPermission[];
  index?: true;
};

export declare type RouteObjectPermissionOuther = Record<string, any>;

export declare type RouteObjectPermission = CustomRouteObject & {
  claims?: string[];
  paths?: string[];
  hasSomeClaims?: true;
  outhers?: RouteObjectPermissionOuther;
};

export declare interface RouperContextParams {
  claims: string[] | null;
  setClaims(claims: string[] | null): void;
  client: RouperClient;
}

export declare interface RouperProviderProps {
  client: RouterPermissionClient;
}

export declare interface RouperClientParams {
  storageKeyClaims?: string;
  storage?: Storage;
}
