'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Users, Building2, Target, ArrowRight, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const { isConnected } = useWalletConnection();

  const roles = [
    {
      id: 'freelancer',
      title: 'Freelancer',
      subtitle: 'Services & Professionals',
      description: 'Get paid for your services',
      icon: <Users className="w-12 h-12" />,
      features: [
        'Accept client payments',
        'Share via QR & link',
        'Instant settlements'
      ],
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      href: '/create-page?role=freelancer'
    },
    {
      id: 'business',
      title: 'Business',
      subtitle: 'Products & Services',
      description: 'Accept payments globally',
      icon: <Building2 className="w-12 h-12" />,
      features: [
        'Fiat & crypto payments',
        'Worldwide customers',
        'Direct to wallet'
      ],
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      href: '/create-page?role=business'
    },
    {
      id: 'crowdfunder',
      title: 'Crowdfunder',
      subtitle: 'Campaigns & Fundraising',
      description: 'Launch transparent campaigns',
      icon: <Target className="w-12 h-12" />,
      features: [
        'Track goals & progress',
        'Supporter engagement',
        'Transparent funding'
      ],
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      href: '/create-page?role=crowdfunder'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    if (!isConnected) return;
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      // Navigate to handle selection page instead of directly to create page
      router.push(`/handle-selection?role=${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
                Choose Your Role
              </h1>
              <Sparkles className="w-8 h-8 text-blue-500 ml-3" />
            </div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
              Create your personalized payment page in minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wallet connection required message */}
      {!isConnected && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-100 text-yellow-900 rounded-lg text-center border border-yellow-300">
          <span className="font-semibold">Connect your wallet to continue</span>
        </div>
      )}

      {/* Role Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={isConnected ? { scale: 1.02, y: -5 } : {}}
                className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-300 ${
                  isConnected ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${
                  selectedRole === role.id 
                    ? 'ring-4 ring-blue-500 shadow-2xl' 
                    : 'shadow-lg hover:shadow-xl'
                } ${role.bgColor} border border-slate-200`}
                onClick={() => handleRoleSelect(role.id)}
                tabIndex={isConnected ? 0 : -1}
                aria-disabled={!isConnected}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-5`} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">
                      {role.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {role.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-slate-700 mb-6 font-medium">
                    {role.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-grow">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-600 text-sm">
                        <Check className="w-4 h-4 text-blue-500 mr-2.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Selection Status */}
                  <div className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                    selectedRole === role.id
                      ? `bg-gradient-to-r ${role.color} text-white shadow-lg`
                      : 'bg-white/80 text-slate-600 border border-slate-200'
                  }`}>
                    {selectedRole === role.id ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedRole === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Confirmation Button */}
          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mt-12 flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className={`px-8 py-4 bg-gradient-to-r ${
                    roles.find(r => r.id === selectedRole)?.color || 'from-blue-500 to-blue-700'
                  } text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-3`}
                >
                  <span>Confirm & Continue</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Not Sure Yet?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              You can always switch roles later. Start with what feels right.
            </p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-full font-semibold text-lg hover:border-slate-400 transition-colors"
              >
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
