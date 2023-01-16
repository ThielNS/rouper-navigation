import { RouteObjectPermission, CustomRouteObjectReturn } from '../types';
import routeLoader from './routeLoader';

export default function withRouter<Outhers = unknown>(
  routes: RouteObjectPermission[],
  storage?: Storage
): CustomRouteObjectReturn[] {
  return routes.reduce<CustomRouteObjectReturn[]>(
    (
      prevRoutes,
      { claims, children, paths, hasSomeClaims, outhers, ...route }
    ) => {
      if (paths && Array.isArray(paths)) {
        paths.forEach((path) => {
          prevRoutes.push({
            ...route,
            path,
            loader: claims
              ? (args) =>
                  routeLoader(
                    args,
                    { ...route, claims, hasSomeClaims, outhers },
                    storage
                  )
              : route?.loader,
            children: children?.length
              ? withRouter(children, storage)
              : undefined,
          });
        });

        return prevRoutes;
      }

      return prevRoutes.concat({
        ...route,
        loader: claims
          ? (args) =>
              routeLoader(
                args,
                { ...route, claims, hasSomeClaims, outhers },
                storage
              )
          : route?.loader,
        children: children?.length ? withRouter(children, storage) : undefined,
      });
    },
    []
  );
}
