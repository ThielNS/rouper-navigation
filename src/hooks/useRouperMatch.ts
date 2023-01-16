import { useEffect, useState } from 'react';
import { RouteObjectPermission } from '../types';
import useRouperClient from './useRouperClient';

export default function useRouperRouteMatch() {
  const rouperClient = useRouperClient();
  const routes = rouperClient.getRoutes();
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const location = window.location;

    if (location) {
      let locationPaths = [];

      if (location.pathname === '/') {
        locationPaths = [location.pathname];
      } else {
        locationPaths = location.pathname.split('/').slice(1);
      }

      setPaths(locationPaths);
    }
  }, [window?.location?.pathname]);

  function findRoute(routesToFind: RouteObjectPermission[], path: string) {
    return (
      routesToFind.find((route) => {
        if (route.path) {
          return route.path === path;
        } else if (route.paths) {
          return route.paths.includes(path);
        }
      }) ?? null
    );
  }

  if (!paths.length) {
    return findRoute(routes, '/');
  }

  if (paths.length) {
    return paths.reduce<RouteObjectPermission | null>((acc, path) => {
      if (!acc) {
        return findRoute(routes, path);
      }

      if (!!acc && acc.children) {
        return findRoute(acc.children, path);
      }

      return acc;
    }, null);
  }

  return null;
}
