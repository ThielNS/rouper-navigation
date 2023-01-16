import { json, LoaderFunctionArgs } from 'react-router-dom';
import { RouteObjectPermission } from '../types';
import { ROUPER_STORAGE_KEY_CLAIMS } from '../utils/constants';

export default function loader(
  args: LoaderFunctionArgs,
  route: RouteObjectPermission,
  storage?: Storage
) {
  if (!storage) return !!route.loader && route.loader(args);

  const claimsStore = storage.getItem(ROUPER_STORAGE_KEY_CLAIMS);
  let claims: string[] = [];

  if (claimsStore) {
    claims = JSON.parse(claimsStore);
  }

  if (
    !route.claims ||
    (Array.isArray(route.claims) &&
      claims.length &&
      (route.hasSomeClaims
        ? route.claims.some((claim) => claims.includes(claim))
        : route.claims.every((claim) => claims.includes(claim))))
  ) {
    return !!route.loader && route.loader(args);
  }

  throw json(
    { error: 'You do not have access' },
    { status: 401, statusText: 'Unauthorized' }
  );
}
