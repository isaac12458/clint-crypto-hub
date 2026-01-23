import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface WalletQRCodeProps {
  address: string;
  cryptoName: string;
}

const WalletQRCode = ({ address, cryptoName }: WalletQRCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card-strong p-6 text-center"
    >
      <h3 className="text-lg font-semibold mb-4">{cryptoName} Address</h3>
      
      <div className="bg-white p-4 rounded-xl inline-block mb-4">
        <QRCodeSVG
          value={address}
          size={180}
          level="H"
          bgColor="#ffffff"
          fgColor="#0a0e17"
        />
      </div>

      <div className="flex items-center gap-2 bg-secondary rounded-xl p-3">
        <code className="flex-1 text-xs text-muted-foreground break-all font-mono">
          {address}
        </code>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {copied ? (
            <Check size={18} className="text-success" />
          ) : (
            <Copy size={18} className="text-muted-foreground" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WalletQRCode;
