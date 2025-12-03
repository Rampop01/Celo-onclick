'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { usePaymentFlow, useUSDCBalance } from '../hooks/useContract';
import { fromUSDCAmount } from '../lib/contract';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  recipient: string;
  handle?: string; // Smart contract handle
  onSuccess: (txId: string) => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  currency, 
  recipient,
  handle,
  onSuccess 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const { isConnected, address } = useAccount();
  const { balance, balanceFormatted } = useUSDCBalance();
  const {
    startPayment,
    step: paymentStep,
    isApproving,
    isPaying,
    isSuccess: paymentSuccess,
    isError: paymentError,
    errorMessage,
    reset: resetPayment,
  } = usePaymentFlow();

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      provider: 'Circle/Stripe',
      description: 'Pay with your bank card',
      type: 'fiat',
    },
    {
      id: 'minipay',
      name: 'MiniPay',
      icon: '📱',
      provider: 'Celo',
      description: 'Fast phone-based wallet',
      type: 'crypto',
      featured: true,
    },
    {
      id: 'wallet',
      name: 'Web3 Wallet',
      icon: '🦊',
      provider: 'WalletConnect',
      description: 'Use your connected wallet',
      type: 'crypto',
    },
  ];

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod('');
      setPaymentMessage('');
      resetPayment();
    }
  }, [isOpen, resetPayment]);

  // Handle successful payment
  useEffect(() => {
    if (paymentSuccess) {
      setTimeout(() => {
        onSuccess('success');
        handleClose();
      }, 2000);
    }
  }, [paymentSuccess, onSuccess]);

  const handleClose = () => {
    resetPayment();
    setSelectedMethod('');
    setPaymentMessage('');
    onClose();
  };

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!handle) {
      alert('Invalid payment page handle');
      return;
    }

    // For crypto payments
    if (selectedMethod === 'wallet' || selectedMethod === 'minipay') {
      try {
        await startPayment(handle, amount, paymentMessage);
      } catch (error: any) {
        console.error('Payment error:', error);
      }
    } else {
      // For fiat payments (to be implemented with backend)
      alert('Fiat payments coming soon! Please use crypto payment methods for now.');
    }
  };

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      case 'wallet':
      case 'minipay':
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
                {paymentStep === 'idle' || paymentStep === 'approving' || paymentStep === 'paying'
                  ? 'Complete Payment'
                  : paymentSuccess
                  ? 'Payment Successful!'
                  : 'Payment Failed'}
              </h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isApproving || isPaying}
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-white">Amount</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {amount} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-white">To</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {recipient}
                </span>
              </div>
              {isConnected && balance !== undefined && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-white">Your Balance</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {balanceFormatted.toFixed(2)} USDC
                  </span>
                </div>
              )}
            </div>

            {/* Method Selection */}
            {paymentStep === 'idle' && !paymentSuccess && !paymentError && (
              <>
                {/* Payment Methods */}
                <div className="mb-4">
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
                        } ${method.featured ? 'ring-2 ring-blue-300 dark:ring-blue-700' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{method.icon}</div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                              <span>{method.name}</span>
                              {method.featured && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-white">
                              {method.description}
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

                {/* Optional Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Add a message (optional)
                  </label>
                  <input
                    type="text"
                    value={paymentMessage}
                    onChange={(e) => setPaymentMessage(e.target.value)}
                    placeholder="Say something nice..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={100}
                  />
                </div>

                {/* Insufficient Balance Warning */}
                {isConnected && balance !== undefined && fromUSDCAmount(balance) < amount && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Insufficient USDC balance. You need {amount} USDC but have {balanceFormatted.toFixed(2)} USDC.
                    </p>
                  </div>
                )}

                {/* Pay Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={!selectedMethod || !isConnected || (balance !== undefined && fromUSDCAmount(balance) < amount)}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                    selectedMethod && isConnected && (balance === undefined || fromUSDCAmount(balance) >= amount)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {!isConnected
                      ? 'Connect Wallet First'
                      : !selectedMethod
                      ? 'Select a Payment Method'
                      : balance !== undefined && fromUSDCAmount(balance) < amount
                      ? 'Insufficient Balance'
                      : `Pay ${amount} ${currency}`}
                  </span>
                  {selectedMethod && isConnected && <ArrowRight className="w-5 h-5" />}
                </motion.button>
              </>
            )}

            {/* Approving State */}
            {paymentStep === 'approving' && (
              <div className="text-center py-8">
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Approving USDC...
                </h4>
                <p className="text-gray-600 dark:text-white">
                  Please confirm the approval in your wallet
                </p>
              </div>
            )}

            {/* Paying State */}
            {paymentStep === 'paying' && (
              <div className="text-center py-8">
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Processing Payment...
                </h4>
                <p className="text-gray-600 dark:text-white">
                  Please confirm the transaction in your wallet
                </p>
              </div>
            )}

            {/* Success State */}
            {paymentSuccess && (
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
                <p className="text-gray-600 dark:text-white mb-4">
                  Your payment has been processed on the blockchain
                </p>
              </div>
            )}

            {/* Error State */}
            {paymentError && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <X className="w-10 h-10 text-white" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Failed
                </h4>
                <p className="text-gray-600 dark:text-white mb-4 max-w-sm mx-auto">
                  {errorMessage || 'An error occurred while processing your payment'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => resetPayment()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                >
                  Try Again
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
