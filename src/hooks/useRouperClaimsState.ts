import { useContext } from 'react';
import { RouperContext } from '../components/RouperProvider';

export default function useRouperClaimsState(): [
  string[] | null,
  (claims: string[] | null) => void
] {
  const { claims, setClaims } = useContext(RouperContext);

  return [claims, setClaims];
}
