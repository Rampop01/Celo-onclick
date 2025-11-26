import { useAccount } from 'wagmi';

export function useWalletConnection() {
  const { isConnected } = useAccount();
  return { isConnected };
}
