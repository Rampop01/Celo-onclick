'use client';

import { motion } from 'framer-motion';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetPage, useGetPayments, usePaymentFlow, useUSDCBalance } from '../../hooks/useContract';
import { fromUSDCAmount } from '../../lib/contract';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  ArrowRight,
  Users,
  DollarSign,
  Clock,
  Globe,
  Shield,
  Zap,
  CreditCard,
  Wallet,
  MessageCircle,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Twitter,
  Edit,
  Plus,
  Target
} from 'lucide-react';
import QRCode from 'react-qr-code';
import Link from 'next/link';

export function PublicPageContent({ handle: handleFromPath }: { handle?: string } = {}) {
  const searchParams = useSearchParams();
  const handleFromUrl = handleFromPath || (searchParams && searchParams.get('handle')) || '';
  type Role = 'creator' | 'business' | 'crowdfunder';
  const roleFromUrl = ((searchParams && searchParams.get('role')) || 'creator') as Role;
  const layoutFromUrl = (searchParams && searchParams.get('layout')) || 'minimal';
  const ownerFromUrl = searchParams && searchParams.get('owner') === 'true';
  
  // Check if this is a preview (accessed via /public-page with owner=true) vs published (accessed via /handle)
  const isPreview = ownerFromUrl && !handleFromPath;
  
  // Check if user is the page owner
  const isPageOwner = typeof window !== 'undefined' && (
    ownerFromUrl || 
    (handleFromUrl && sessionStorage.getItem(`onclick_page_owner_${handleFromUrl}`) === 'true') ||
    sessionStorage.getItem('onclick_page_owner') === 'true'
  );
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txId, setTxId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fiat' | 'crypto' | null>(null);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false);

  // On-chain data hooks
  const { page: onChainPage, isLoading: pageLoading, error: pageError, refetch: refetchPage } = useGetPage(handleFromUrl || undefined);
  const { payments: onChainPayments, isLoading: paymentsLoading, refetch: refetchPayments } = useGetPayments(handleFromUrl || undefined);
  const { balanceFormatted } = useUSDCBalance();
  const { startPayment, step: paymentStep, isSuccess: paymentIsSuccess, errorMessage: paymentErrorMessage, reset: resetPayment } = usePaymentFlow();

  // Auto-refetch when payment succeeds
  useEffect(() => {
    if (paymentIsSuccess) {
      setTimeout(() => {
        refetchPage();
        refetchPayments();
      }, 2000);
    }
  }, [paymentIsSuccess, refetchPage, refetchPayments]);

  // Get form data from localStorage by handle or use defaults
  const getSavedFormData = () => {
    if (typeof window !== 'undefined') {
      try {
        // If we have a handle, try to get data by handle first
        if (handleFromUrl) {
          const savedByHandle = localStorage.getItem(`onclick_page_${handleFromUrl}`);
          if (savedByHandle) {
            return JSON.parse(savedByHandle);
          }
        }
        // Fallback to general onclick_page_data (for backward compatibility)
        const saved = localStorage.getItem('onclick_page_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          // If the handle matches, use it
          if (!handleFromUrl || parsed.handle === handleFromUrl) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error reading saved form data:', e);
      }
    }
    return null;
  };

  const savedFormData = getSavedFormData();
  
  // Use saved form data if available, otherwise use defaults
  const pageData = savedFormData ? {
    role: savedFormData.role || roleFromUrl,
    name: savedFormData.name || (roleFromUrl === 'crowdfunder' ? 'EcoTech Solutions' : roleFromUrl === 'business' ? 'TechStart Inc.' : 'Sarah Chen'),
    title: savedFormData.businessType 
      ? savedFormData.businessType 
      : (roleFromUrl === 'crowdfunder' 
        ? 'Sustainable Blockchain Infrastructure' 
        : roleFromUrl === 'business' 
        ? 'Innovative Web3 Solutions' 
        : 'Digital Artist & Creator'),
    description: savedFormData.description || (roleFromUrl === 'crowdfunder' 
      ? 'Building the next generation of eco-friendly blockchain infrastructure. Help us create a greener future for Web3!'
      : roleFromUrl === 'business'
      ? 'Providing cutting-edge Web3 solutions for businesses worldwide. Accept payments seamlessly with crypto or fiat.'
      : 'Creating beautiful digital art and helping other artists grow their skills. Your support helps me continue creating and sharing knowledge with the community.'),
    avatar: savedFormData.avatar || (roleFromUrl === 'crowdfunder' 
      ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop'
      : roleFromUrl === 'business'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
      : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
    banner: savedFormData.banner || (roleFromUrl === 'crowdfunder'
      ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop'
      : roleFromUrl === 'business'
      ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop'
      : 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=400&fit=crop'),
    raised: savedFormData.raised || (roleFromUrl === 'crowdfunder' ? 30000 : roleFromUrl === 'business' ? 45230 : 2847),
    goal: savedFormData.goal ? parseFloat(savedFormData.goal) : (roleFromUrl === 'crowdfunder' ? 50000 : roleFromUrl === 'business' ? 0 : 5000),
    supporters: savedFormData.supporters || (roleFromUrl === 'crowdfunder' ? 234 : roleFromUrl === 'business' ? 156 : 127),
    handle: savedFormData.handle || (roleFromUrl === 'crowdfunder' ? 'ecotech' : roleFromUrl === 'business' ? 'techstart' : 'sarahchen'),
    theme: savedFormData.theme || (roleFromUrl === 'crowdfunder' ? '#2E86AB' : roleFromUrl === 'business' ? '#4A9BC7' : '#8CCDEB'),
    deadline: savedFormData.deadline || ''
  } : {
    role: roleFromUrl,
    name: roleFromUrl === 'crowdfunder' ? 'EcoTech Solutions' : roleFromUrl === 'business' ? 'TechStart Inc.' : 'Sarah Chen',
    title: roleFromUrl === 'crowdfunder' ? 'Sustainable Blockchain Infrastructure' : roleFromUrl === 'business' ? 'Innovative Web3 Solutions' : 'Digital Artist & Creator',
    description: roleFromUrl === 'crowdfunder' 
      ? 'Building the next generation of eco-friendly blockchain infrastructure. Help us create a greener future for Web3!'
      : roleFromUrl === 'business'
      ? 'Providing cutting-edge Web3 solutions for businesses worldwide. Accept payments seamlessly with crypto or fiat.'
      : 'Creating beautiful digital art and helping other artists grow their skills. Your support helps me continue creating and sharing knowledge with the community.',
    avatar: roleFromUrl === 'crowdfunder' 
      ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop'
      : roleFromUrl === 'business'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
      : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    banner: roleFromUrl === 'crowdfunder'
      ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop'
      : roleFromUrl === 'business'
      ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop'
      : 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=400&fit=crop',
    raised: roleFromUrl === 'crowdfunder' ? 30000 : roleFromUrl === 'business' ? 45230 : 2847,
    goal: roleFromUrl === 'crowdfunder' ? 50000 : roleFromUrl === 'business' ? 0 : 5000,
    supporters: roleFromUrl === 'crowdfunder' ? 234 : roleFromUrl === 'business' ? 156 : 127,
    handle: roleFromUrl === 'crowdfunder' ? 'ecotech' : roleFromUrl === 'business' ? 'techstart' : 'sarahchen',
    theme: roleFromUrl === 'crowdfunder' ? '#2E86AB' : roleFromUrl === 'business' ? '#4A9BC7' : '#8CCDEB',
    deadline: ''
  };

  const progressPercentage = pageData.goal > 0 ? (pageData.raised / pageData.goal) * 100 : 0;
  // Show progress bar for crowdfunders or creators with a goal set
  const showProgressBar = (['crowdfunder', 'creator'] as Role[]).includes(roleFromUrl) && pageData.goal > 0;
  const isBusiness = roleFromUrl === 'business';
  const isCrowdfunder = roleFromUrl === 'crowdfunder';
 
  const handleSupport = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    setTxId(transactionId);
    setPaymentSuccess(true);
    setIsPaymentModalOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = () => {
    setIsQRModalOpen(true);
  };

  const shareToTwitter = () => {
    const text = roleFromUrl === 'business' 
      ? `Check out ${pageData.name} on OnClick!`
      : roleFromUrl === 'crowdfunder'
      ? `Support ${pageData.name}'s campaign on OnClick!`
      : `Support ${pageData.name} on OnClick!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToTelegram = () => {
    const text = roleFromUrl === 'business' 
      ? `Check out ${pageData.name} on OnClick!`
      : roleFromUrl === 'crowdfunder'
      ? `Support ${pageData.name}'s campaign on OnClick!`
      : `Support ${pageData.name} on OnClick!`;
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

  // Render different layout structures based on layout type
  const renderLayout = () => {
    // HERO SECTION LAYOUTS (Full Screen Hero)
    if (
      (roleFromUrl === 'creator' && layoutFromUrl === 'creative') ||
      (roleFromUrl === 'business' && layoutFromUrl === 'store') ||
      (roleFromUrl === 'crowdfunder' && layoutFromUrl === 'milestone')
    ) {
      return (
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Full Screen Background */}
          <div className="absolute inset-0">
            <img
              src={pageData.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          {/* Back Button - Only show during preview (not after publishing) */}
          {isPageOwner && isPreview && (
            <Link href={`/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4`}>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-6 left-6 p-3 glass-card rounded-full text-white hover:bg-white/20 transition-colors z-50"
                title="Back to Edit"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
            </Link>
          )}
          
          {/* Edit Button - Only show for page owners */}
          {isPageOwner && (
            <Link href={handleFromUrl ? `/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4&handle=${handleFromUrl}` : `/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4`}>
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute ${isPreview ? 'top-20' : 'top-6'} left-6 px-4 py-2 glass-card rounded-full text-white hover:bg-white/20 transition-colors z-50 flex items-center space-x-2`}
                title="Edit Page"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </motion.button>
            </Link>
          )}

          {/* Share Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="absolute top-6 right-6 p-3 glass-card rounded-full text-white hover:bg-white/20 transition-colors z-50"
          >
            <Share2 className="w-6 h-6" />
          </motion.button>

          {/* Centered Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-32">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              src={pageData.avatar}
              alt={pageData.name}
              className="w-32 h-32 rounded-full border-8 border-white shadow-2xl mx-auto mb-8"
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white mb-6"
            >
              {pageData.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white/90 mb-6"
            >
              {pageData.title}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
            >
              {pageData.description}
            </motion.p>
          </div>
        </section>
      );
    }

    // CARD-BASED LAYOUTS (Community, Story, Service)
    if (
      (roleFromUrl === 'creator' && layoutFromUrl === 'community') ||
      (roleFromUrl === 'crowdfunder' && layoutFromUrl === 'story') ||
      (roleFromUrl === 'business' && layoutFromUrl === 'service')
    ) {
      return (
        <section className="relative pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back and Edit Buttons - Only show for page owners */}
            {isPageOwner && (
              <div className="mb-8 flex items-center space-x-4">
                {/* Back Button - Only show during preview */}
                {isPreview && (
                  <Link href={`/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4`}>
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </motion.button>
                  </Link>
                )}
                <Link href={handleFromUrl ? `/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4&handle=${handleFromUrl}` : `/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4`}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Page</span>
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Avatar Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 text-center shadow-xl"
              >
                <img
                  src={pageData.avatar}
                  alt={pageData.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{pageData.name}</h2>
                <p className="text-slate-600">{pageData.title}</p>
              </motion.div>

              {/* Description Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 glass-card rounded-2xl p-8 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4">About</h3>
                <p className="text-slate-700 leading-relaxed">{pageData.description}</p>
              </motion.div>
            </div>
          </div>
        </section>
      );
    }

    // DEFAULT/CLEAN LAYOUT (Minimal layouts)
    return (
      <section className="relative pt-20 pb-16">
        {/* Banner */}
        <div className="h-64 relative overflow-hidden mb-8">
          <img
            src={pageData.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Back Button - Only show during preview (not after publishing) */}
          {isPageOwner && isPreview && (
            <Link href={`/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4`}>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-6 left-6 p-3 glass-card rounded-full text-white hover:bg-white/20 transition-colors"
                title="Back to Edit"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
            </Link>
          )}
          
          {/* Edit Button - Only show for page owners */}
          {isPageOwner && (
            <Link href={handleFromUrl ? `/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4&handle=${handleFromUrl}` : `/create-page?role=${roleFromUrl}&layout=${layoutFromUrl}&step=4`}>
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute ${isPreview ? 'top-20' : 'top-6'} left-6 px-4 py-2 glass-card rounded-full text-white hover:bg-white/20 transition-colors z-50 flex items-center space-x-2`}
                title="Edit Page"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </motion.button>
            </Link>
          )}

          {/* Share Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
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
            className="glass-card rounded-2xl p-8 shadow-xl bg-white"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
              <img
                src={pageData.avatar}
                alt={pageData.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{pageData.name}</h1>
                <p className="text-xl text-slate-600 mb-4">{pageData.title}</p>
                <p className="text-slate-700 leading-relaxed">{pageData.description}</p>
                {roleFromUrl === 'crowdfunder' && pageData.deadline && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">
                      {(() => {
                        const deadline = new Date(pageData.deadline);
                        const now = new Date();
                        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        return daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended';
                      })()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pb-16">
        {renderLayout()}

        {/* Content Section - Adjust layout based on layout type */}
        <div className={`${
          (roleFromUrl === 'creator' && layoutFromUrl === 'community') ||
          (roleFromUrl === 'crowdfunder' && layoutFromUrl === 'story') ||
          (roleFromUrl === 'business' && layoutFromUrl === 'service')
            ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-0'
            : (roleFromUrl === 'creator' && layoutFromUrl === 'creative') ||
              (roleFromUrl === 'business' && layoutFromUrl === 'store') ||
              (roleFromUrl === 'crowdfunder' && layoutFromUrl === 'milestone')
            ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0'
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8'
        }`}>
          {/* Card-based layout - Payment card spans both cards above */}
          {(roleFromUrl === 'creator' && layoutFromUrl === 'community') ||
          (roleFromUrl === 'crowdfunder' && layoutFromUrl === 'story') ||
          (roleFromUrl === 'business' && layoutFromUrl === 'service') ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment card spanning all 3 columns (profile + description width) */}
                <div className="md:col-span-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="glass-card rounded-2xl p-8"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      {isBusiness ? 'Make a Payment' : isCrowdfunder ? 'Support Campaign' : `Donate to ${pageData.name}`}
                    </h3>

                    <div className="space-y-6">
                      {/* Amount Input */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          placeholder="Enter amount"
                          min="1"
                        />
                      </div>

                      {/* Message Input */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {isBusiness ? 'Notes (optional)' : 'Message (optional)'}
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder={isBusiness ? 'Add order notes or special instructions...' : isCrowdfunder ? 'Leave a message of support...' : 'Leave a message...'}
                        />
                      </div>

                      {/* Payment Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSupport}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                          amount && parseFloat(amount) > 0
                            ? 'hover:shadow-lg text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                        style={amount && parseFloat(amount) > 0 ? { backgroundColor: pageData.theme } : {}}
                      >
                        {isBusiness
                          ? `Pay $${amount || '0'}`
                          : isCrowdfunder
                          ? `Support $${amount || '0'}`
                          : `Donate $${amount || '0'}`}
                      </motion.button>

                      {/* Quick Amount Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {[10, 25, 50].map((quickAmount) => (
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

                      {/* Payment Methods Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <Globe className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-1">Universal Payments</h4>
                            <p className="text-blue-700 text-sm">
                              Pay with card, bank transfer, or crypto. All payments go directly to {pageData.name}'s wallet.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Share & Embed Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-200 mt-6">
                      <h4 className="text-sm font-semibold text-slate-700">Share this page</h4>
                      
                      {/* Social Share Buttons */}
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

                      {/* Copy Link & QR Code */}
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCopyLink}
                          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                            copied
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200'
                          }`}
                        >
                          <Copy className="w-4 h-4" />
                          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleShare}
                          className="flex items-center justify-center space-x-2 py-2 px-3 bg-white/50 text-slate-700 rounded-lg font-medium hover:bg-white/80 border border-slate-200 text-sm"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>QR Code</span>
                        </motion.button>
                      </div>

                      {/* Embed Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEmbedModalOpen(true)}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 border border-slate-200 text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Get Embed Code</span>
                      </motion.button>
                    </div>

                    {/* Promotional Button - Only show for visitors (not page owners) */}
                    {!isPageOwner && (
                      <div className="pt-4 border-t border-slate-200 mt-4">
                        <Link href="/">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                          >
                            <Plus className="w-5 h-5" />
                            <span>Create Your Own Payment Page</span>
                          </motion.button>
                        </Link>
                        <p className="text-xs text-slate-500 text-center mt-2">
                          Powered by OnClick
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          ) : showProgressBar ? (
            // Grid layout for crowdfunders and creators with progress bar
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${
              (roleFromUrl === 'creator' && layoutFromUrl === 'creative') ||
              (roleFromUrl === 'crowdfunder' && layoutFromUrl === 'milestone')
                ? 'pt-16'
                : ''
            }`}>
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Progress Section - For Crowdfunders and Creators with goals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="glass-card rounded-3xl p-8 mb-8 shadow-xl border border-white/50"
                >
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-black text-slate-900">
                        {roleFromUrl === 'crowdfunder' ? 'Campaign Progress' : 'Support Progress'}
                      </h2>
                      <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                        progressPercentage >= 100 
                          ? 'bg-green-100 text-green-700' 
                          : progressPercentage >= 50
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {Math.min(Math.round(progressPercentage), 100)}% {progressPercentage > 100 ? 'Complete!' : (roleFromUrl === 'crowdfunder' ? 'funded' : 'supported')}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full relative overflow-hidden"
                          style={{ 
                            background: progressPercentage >= 100
                              ? `linear-gradient(90deg, ${pageData.theme} 0%, ${pageData.theme}dd 100%)`
                              : `linear-gradient(90deg, ${pageData.theme} 0%, ${pageData.theme}cc 100%)`
                          }}
                        >
                          {progressPercentage > 100 && (
                            <motion.div
                              animate={{ 
                                backgroundPosition: ['0% 50%', '100% 50%'],
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: "linear" 
                              }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              style={{ backgroundSize: '200% 100%' }}
                            />
                          )}
                        </motion.div>
                      </div>
                      {progressPercentage > 100 && (
                        <div className="absolute -top-10 right-0 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                          +${(pageData.raised - pageData.goal).toLocaleString()} over goal! 🎉
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 hover:shadow-md transition-shadow">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-black text-slate-900 mb-1">
                        ${pageData.raised.toLocaleString()}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        {roleFromUrl === 'crowdfunder' ? 'Raised' : 'Received'}
                      </div>
                    </div>
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 hover:shadow-md transition-shadow">
                      <Target className="w-6 h-6 text-slate-600 mx-auto mb-3" />
                      <div className="text-3xl font-black text-slate-900 mb-1">
                        ${pageData.goal.toLocaleString()}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Goal
                      </div>
                    </div>
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 hover:shadow-md transition-shadow">
                      <Users className="w-6 h-6 text-purple-600 mx-auto mb-3" />
                      <div className="text-3xl font-black text-slate-900 mb-1">
                        {pageData.supporters}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Supporters
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Payment Panel */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="glass-card rounded-2xl p-8 sticky top-24"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {isBusiness ? 'Make a Payment' : isCrowdfunder ? 'Support Campaign' : `Donate to ${pageData.name}`}
                </h3>

                <div className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="Enter amount"
                      min="1"
                    />
                  </div>

                  {/* Message Input */}
                                      <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {isBusiness ? 'Notes (optional)' : 'Message (optional)'}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder={isBusiness ? 'Add order notes or special instructions...' : isCrowdfunder ? 'Leave a message of support...' : 'Leave a message...'}
                      />
                    </div>

                   {/* Payment Button */}
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={handleSupport}
                     disabled={!amount || parseFloat(amount) <= 0}
                     className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                       amount && parseFloat(amount) > 0
                         ? 'hover:shadow-lg text-white'
                         : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                     }`}
                     style={amount && parseFloat(amount) > 0 ? { backgroundColor: pageData.theme } : {}}
                   >
                     {isBusiness
                       ? `Pay $${amount || '0'}`
                       : isCrowdfunder
                       ? `Support $${amount || '0'}`
                       : `Donate $${amount || '0'}`}
                   </motion.button>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 25, 50].map((quickAmount) => (
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

                  {/* Payment Methods Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Universal Payments</h4>
                        <p className="text-blue-700 text-sm">
                          Pay with card, bank transfer, or crypto. All payments go directly to {pageData.name}'s wallet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Share & Embed Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700">Share this page</h4>
                    
                    {/* Social Share Buttons */}
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

                    {/* Copy Link & QR Code */}
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopyLink}
                        className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                          copied
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShare}
                        className="flex items-center justify-center space-x-2 py-2 px-3 bg-white/50 text-slate-700 rounded-lg font-medium hover:bg-white/80 border border-slate-200 text-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>QR Code</span>
                      </motion.button>
                    </div>

                    {/* Embed Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEmbedModalOpen(true)}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 border border-slate-200 text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Get Embed Code</span>
                    </motion.button>
                  </div>

                  {/* Promotional Button - Only show for visitors (not page owners) */}
                  {!isPageOwner && (
                    <div className="pt-4 border-t border-slate-200 mt-4">
                      <Link href="/">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Create Your Own Payment Page</span>
                        </motion.button>
                      </Link>
                      <p className="text-xs text-slate-500 text-center mt-2">
                        Powered by OnClick
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          ) : (
            // Centered layout for business and creator roles
            <div className={`flex justify-center ${
              (roleFromUrl === 'creator' && layoutFromUrl === 'creative') ||
              (roleFromUrl === 'business' && layoutFromUrl === 'store') ||
              (roleFromUrl === 'crowdfunder' && layoutFromUrl === 'milestone')
                ? 'pt-16'
                : ''
            }`}>
              <div className="w-full max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="glass-card rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    {isBusiness ? 'Make a Payment' : isCrowdfunder ? 'Support Campaign' : `Donate to ${pageData.name}`}
                  </h3>

                  <div className="space-y-6">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        placeholder="Enter amount"
                        min="1"
                      />
                    </div>

                    {/* Message Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {isBusiness ? 'Notes (optional)' : 'Message (optional)'}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder={isBusiness ? 'Add order notes or special instructions...' : isCrowdfunder ? 'Leave a message of support...' : 'Leave a message...'}
                      />
                    </div>

                    {/* Payment Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSupport}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                        amount && parseFloat(amount) > 0
                          ? 'hover:shadow-lg text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                      style={amount && parseFloat(amount) > 0 ? { backgroundColor: pageData.theme } : {}}
                    >
                      {isBusiness
                        ? `Pay $${amount || '0'}`
                        : isCrowdfunder
                        ? `Support $${amount || '0'}`
                        : `Donate $${amount || '0'}`}
                    </motion.button>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 25, 50].map((quickAmount) => (
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

                    {/* Payment Methods Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Globe className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Universal Payments</h4>
                          <p className="text-blue-700 text-sm">
                            Pay with card, bank transfer, or crypto. All payments go directly to {pageData.name}'s wallet.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share & Embed Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700">Share this page</h4>
                    
                    {/* Social Share Buttons */}
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

                    {/* Copy Link & QR Code */}
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopyLink}
                        className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                          copied
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShare}
                        className="flex items-center justify-center space-x-2 py-2 px-3 bg-white/50 text-slate-700 rounded-lg font-medium hover:bg-white/80 border border-slate-200 text-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>QR Code</span>
                      </motion.button>
                    </div>

                    {/* Embed Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEmbedModalOpen(true)}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 border border-slate-200 text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Get Embed Code</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Payment Modal */}
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
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Choose Payment Method
              </h3>
                             <p className="text-slate-600">
                 {roleFromUrl === 'business' ? `Pay ${pageData.name}` : roleFromUrl === 'crowdfunder' ? `Support ${pageData.name}` : `Donate to ${pageData.name}`} with ${amount}
               </p>
            </div>

            <div className="space-y-4 mb-6">
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
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Pay with Card</h4>
                    <p className="text-sm text-slate-600">Credit card, bank transfer, mobile money</p>
                  </div>
                </div>
              </motion.button>

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
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Pay with Crypto</h4>
                    <p className="text-sm text-slate-600">USDC, DOT, or other supported tokens</p>
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
                  // Simulate payment success
                  const mockTxId = '0x' + Math.random().toString(16).substr(2, 8);
                  handlePaymentSuccess(mockTxId);
                }}
                disabled={!selectedPaymentMethod}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  selectedPaymentMethod
                    ? 'btn-primary'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue
              </motion.button>
            </div>
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
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Share {pageData.name}'s Page
            </h3>
            <div className="bg-white p-6 rounded-xl mb-6">
              <QRCode value={window.location.href} size={200} />
            </div>
            <div className="space-y-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {copied ? 'Link Copied!' : 'Copy Link'}
              </motion.button>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareToTwitter}
                  className="flex-1 py-2 px-4 bg-[#1DA1F2] text-white rounded-lg font-medium hover:bg-[#1a8cd8] transition-colors text-sm"
                >
                  Share on Twitter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareToTelegram}
                  className="flex-1 py-2 px-4 bg-[#0088cc] text-white rounded-lg font-medium hover:bg-[#0077b5] transition-colors text-sm"
                >
                  Share on Telegram
                </motion.button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsQRModalOpen(false)}
              className="btn-primary px-6 py-3"
            >
              Close
            </motion.button>
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
            className="glass-card rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Embed Button Code
            </h3>
            <p className="text-slate-600 mb-4">
              Copy this code and paste it into your website HTML to embed a payment button:
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
            {embedCodeCopied && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 text-sm mb-4"
              >
                Embed code copied to clipboard!
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEmbedModalOpen(false)}
              className="btn-primary px-6 py-3 w-full"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Success Modal */}
      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setPaymentSuccess(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Payment Successful! 🎉
            </h3>
            <p className="text-slate-600 mb-4">
              {roleFromUrl === 'business' 
                ? `Thank you for your payment to ${pageData.name}!`
                : roleFromUrl === 'crowdfunder'
                ? `Thank you for supporting ${pageData.name}!`
                : `Thank you for donating to ${pageData.name}!`}
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Transaction ID: {txId}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPaymentSuccess(false)}
              className="btn-primary px-6 py-3"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
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