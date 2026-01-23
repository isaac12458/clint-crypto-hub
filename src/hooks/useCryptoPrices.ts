import { useQuery } from '@tanstack/react-query';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const DEFAULT_COINS = ['bitcoin', 'ethereum', 'tether', 'the-open-network', 'litecoin'];

export const useCryptoPrices = (coinIds: string[] = DEFAULT_COINS) => {
  return useQuery({
    queryKey: ['cryptoPrices', coinIds],
    queryFn: async (): Promise<CryptoPrice[]> => {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }
      
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useAvailableCryptos = () => {
  return useQuery({
    queryKey: ['availableCryptos'],
    queryFn: async (): Promise<CryptoPrice[]> => {
      const topCoins = [
        'bitcoin', 'ethereum', 'tether', 'binancecoin', 'ripple',
        'cardano', 'solana', 'polkadot', 'dogecoin', 'the-open-network',
        'litecoin', 'chainlink', 'polygon-matic', 'avalanche-2', 'stellar'
      ];
      
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${topCoins.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch available cryptos');
      }
      
      return response.json();
    },
    staleTime: 300000, // 5 minutes
  });
};
