'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, CreditCard, Wallet, ArrowRight, CheckCircle } from 'lucide-react';
import { paymentMethods, currencies } from '../data/dummyData';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  recipient: string;
  onSuccess: (txId: string) => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  currency, 
  recipient, 
  onSuccess 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      const txId = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`;
      onSuccess(txId);
    }, 3000);
  };

  const handleClose = () => {
    setStep('method');
    setSelectedMethod('');
    setIsProcessing(false);
    onClose();
  };

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      case 'wallet':
        return <Wallet className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complete Payment
              </h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Amount</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {amount} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">To</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {recipient}
                </span>
              </div>
            </div>

            {step === 'method' && (
              <>
                {/* Payment Methods */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Choose Payment Method
                  </h4>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{method.icon}</div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {method.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              via {method.provider}
                            </div>
                          </div>
                          {selectedMethod === method.id && (
                            <CheckCircle className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Pay Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={!selectedMethod}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                    selectedMethod
                      ? 'gradient-bg text-white hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Pay {amount} {currency}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </>
            )}

            {step === 'processing' && (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4"
                />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Processing Payment...
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we process your payment
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Successful!
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your payment has been processed successfully
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="px-6 py-3 gradient-bg text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                >
                  Close
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
