import withRouter from '../functions/withRouter';
import { RouteObjectPermission } from '../types';
import useRouperClient from './useRouperClient';

export default function useWithRouter(routes: RouteObjectPermission[]) {
  const rouperClient = useRouperClient();

  rouperClient.setRoutes(routes);

  return withRouter(routes, rouperClient.getStorage());
}
