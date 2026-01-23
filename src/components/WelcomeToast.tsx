import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';

const WelcomeToast = () => {
  const { showWelcome, setShowWelcome } = useAuth();

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, setShowWelcome]);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className="glass-card-strong p-4 flex items-center gap-3 max-w-md mx-auto glow-gold">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
              <Sparkles size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Welcome to Clint Crypto</h3>
              <p className="text-sm text-muted-foreground">Your portfolio is ready</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeToast;
