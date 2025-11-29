'use client';

import { motion } from 'framer-motion';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useGetPage, useGetPayments, usePaymentFlow, useUSDCBalance } from '../../hooks/useContract';
import { fromUSDCAmount, Role } from '../../lib/contract';
import { isMiniPay } from '../../lib/minipay';
import RampEmbedded from '../../components/RampEmbedded';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Share2, 
  Copy, 
  Check, 
  Users,
  DollarSign,
  Clock,
  Globe,
  CreditCard,
  Wallet,
  CheckCircle,
  ArrowLeft,
  Twitter,
  Edit,
  Plus,
  Target,
  X,
  MessageCircle,
  Smartphone,
  Loader2
} from 'lucide-react';
import QRCode from 'react-qr-code';
import Link from 'next/link';

export function PublicPageContent({ handle: handleFromPath }: { handle?: string } = {}) {
  const searchParams = useSearchParams();
  const handleFromUrl = handleFromPath || (searchParams && searchParams.get('handle')) || '';
  const roleFromUrl = ((searchParams && searchParams.get('role')) || 'freelancer');
  const layoutFromUrl = (searchParams && searchParams.get('layout')) || 'minimal';
  const ownerFromUrl = searchParams && searchParams.get('owner') === 'true';
  
  // Check if this is a preview (accessed via /public-page with owner=true) vs published (accessed via /handle)
  const isPreview = ownerFromUrl && !handleFromPath;
  
  // UI States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fiat' | 'crypto' | 'minipay' | null>(null);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false);
  const [isMiniPayUser, setIsMiniPayUser] = useState(false);
  const [showRampWidget, setShowRampWidget] = useState(false);

  // Get connected wallet address
  const { address: connectedAddress, isConnected } = useAccount();
  
  // Detect MiniPay on mount
  useEffect(() => {
    setIsMiniPayUser(isMiniPay());
  }, []);

  // ============================================
  // ON-CHAIN DATA - No localStorage!
  // ============================================
  const { page: onChainPage, isLoading: pageLoading, error: pageError, refetch: refetchPage } = useGetPage(handleFromUrl || undefined);
  const { payments: onChainPayments, isLoading: paymentsLoading, refetch: refetchPayments } = useGetPayments(handleFromUrl || undefined);
  const { balanceFormatted } = useUSDCBalance();
  const { startPayment, step: paymentStep, isSuccess: paymentIsSuccess, errorMessage: paymentErrorMessage, reset: resetPayment } = usePaymentFlow();

  // SECURE: Check if connected wallet is the actual on-chain page owner
  const isPageOwner = isConnected && 
                      connectedAddress && 
                      onChainPage && 
                      onChainPage.exists &&
                      onChainPage.owner.toLowerCase() === connectedAddress.toLowerCase();

  // Get page data from on-chain or use defaults for preview
  const getRoleName = (role: number) => {
    switch (role) {
      case Role.Freelancer: return 'freelancer';
      case Role.Business: return 'business';
      case Role.Crowdfunder: return 'crowdfunder';
      default: return 'freelancer';
    }
  };

  // Page data from blockchain
  const pageData = onChainPage?.exists ? {
    name: handleFromUrl, // The handle is the name
    handle: onChainPage.handle,
    role: getRoleName(Number(onChainPage.role)),
    walletAddress: onChainPage.walletAddress,
    raised: fromUSDCAmount(onChainPage.totalRaised),
    goal: fromUSDCAmount(onChainPage.goal),
    supporters: Number(onChainPage.supporterCount),
    deadline: onChainPage.deadline > 0 ? new Date(Number(onChainPage.deadline) * 1000).toISOString() : '',
    theme: '#4A9BC7', // Default theme
    title: `Welcome to ${handleFromUrl}'s page`,
    description: 'Accept payments with ease using OnClick.',
    banner: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  } : {
    name: handleFromUrl || 'Demo Page',
    handle: handleFromUrl,
    role: roleFromUrl,
    walletAddress: connectedAddress || '',
    raised: 0,
    goal: 0,
    supporters: 0,
    deadline: '',
    theme: '#4A9BC7',
    title: 'Create your payment page',
    description: 'This page is not yet published to the blockchain.',
    banner: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  };

  // Auto-refetch when payment succeeds
  useEffect(() => {
    if (paymentIsSuccess) {
      setTimeout(() => {
        refetchPage();
        refetchPayments();
      }, 2000);
    }
  }, [paymentIsSuccess, refetchPage, refetchPayments]);

  const progressPercentage = pageData.goal > 0 ? (pageData.raised / pageData.goal) * 100 : 0;
  const showProgressBar = pageData.role === 'crowdfunder' && pageData.goal > 0;
  const isBusiness = pageData.role === 'business';
  const isCrowdfunder = pageData.role === 'crowdfunder';

  // ============================================
  // PAYMENT HANDLERS
  // ============================================
  const handleSupport = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsPaymentModalOpen(true);
    }
  };

  const handleCryptoPayment = async () => {
    if (!handleFromUrl || !amount || parseFloat(amount) <= 0) {
      alert('Invalid payment details');
      return;
    }
    
    setIsPaymentModalOpen(false);
    
    try {
      await startPayment(handleFromUrl, parseFloat(amount), message);
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed');
    }
  };

  const handleFiatPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!onChainPage?.walletAddress && !connectedAddress) {
      alert('Recipient address not found');
      return;
    }
    
    setIsPaymentModalOpen(false);
    setShowRampWidget(true);
  };

  // ============================================
  // SHARE HANDLERS
  // ============================================
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToTwitter = () => {
    const text = isBusiness 
      ? `Check out ${pageData.name} on OnClick!`
      : isCrowdfunder
      ? `Support ${pageData.name}'s campaign on OnClick!`
      : `Hire ${pageData.name} on OnClick!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToTelegram = () => {
    const text = isBusiness 
      ? `Check out ${pageData.name} on OnClick!`
      : isCrowdfunder
      ? `Support ${pageData.name}'s campaign on OnClick!`
      : `Hire ${pageData.name} on OnClick!`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const getEmbedCode = () => {
    if (typeof window !== 'undefined') {
      return `<iframe src="${window.location.href}" width="100%" height="600" frameborder="0" style="border-radius: 12px;"></iframe>`;
    }
    return '';
  };
  
  const handleCopyEmbedCode = async () => {
    try {
      const embedCode = getEmbedCode();
      await navigator.clipboard.writeText(embedCode);
      setEmbedCodeCopied(true);
      setTimeout(() => setEmbedCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy embed code: ', err);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 border-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading page from blockchain...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // PAGE NOT FOUND
  // ============================================
  if (!pageLoading && handleFromUrl && !onChainPage?.exists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="pt-32 pb-16 px-4 max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
            <p className="text-slate-600 mb-8">
              The handle <span className="font-mono bg-slate-100 px-2 py-1 rounded">@{handleFromUrl}</span> is not registered on the blockchain yet.
            </p>
            <div className="space-y-4">
              <Link href="/role-selection">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold"
                >
                  Create This Page
                </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Go Home
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Owner Status Banner */}
      {handleFromUrl && isConnected && !pageLoading && onChainPage?.exists && (
        <div className="pt-20 px-4">
          <div className="max-w-4xl mx-auto">
            {isPageOwner ? (
              <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">You own this page!</p>
                      <p className="text-sm text-green-700">
                        Raised: ${pageData.raised.toFixed(2)} • {pageData.supporters} supporters
                      </p>
                    </div>
                  </div>
                  <Link href={`/create-page?handle=${handleFromUrl}&edit=true`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Page</span>
                    </motion.button>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      
      <div className={`${isPageOwner ? 'pt-4' : 'pt-20'} pb-16`}>
        {/* Banner Section */}
        <section className="relative">
          <div className="h-64 relative overflow-hidden">
            <img
              src={pageData.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Share Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsQRModalOpen(true)}
              className="absolute top-6 right-6 p-3 glass-card rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Profile Info */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card rounded-2xl p-4 sm:p-8 shadow-xl bg-white"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-2 sm:space-y-0">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                    {pageData.role}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2 sm:mb-3 break-words">@{pageData.handle}</h1>
                <p className="text-base sm:text-xl text-slate-600 mb-2 sm:mb-4 break-words">{pageData.title}</p>
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base break-words">{pageData.description}</p>
                
                {/* Stats Row (only for crowdfunder) */}
                {pageData.role === 'crowdfunder' && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-6 pt-6 border-t border-slate-200 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-slate-900">${pageData.raised.toFixed(2)}</span>
                      <span className="text-slate-500">raised</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-slate-900">{pageData.supporters}</span>
                      <span className="text-slate-500">supporters</span>
                    </div>
                    {showProgressBar && pageData.goal > 0 && (
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-slate-900">${pageData.goal.toFixed(0)}</span>
                        <span className="text-slate-500">goal</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Progress Bar */}
                {showProgressBar && (
                  <div className="mt-4">
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">
                      {Math.round(progressPercentage)}% of goal reached
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Payment Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {isBusiness ? 'Make a Payment' : isCrowdfunder ? 'Support This Campaign' : `Pay @${pageData.handle}`}
            </h3>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Leave a message..."
                />
              </div>

              {/* Payment Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSupport}
                disabled={!amount || parseFloat(amount) <= 0 || !onChainPage?.exists}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  amount && parseFloat(amount) > 0 && onChainPage?.exists
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!onChainPage?.exists 
                  ? 'Page Not Published Yet'
                  : isCrowdfunder
                  ? `Support $${amount || '0'}`
                  : `Pay $${amount || '0'}`}
              </motion.button>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map((quickAmount) => (
                  <motion.button
                    key={quickAmount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-2 px-3 bg-white/50 text-slate-700 rounded-lg font-medium hover:bg-white/80 transition-colors border border-slate-200"
                  >
                    ${quickAmount}
                  </motion.button>
                ))}
              </div>

              {/* Balance Info */}
              {isConnected && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Wallet className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Your Wallet</h4>
                      <p className="text-blue-700 text-sm">
                        Balance: {balanceFormatted.toFixed(2)} USDC
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Payment Options</h4>
                    <p className="text-slate-600 text-sm">
                      Pay with crypto (USDC) or card/bank. All payments go directly to the recipient's wallet on-chain.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="space-y-4 pt-6 border-t border-slate-200 mt-6">
              <h4 className="text-sm font-semibold text-slate-700">Share this page</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareToTwitter}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-[#1DA1F2] text-white rounded-lg font-medium hover:bg-[#1a8cd8] transition-colors text-sm"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareToTelegram}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-[#0088cc] text-white rounded-lg font-medium hover:bg-[#0077b5] transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Telegram</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEmbedModalOpen(true)}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-white/50 text-slate-700 rounded-lg font-medium hover:bg-white/80 border border-slate-200 text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>Embed</span>
                </motion.button>
              </div>
            </div>

            {/* Create Your Own Page */}
            {!isPageOwner && (
              <div className="pt-6 border-t border-slate-200 mt-6">
                <Link href="/role-selection">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your Own Page</span>
                  </motion.button>
                </Link>
                <p className="text-xs text-slate-500 text-center mt-2">
                  Powered by OnClick • Accept payments globally
                </p>
              </div>
            )}
          </motion.div>

          {/* Recent Payments */}
          {onChainPayments && onChainPayments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card rounded-2xl p-8 mt-8"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Supporters</h3>
              <div className="space-y-4">
                {onChainPayments.slice(0, 5).map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {payment.supporter.slice(2, 4).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {payment.supporter.slice(0, 6)}...{payment.supporter.slice(-4)}
                        </p>
                        {payment.message && (
                          <p className="text-sm text-slate-500">"{payment.message}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${fromUSDCAmount(payment.amount).toFixed(2)}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(Number(payment.timestamp) * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />

      {/* ============================================ */}
      {/* PAYMENT MODALS */}
      {/* ============================================ */}

      {/* Payment Method Selection Modal */}
      {isPaymentModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsPaymentModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Choose Payment Method</h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Amount</span>
                <span className="text-2xl font-bold text-slate-900">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-600">Recipient</span>
                <span className="font-medium text-slate-900">@{pageData.handle}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {/* MiniPay - Show if detected */}
              {isMiniPayUser && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPaymentMethod('minipay')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                    selectedPaymentMethod === 'minipay'
                      ? 'border-green-500 bg-green-50'
                      : 'border-green-300 hover:border-green-400 bg-green-50/30'
                  }`}
                >
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    DETECTED
                  </div>
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900">MiniPay</h4>
                      <p className="text-sm text-slate-600">Fast mobile payments</p>
                    </div>
                  </div>
                </motion.button>
              )}
              
              {/* Crypto Wallet */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPaymentMethod('crypto')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedPaymentMethod === 'crypto'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Wallet className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Pay with USDC</h4>
                    <p className="text-sm text-slate-600">
                      {isConnected ? `Balance: ${balanceFormatted.toFixed(2)} USDC` : 'Connect wallet first'}
                    </p>
                  </div>
                </div>
              </motion.button>
              
              {/* Fiat/Card Payment */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPaymentMethod('fiat')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedPaymentMethod === 'fiat'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Card / Bank</h4>
                    <p className="text-sm text-slate-600">Via Ramp Network</p>
                  </div>
                </div>
              </motion.button>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (selectedPaymentMethod === 'crypto' || selectedPaymentMethod === 'minipay') {
                    handleCryptoPayment();
                  } else if (selectedPaymentMethod === 'fiat') {
                    handleFiatPayment();
                  }
                }}
                disabled={!selectedPaymentMethod}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  selectedPaymentMethod
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {selectedPaymentMethod === 'fiat' ? 'Continue to Card' : 'Pay with USDC'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Crypto Payment Progress Modal */}
      {(paymentStep === 'approving' || paymentStep === 'paying' || paymentStep === 'success' || paymentStep === 'error') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl bg-white"
          >
            {paymentStep === 'approving' && (
              <div className="text-center">
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Approving USDC...</h3>
                <p className="text-slate-600">Please confirm the approval in your wallet</p>
                <p className="text-sm text-slate-500 mt-4">Step 1 of 2</p>
              </div>
            )}
            
            {paymentStep === 'paying' && (
              <div className="text-center">
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sending Payment...</h3>
                <p className="text-slate-600">Sending ${amount} USDC to @{pageData.handle}</p>
                <p className="text-sm text-slate-500 mt-4">Step 2 of 2</p>
              </div>
            )}
            
            {paymentStep === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful! 🎉</h3>
                <p className="text-slate-600 mb-4">Your payment of ${amount} has been sent</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetPayment();
                    setAmount('');
                    setMessage('');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold"
                >
                  Done
                </motion.button>
              </div>
            )}
            
            {paymentStep === 'error' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h3>
                <p className="text-slate-600 mb-4">{paymentErrorMessage || 'Something went wrong'}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => resetPayment()}
                  className="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Try Again
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* QR Share Modal */}
      {isQRModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsQRModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl text-center bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Share @{pageData.handle}
            </h3>
            <div className="bg-white p-6 rounded-xl mb-6 inline-block">
              <QRCode value={typeof window !== 'undefined' ? window.location.href : ''} size={200} />
            </div>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsQRModalOpen(false)}
                className="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Embed Modal */}
      {isEmbedModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsEmbedModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl p-8 max-w-2xl w-full shadow-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Embed Code</h3>
            <p className="text-slate-600 mb-4">
              Copy this code and paste it into your website:
            </p>
            <div className="bg-slate-900 rounded-xl p-4 mb-4 relative">
              <pre className="text-sm text-green-400 overflow-x-auto">
                <code>{getEmbedCode()}</code>
              </pre>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyEmbedCode}
                className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {embedCodeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEmbedModalOpen(false)}
              className="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Ramp Widget (Fiat Payment) */}
      {showRampWidget && amount && (
        <RampEmbedded
          amount={parseFloat(amount)}
          recipientAddress={onChainPage?.walletAddress || connectedAddress || ''}
          onClose={() => setShowRampWidget(false)}
          onSuccess={() => {
            console.log('✅ Ramp payment successful!');
            refetchPage();
            refetchPayments();
            setShowRampWidget(false);
            setAmount('');
            setMessage('');
          }}
        />
      )}
    </div>
  );
}

export default function PublicPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <PublicPageContent />
    </Suspense>
  );
}
