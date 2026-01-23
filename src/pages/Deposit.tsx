import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Copy, Check } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import BalanceDisplay from '@/components/BalanceDisplay';
import WalletQRCode from '@/components/WalletQRCode';

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  icon: string;
}

const cryptoOptions: CryptoOption[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Network',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC-20',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    id: 'usdt-tron',
    name: 'USDT',
    symbol: 'USDT',
    network: 'TRC-20 (TRON)',
    address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
  {
    id: 'ton',
    name: 'Toncoin',
    symbol: 'TON',
    network: 'TON Network',
    address: 'EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbRELWt',
    icon: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
  },
  {
    id: 'ltc',
    name: 'Litecoin',
    symbol: 'LTC',
    network: 'Litecoin Network',
    address: 'ltc1qhzlj8s3r4wqnm7cxvvxyzq8qklyzqcpjgxmv8t',
    icon: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  },
];

const Deposit = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(cryptoOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2"
      >
        <h1 className="text-2xl font-bold font-display text-center text-foreground">
          Deposit
        </h1>
      </motion.div>

      {/* Balance */}
      <BalanceDisplay />

      {/* Crypto Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 relative"
      >
        <label className="text-sm text-muted-foreground mb-2 block">Select Cryptocurrency</label>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full glass-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <img
              src={selectedCrypto.icon}
              alt={selectedCrypto.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="text-left">
              <p className="font-medium text-foreground">{selectedCrypto.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCrypto.network}</p>
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card-strong z-20 overflow-hidden"
          >
            {cryptoOptions.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => {
                  setSelectedCrypto(crypto);
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors ${
                  selectedCrypto.id === crypto.id ? 'bg-secondary' : ''
                }`}
              >
                <img
                  src={crypto.icon}
                  alt={crypto.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-left">
                  <p className="font-medium text-foreground">{crypto.name}</p>
                  <p className="text-sm text-muted-foreground">{crypto.network}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* QR Code and Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6"
      >
        <WalletQRCode
          address={selectedCrypto.address}
          cryptoName={`${selectedCrypto.name} (${selectedCrypto.network})`}
        />
      </motion.div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl"
      >
        <p className="text-sm text-primary text-center">
          Only send {selectedCrypto.symbol} to this address. Sending other assets may result in permanent loss.
        </p>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Deposit;
