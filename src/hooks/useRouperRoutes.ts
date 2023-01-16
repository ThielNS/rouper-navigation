import useRouperClient from './useRouperClient';

export default function useRouperRoutes() {
  const rouperClient = useRouperClient();

  return rouperClient.getRoutes();
}
