import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Loader2 } from 'lucide-react';
import { useCryptoPrices, useAvailableCryptos } from '@/hooks/useCryptoPrices';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/BottomNav';
import CryptoCard from '@/components/CryptoCard';
import BalanceDisplay from '@/components/BalanceDisplay';
import WelcomeToast from '@/components/WelcomeToast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Dashboard = () => {
  const { user } = useAuth();
  const [trackedCoins, setTrackedCoins] = useState<string[]>([
    'bitcoin', 'ethereum', 'tether', 'the-open-network', 'litecoin'
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: prices, isLoading, error } = useCryptoPrices(trackedCoins);
  const { data: availableCryptos, isLoading: loadingAvailable } = useAvailableCryptos();

  const addCrypto = (coinId: string) => {
    if (!trackedCoins.includes(coinId)) {
      setTrackedCoins([...trackedCoins, coinId]);
    }
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const filteredCryptos = availableCryptos?.filter(
    (crypto) =>
      !trackedCoins.includes(crypto.id) &&
      (crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="page-container">
      <WelcomeToast />

      {/* Header with Avatar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-col items-center gap-3"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <Avatar className="h-16 w-16 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xl font-bold">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <h1 className="text-2xl font-bold font-display text-gradient-gold text-center">
          {user?.fullName ? `Welcome, ${user.fullName}` : 'Clint Crypto'}
        </h1>
      </motion.div>

      {/* Balance */}
      <BalanceDisplay />

      {/* Crypto List */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Portfolio</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Plus size={16} />
            Add Crypto
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : error ? (
          <div className="glass-card p-6 text-center">
            <p className="text-muted-foreground">Failed to load prices. Please try again.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prices?.map((crypto, index) => (
              <CryptoCard key={crypto.id} crypto={crypto} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Add Crypto Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card-strong w-full max-w-md max-h-[70vh] overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Cryptocurrency</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search cryptocurrencies..."
                    className="input-crypto w-full pl-10"
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-[50vh] p-4">
                {loadingAvailable ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCryptos?.map((crypto) => (
                      <motion.button
                        key={crypto.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addCrypto(crypto.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                      >
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground uppercase">{crypto.symbol}</p>
                        </div>
                        <p className="text-sm text-foreground">
                          ${crypto.current_price.toLocaleString()}
                        </p>
                      </motion.button>
                    ))}
                    {filteredCryptos?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No cryptocurrencies found
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
