export { default as RouperProvider } from './components/RouperProvider';

export { default as RouperClient } from './RouperClient';

export { default as routeLoader } from './functions/routeLoader';
export { default as withRouter } from './functions/withRouter';

export { default as useRouperClaimsState } from './hooks/useRouperClaimsState';
export { default as useRouperClient } from './hooks/useRouperClient';
export { default as useRouperMatch } from './hooks/useRouperMatch';
export { default as useRouperRoutes } from './hooks/useRouperRoutes';
export { default as useWithRouter } from './hooks/useWithRouter';

export type {
  CustomRouteObject,
  CustomRouteObjectReturn,
  RouperProviderProps,
  RouperClientParams,
  RouperContextParams,
  RouteObjectPermission,
} from './types';
