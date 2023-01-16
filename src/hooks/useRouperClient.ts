import { useContext } from 'react';
import { RouperContext } from '../components/RouperProvider';

export default function useRouperClient() {
  const { client } = useContext(RouperContext);

  return client;
}
