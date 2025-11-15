'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Loader2,
  Globe,
  Lock,
  Zap,
  Users,
  Building2,
  Target,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

function HandleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromUrl = (searchParams && searchParams.get('role')) || 'creator';
  
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [handleAvailability, setHandleAvailability] = useState<'available' | 'unavailable' | 'checking' | null>(null);

  const roleConfig = {
    creator: {
      title: 'Creator',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      description: 'Your unique handle will be your personal brand on OnClick'
    },
    business: {
      title: 'Business',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Your unique handle represents your business identity'
    },
    crowdfunder: {
      title: 'Crowdfunder',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-800',
      description: 'Your unique handle will be your campaign\'s permanent link'
    }
  };

  const currentRole = roleConfig[roleFromUrl as keyof typeof roleConfig] || roleConfig.creator;

  const generateHandle = () => {
    if (!name.trim()) {
      return;
    }
    const generatedHandle = name.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setHandle(generatedHandle);
    if (generatedHandle) {
      checkHandleAvailability(generatedHandle);
    }
  };

  const checkHandleAvailability = async (handleToCheck: string) => {
    if (!handleToCheck || handleToCheck.length < 3) {
      setHandleAvailability(null);
      return;
    }

    setIsCheckingAvailability(true);
    setHandleAvailability('checking');

    // Simulate API call - in production, this would check against your backend
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock availability check - simulate some handles being taken
    const unavailableHandles = ['admin', 'test', 'demo', 'support', 'help', 'api', 'www', 'mail', 'contact', 'onclick', 'app'];
    const isAvailable = !unavailableHandles.includes(handleToCheck.toLowerCase()) && handleToCheck.length >= 3;

    setHandleAvailability(isAvailable ? 'available' : 'unavailable');
    setIsCheckingAvailability(false);
  };

  // Check availability when handle changes
  useEffect(() => {
    if (handle) {
      const timeoutId = setTimeout(() => {
        checkHandleAvailability(handle);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setHandleAvailability(null);
    }
  }, [handle]);

  const handleContinue = () => {
    if (name.trim() && handle.trim() && handleAvailability === 'available') {
      // Save to localStorage for next page
      if (typeof window !== 'undefined') {
        localStorage.setItem('onclick_page_data', JSON.stringify({
          name: name.trim(),
          handle: handle.trim(),
          role: roleFromUrl
        }));
      }
      router.push(`/create-page?role=${roleFromUrl}&name=${encodeURIComponent(name.trim())}&handle=${encodeURIComponent(handle.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href={`/role-selection`}>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Role Selection</span>
            </motion.button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${currentRole.color} rounded-2xl mb-6`}>
              {currentRole.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Choose Your Unique Handle
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {currentRole.description}. This will be your permanent OnClick URL that you can share with the world.
            </p>
          </motion.div>

          {/* Why Handle Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-blue-500 mr-3" />
              Why Your Handle Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Your Unique Identity</h3>
                <p className="text-sm text-slate-600">
                  Your handle is your unique identifier on OnClick. It's how people will find and remember you.
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">One-Time Selection</h3>
                <p className="text-sm text-slate-600">
                  Once chosen, your handle is permanent. Choose wisely - it becomes part of your brand.
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Easy to Share</h3>
                <p className="text-sm text-slate-600">
                  Share your simple, memorable URL: <span className="font-semibold text-blue-600">onclick/your-handle</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <div className="space-y-8">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {roleFromUrl === 'business' ? 'Business/Organization Name' : roleFromUrl === 'crowdfunder' ? 'Campaign/Organization Name' : 'Your Name'}
                  <span className="text-xs text-slate-500 ml-2 font-normal">(This will appear on your page)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder={roleFromUrl === 'business' ? 'Enter your business name' : roleFromUrl === 'crowdfunder' ? 'Enter your campaign or organization name' : 'Enter your name'}
                />
              </div>

              {/* Handle Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your OnClick Handle
                  <span className="text-xs text-slate-500 ml-2 font-normal">(Your unique URL identifier)</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium">
                    onclick/
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => {
                        const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                        setHandle(sanitized);
                      }}
                      className={`w-full px-4 py-3 border rounded-r-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors text-lg ${
                        handleAvailability === 'available'
                          ? 'border-green-500 focus:ring-green-500'
                          : handleAvailability === 'unavailable'
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      placeholder="your-unique-handle"
                      maxLength={30}
                    />
                    {isCheckingAvailability && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      </div>
                    )}
                    {handleAvailability === 'available' && !isCheckingAvailability && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                    {handleAvailability === 'unavailable' && !isCheckingAvailability && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Helper Text and Generate Button */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={generateHandle}
                    disabled={!name.trim()}
                    className={`text-sm font-medium transition-colors ${
                      name.trim()
                        ? 'text-blue-600 hover:text-blue-700'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    ✨ Generate from {roleFromUrl === 'business' ? 'business name' : roleFromUrl === 'crowdfunder' ? 'campaign name' : 'name'}
                  </button>
                  {handle && (
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-slate-500">
                        Your URL: <span className="font-semibold text-slate-700">onclick/{handle}</span>
                      </span>
                      {handleAvailability === 'available' && (
                        <span className="text-xs text-green-600 font-medium flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Available
                        </span>
                      )}
                      {handleAvailability === 'unavailable' && (
                        <span className="text-xs text-red-600 font-medium flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          Taken
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Validation Messages */}
                {handle && handle.length < 3 && (
                  <p className="text-xs text-amber-600 mt-2">Handle must be at least 3 characters</p>
                )}
                {handleAvailability === 'unavailable' && (
                  <p className="text-xs text-red-600 mt-2">This handle is already taken. Please choose another one.</p>
                )}
                {handleAvailability === 'available' && (
                  <p className="text-xs text-green-600 mt-2">Great choice! This handle is available.</p>
                )}
              </div>

              {/* Continue Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                disabled={!name.trim() || !handle.trim() || handleAvailability !== 'available' || handle.length < 3}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                  name.trim() && handle.trim() && handleAvailability === 'available' && handle.length >= 3
                    ? `bg-gradient-to-r ${currentRole.color} text-white hover:shadow-lg`
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Continue to Page Setup</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function HandleSelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <HandleSelectionContent />
    </Suspense>
  );
}

