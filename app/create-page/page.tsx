'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Palette, 
  Eye, 
  Check,
  User,
  FileText,
  Tag,
  Image,
  Layout,
  Wallet,
  Globe,
  Sparkles,
  Users,
  Building2,
  Target,
  Loader2,
  X,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromUrl = (searchParams && searchParams.get('role')) || 'creator';
  const nameFromUrl = (searchParams && searchParams.get('name')) || '';
  const handleFromUrl = (searchParams && searchParams.get('handle')) || '';
  const stepFromUrl = (searchParams && searchParams.get('step')) || '';
  
  // Get saved data from localStorage (from handle selection page)
  const getSavedData = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('onclick_page_data');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error reading saved data:', e);
      }
    }
    return null;
  };

  const savedData = getSavedData();
  
  // Initialize step from URL if provided, otherwise default to 1
  const initialStep = stepFromUrl ? parseInt(stepFromUrl, 10) : 1;
  const [currentStep, setCurrentStep] = useState(initialStep >= 1 && initialStep <= 4 ? initialStep : 1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: savedData?.name || nameFromUrl || '',
    description: savedData?.description || '',
    handle: savedData?.handle || handleFromUrl || '',
    role: savedData?.role || roleFromUrl,
    
    // Step 2: Customize
    banner: savedData?.banner || '',
    theme: savedData?.theme || getDefaultTheme(savedData?.role || roleFromUrl),
    layout: savedData?.layout || getDefaultLayout(savedData?.role || roleFromUrl),
    
    // Step 3: Payment Info
    walletAddress: savedData?.walletAddress || '',
    
    // Goal tracking (for creators and crowdfunders)
    goal: savedData?.goal || '',
    
    // Crowdfunder specific
    deadline: savedData?.deadline || '',
    
    // Business specific
    businessType: savedData?.businessType || ''
  });

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [handleAvailability, setHandleAvailability] = useState<'available' | 'unavailable' | 'checking' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reload saved data when component mounts or when navigating back from preview
  useEffect(() => {
    const saved = getSavedData();
    if (saved) {
      setFormData(prev => ({
        ...prev,
        name: saved.name || prev.name,
        description: saved.description || prev.description,
        handle: saved.handle || prev.handle,
        role: saved.role || prev.role,
        banner: saved.banner || prev.banner,
        theme: saved.theme || prev.theme,
        layout: saved.layout || prev.layout,
        walletAddress: saved.walletAddress || prev.walletAddress,
        goal: saved.goal || prev.goal,
        deadline: saved.deadline || prev.deadline,
        businessType: saved.businessType || prev.businessType
      }));
    }
  }, []);

  // Update role and step if URL changes
  useEffect(() => {
    if (searchParams) {
      const role = searchParams.get('role') || 'creator';
      const step = searchParams.get('step');
      if (step) {
        const stepNum = parseInt(step, 10);
        if (stepNum >= 1 && stepNum <= 4) {
          setCurrentStep(stepNum);
        }
      }
      // Only update role/theme/layout if not already set from saved data
      setFormData(prev => {
        if (prev.role !== role) {
          return {
            ...prev,
            role,
            theme: getDefaultTheme(role),
            layout: getDefaultLayout(role)
          };
        }
        return prev;
      });
    }
  }, [searchParams]);

  const roleConfig = {
    creator: {
      title: 'Creator Page',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      themes: ['#8CCDEB', '#A78BFA', '#F472B6', '#34D399', '#60A5FA', '#FB7185'],
      layouts: [
        { id: 'minimal', name: 'Minimal', description: 'Clean and simple', icon: '✨' },
        { id: 'creative', name: 'Creative', description: 'Bold and artistic', icon: '🎨' },
        { id: 'community', name: 'Community', description: 'Engaging and social', icon: '👥' }
      ]
    },
    business: {
      title: 'Business Page',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      themes: ['#4A9BC7', '#0EA5E9', '#0891B2', '#0369A1', '#075985', '#0C4A6E'],
      layouts: [
        { id: 'minimal', name: 'Professional', description: 'Clean and corporate', icon: '💼' },
        { id: 'store', name: 'Store', description: 'Product-focused', icon: '🏪' },
        { id: 'service', name: 'Service', description: 'Service-oriented', icon: '🔧' }
      ]
    },
    crowdfunder: {
      title: 'Crowdfunding Campaign',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-800',
      themes: ['#2E86AB', '#0F4C75', '#062E47', '#E63946', '#F77F00', '#FCBF49'],
      layouts: [
        { id: 'campaign', name: 'Campaign', description: 'Goal-focused with progress', icon: '🎯' },
        { id: 'milestone', name: 'Milestone', description: 'Milestone-driven', icon: '🏆' },
        { id: 'story', name: 'Story', description: 'Narrative-focused', icon: '📖' }
      ]
    }
  };

  const currentRoleConfig = roleConfig[formData.role as keyof typeof roleConfig] || roleConfig.creator;

  const steps = [
    { id: 1, title: 'Basic Info', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Customize', icon: <Palette className="w-5 h-5" /> },
    { id: 3, title: 'Payment', icon: <Wallet className="w-5 h-5" /> },
    { id: 4, title: 'Preview', icon: <Eye className="w-5 h-5" /> }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // If on step 1, go back to handle selection page
      router.push(`/handle-selection?role=${roleFromUrl}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Convert to data URL for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleInputChange('banner', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const generateHandle = () => {
    if (!formData.name.trim()) {
      return;
    }
    const handle = formData.name.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, handle }));
    if (handle) {
      checkHandleAvailability(handle);
    }
  };

  const checkHandleAvailability = async (handle: string) => {
    if (!handle || handle.length < 3) {
      setHandleAvailability(null);
      return;
    }

    setIsCheckingAvailability(true);
    setHandleAvailability('checking');

    // Simulate API call - in production, this would check against your backend
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock availability check - simulate some handles being taken
    const unavailableHandles = ['admin', 'test', 'demo', 'support', 'help', 'api', 'www', 'mail', 'contact'];
    const isAvailable = !unavailableHandles.includes(handle.toLowerCase()) && handle.length >= 3;

    setHandleAvailability(isAvailable ? 'available' : 'unavailable');
    setIsCheckingAvailability(false);
  };

  // Check availability when handle changes
  useEffect(() => {
    if (formData.handle) {
      const timeoutId = setTimeout(() => {
        checkHandleAvailability(formData.handle);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setHandleAvailability(null);
    }
  }, [formData.handle]);

  function getDefaultTheme(role: string): string {
    const themes: Record<string, string> = {
      creator: '#8CCDEB',
      business: '#4A9BC7',
      crowdfunder: '#2E86AB'
    };
    return themes[role] || '#8CCDEB';
  }

  function getDefaultLayout(role: string): string {
    const layouts: Record<string, string> = {
      creator: 'minimal',
      business: 'minimal',
      crowdfunder: 'campaign'
    };
    return layouts[role] || 'minimal';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button - Only show on step 1 */}
          {currentStep === 1 && (
            <Link href={`/handle-selection?role=${roleFromUrl}`}>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Handle Selection</span>
              </motion.button>
            </Link>
          )}
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${currentRoleConfig.color} rounded-2xl mb-4`}>
              {currentRoleConfig.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Create Your OnClick Page
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Build your personalized {formData.role === 'crowdfunder' ? 'crowdfunding' : formData.role === 'business' ? 'business' : 'creator'} page in minutes. Share your link and start receiving support globally.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.id
                        ? 'primary-gradient text-white shadow-lg'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.icon}
                  </motion.div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`font-semibold ${
                      currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 rounded-full ${
                      currentStep > step.id ? 'primary-gradient' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Tell us about yourself</h2>
                    <p className="text-slate-600">Let's start with the basics</p>
                  </div>

                  <div className="space-y-6">
                    {/* Name Display (read-only if from previous step) */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {roleFromUrl === 'business' ? 'Business/Organization Name' : roleFromUrl === 'crowdfunder' ? 'Campaign/Organization Name' : 'Your Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={roleFromUrl === 'business' ? 'Enter your business name' : roleFromUrl === 'crowdfunder' ? 'Enter your campaign or organization name' : 'Enter your name'}
                      />
                      {formData.name && (
                        <p className="text-xs text-slate-500 mt-1">This name will appear on your public page</p>
                      )}
                    </div>

                    {/* Handle Display (read-only, already set) */}
                    {formData.handle && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Your OnClick Handle
                          <span className="text-xs text-green-600 ml-2 font-normal">✓ Already set</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium">
                            onclick/
                          </span>
                          <div className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl bg-green-50 text-slate-900 font-medium flex items-center justify-between">
                            <span>{formData.handle}</span>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Your handle was set in the previous step</p>
                      </div>
                    )}

                    {!formData.handle && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Your OnClick Handle
                        <span className="text-xs text-slate-500 ml-2 font-normal">(Your unique page URL)</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium">
                          onclick/
                        </span>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={formData.handle}
                            onChange={(e) => {
                              const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                              handleInputChange('handle', sanitized);
                            }}
                            className={`w-full px-4 py-3 border rounded-r-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                              handleAvailability === 'available'
                                ? 'border-green-500 focus:ring-green-500'
                                : handleAvailability === 'unavailable'
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-slate-200 focus:ring-blue-500 focus:border-transparent'
                            }`}
                            placeholder="your-handle"
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
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={generateHandle}
                          disabled={!formData.name.trim()}
                          className={`text-sm font-medium transition-colors ${
                            formData.name.trim()
                              ? 'text-blue-600 hover:text-blue-700'
                              : 'text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Generate from name
                          <span className="text-xs ml-1 opacity-75">(Auto-create from your name above)</span>
                        </button>
                        {formData.handle && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-500">
                              Your page: <span className="font-semibold text-slate-700">onclick/{formData.handle}</span>
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
                      {formData.handle && formData.handle.length < 3 && (
                        <p className="text-xs text-amber-600 mt-1">Handle must be at least 3 characters</p>
                      )}
                      {handleAvailability === 'unavailable' && (
                        <p className="text-xs text-red-600 mt-1">This handle is already taken. Please choose another one.</p>
                      )}
                    </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={formData.role === 'crowdfunder' ? 'Tell the story of your campaign and what you\'re raising funds for...' : formData.role === 'business' ? 'Describe your business, products, or services...' : 'Tell people about yourself, your work, or your content...'}
                      />
                    </div>

                    {/* Role-specific fields */}
                    {(formData.role === 'crowdfunder' || formData.role === 'creator') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {formData.role === 'crowdfunder' ? 'Funding Goal ($)' : 'Support Goal ($)'}
                            <span className="text-xs text-slate-500 ml-2 font-normal">
                              {formData.role === 'creator' ? '(Optional - for transparency)' : ''}
                            </span>
                          </label>
                          <input
                            type="number"
                            value={formData.goal}
                            onChange={(e) => handleInputChange('goal', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={formData.role === 'crowdfunder' ? '5000' : '10000'}
                          />
                          {formData.role === 'creator' && (
                            <p className="text-xs text-slate-500 mt-1">
                              Set a goal to track progress and show transparency to your supporters
                            </p>
                          )}
                        </div>
                        {formData.role === 'crowdfunder' && (
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Campaign Deadline
                            </label>
                            <input
                              type="date"
                              value={formData.deadline}
                              onChange={(e) => handleInputChange('deadline', e.target.value)}
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {formData.role === 'business' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Business Type
                        </label>
                        <input
                          type="text"
                          value={formData.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="E-commerce, Service Provider, SaaS, etc."
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Customize */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Customize your page</h2>
                    <p className="text-slate-600">Make it uniquely yours</p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Banner Image
                      </label>
                      {formData.banner ? (
                        <div className="relative">
                          <img 
                            src={formData.banner} 
                            alt="Banner preview" 
                            className="w-full h-48 object-cover rounded-xl border-2 border-slate-200"
                          />
                          <button
                            onClick={() => handleInputChange('banner', '')}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleUploadClick}
                            className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={handleUploadClick}
                          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                        >
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600 mb-2">Upload a banner image</p>
                          <p className="text-sm text-slate-400">Recommended: 1200x400px</p>
                          <p className="text-xs text-slate-500 mt-2">Click to browse files</p>
                        </div>
                      )}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Theme Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {currentRoleConfig.themes.map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleInputChange('theme', color)}
                            className={`w-12 h-12 rounded-xl border-4 transition-all ${
                              formData.theme === color
                                ? 'border-slate-900 shadow-lg'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Layout Style
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentRoleConfig.layouts.map((layout) => (
                          <motion.button
                            key={layout.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleInputChange('layout', layout.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              formData.layout === layout.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-3xl mb-2">{layout.icon}</div>
                            <h3 className="font-semibold text-slate-900 mb-1">{layout.name}</h3>
                            <p className="text-sm text-slate-600">{layout.description}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Info */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment setup</h2>
                    <p className="text-slate-600">Where should payments go?</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        value={formData.walletAddress}
                        onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your Polkadot wallet address"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Payments will be sent directly to this address. No custodial holds.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <Globe className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Universal Payments</h3>
                          <p className="text-blue-700 text-sm mb-3">
                            Your supporters can pay with:
                          </p>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Credit/debit cards (via Transak)</li>
                            <li>• Bank transfers</li>
                            <li>• Mobile money</li>
                            <li>• Crypto (USDC, DOT)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Preview & Publish */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Almost ready!</h2>
                    <p className="text-slate-600">Preview your page and publish</p>
                  </div>

                  <div className="space-y-6">
                    {/* Preview Card */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-white">
                      <h3 className="font-semibold text-slate-900 mb-4">Page Preview</h3>
                      <div className="space-y-4">
                        <div 
                          className="h-32 rounded-lg"
                          style={{ backgroundColor: formData.theme }}
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-slate-200 rounded-full" />
                          <div>
                            <h4 className="font-semibold text-slate-900">{formData.name || 'Your Name'}</h4>
                            <p className="text-sm text-slate-600">{formData.description || 'Your description...'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <Check className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Ready to go live!</h3>
                          <p className="text-blue-700 text-sm">
                            {formData.handle ? (
                              <>Your page will be live at <strong>onclick/{formData.handle}</strong></>
                            ) : (
                              <>Make sure to set your OnClick handle in Step 1</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{currentStep === 1 ? 'Back to Handle Selection' : 'Back'}</span>
              </motion.button>

              <div className="flex items-center space-x-4">
                {currentStep === 4 && (
                  <Link href={formData.handle ? `/${formData.handle}` : `/public-page?role=${formData.role}&layout=${formData.layout}&owner=true`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Save form data to localStorage so public page can access it
                        if (typeof window !== 'undefined' && formData.handle) {
                          // Save by handle for handle-based routing
                          localStorage.setItem(`onclick_page_${formData.handle}`, JSON.stringify(formData));
                          // Also save to general key for backward compatibility
                          localStorage.setItem('onclick_page_data', JSON.stringify(formData));
                          // Set flag to indicate user is the page owner
                          sessionStorage.setItem(`onclick_page_owner_${formData.handle}`, 'true');
                          sessionStorage.setItem('onclick_page_owner', 'true');
                        }
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Preview Page</span>
                    </motion.button>
                  </Link>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentStep === 4 ? () => {
                    // Save form data to localStorage
                    if (typeof window !== 'undefined' && formData.handle) {
                      // Save by handle for handle-based routing
                      localStorage.setItem(`onclick_page_${formData.handle}`, JSON.stringify(formData));
                      // Also save to general key for backward compatibility
                      localStorage.setItem('onclick_page_data', JSON.stringify(formData));
                      // Set flag to indicate user is the page owner
                      sessionStorage.setItem(`onclick_page_owner_${formData.handle}`, 'true');
                      sessionStorage.setItem('onclick_page_owner', 'true');
                      // Navigate to handle-based URL
                      router.push(`/${formData.handle}`);
                    } else {
                      // Fallback to old URL format if no handle
                      localStorage.setItem('onclick_page_data', JSON.stringify(formData));
                      sessionStorage.setItem('onclick_page_owner', 'true');
                      router.push(`/public-page?role=${formData.role}&layout=${formData.layout}&owner=true`);
                    }
                  } : handleNext}
                  className="btn-primary px-8 py-3 flex items-center space-x-2"
                >
                  <span>{currentStep === 4 ? 'Publish Page' : 'Next'}</span>
                  {currentStep < 4 && <ArrowRight className="w-5 h-5" />}
                  {currentStep === 4 && <Sparkles className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
