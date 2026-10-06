import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#062319] text-cream-50 border border-[#D4AF37] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="flex-1 text-xs leading-snug">
            <p className="font-serif font-bold text-[#F7E7BE]">Dee Havilah Atelier</p>
            <p className="text-cream-200/90 mt-0.5">{message}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-cream-200/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
