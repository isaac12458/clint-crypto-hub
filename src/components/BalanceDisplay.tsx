import { motion } from 'framer-motion';

interface BalanceDisplayProps {
  balance?: string;
  className?: string;
}

const BalanceDisplay = ({ balance = "$52,000 USDT", className = "" }: BalanceDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-6 ${className}`}
    >
      <p className="text-muted-foreground text-sm mb-1">Total Balance</p>
      <h2 className="balance-display text-gradient-gold">{balance}</h2>
    </motion.div>
  );
};

export default BalanceDisplay;
