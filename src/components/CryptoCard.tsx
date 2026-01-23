import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoPrice } from '@/hooks/useCryptoPrices';

interface CryptoCardProps {
  crypto: CryptoPrice;
  index?: number;
  onClick?: () => void;
}

const CryptoCard = ({ crypto, index = 0, onClick }: CryptoCardProps) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={onClick}
      className="crypto-card cursor-pointer"
    >
      <img
        src={crypto.image}
        alt={crypto.name}
        className="w-12 h-12 rounded-full"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{crypto.name}</h3>
        <p className="text-sm text-muted-foreground uppercase">{crypto.symbol}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-foreground">
          ${crypto.current_price.toLocaleString(undefined, { 
            minimumFractionDigits: 2,
            maximumFractionDigits: crypto.current_price < 1 ? 4 : 2 
          })}
        </p>
        <div className={`flex items-center justify-end gap-1 text-sm ${
          isPositive ? 'text-success' : 'text-destructive'
        }`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CryptoCard;
