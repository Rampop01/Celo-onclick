'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ArrowRight,
  ArrowDownRight,
  Zap,
  Globe,
  Shield,
  CheckCircle,
  Sparkles,
  Users,
  Building2,
  Target,
} from 'lucide-react';

const roles = [
  {
    title: 'Creator',
    description: 'Monetize your content and build a loyal community',
    icon: <Users className="w-8 h-8" />,
    gradient: 'from-blue-400 via-indigo-400 to-blue-600',
  },
  {
    title: 'Business',
    description: 'Accept payments and sell products globally',
    icon: <Building2 className="w-8 h-8" />,
    gradient: 'from-blue-500 via-cyan-400 to-blue-500',
  },
  {
    title: 'Crowdfunder',
    description: 'Launch campaigns and reach your funding goals',
    icon: <Target className="w-8 h-8" />,
    gradient: 'from-indigo-500 via-blue-500 to-indigo-700',
  },
];

const features = [
  {
    title: 'Lightning Fast',
    description: 'Payments processed in seconds, not minutes. Your supporters get instant confirmation.',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Global Reach',
    description: 'Accept payments from anywhere in the world. No borders, no restrictions.',
    icon: <Globe className="w-6 h-6" />,
  },
  {
    title: 'Multiple Payment Options',
    description: 'Crypto, cards, bank transfers. Your supporters choose how they want to pay.',
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: 'Beautiful Pages',
    description: 'Create stunning payment pages that reflect your brand and personality.',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: 'QR Codes & Embeds',
    description:
      'Generate shareable QR codes and embeddable buttons so supporters can spread your page directly on their socials.',
    icon: <Users className="w-6 h-6" />,
  },
];

const DiamondCard = ({
  feature,
  index,
  positionClass,
}: {
  feature: (typeof features)[number];
  index: number;
  positionClass: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    whileHover={{ scale: 1.04 }}
    className={`absolute h-48 w-48 md:h-56 md:w-56 ${positionClass}`}
  >
    <div className="absolute inset-0 rotate-45 rounded-[32px] bg-white shadow-xl shadow-blue-100/60 border border-slate-200 flex items-center justify-center">
      <div className="-rotate-45 px-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
      </div>
    </div>
    <div className="absolute inset-0 rotate-45 rounded-[32px] bg-blue-200/20" />
  </motion.div>
);

const overviewHighlights = [
  {
    label: 'Overview',
    text: 'Onclick bridges fiat simplicity with on-chain transparency—supporters pay however they want, recipients always receive crypto instantly.',
  },
  {
    label: 'Core Vision',
    text: 'Empower creators, NGOs, and businesses with borderless, self-custodial payments anyone can send—even without owning crypto.',
  },
  {
    label: 'Tagline',
    text: '“One click. Global reach. Instant crypto.”',
  },
];

const problemPoints = [
  'Non-crypto supporters drop off when prompted to connect wallets or buy tokens.',
  'Traditional processors hold funds, charge high fees, and hide settlement visibility.',
  'Crypto tooling is fragmented and inaccessible for mainstream audiences.',
];

const solutionPoints = [
  'Unified payment flow that lets supporters choose local fiat or crypto while recipients always receive USDC.',
  'Direct on-chain settlement on Polkadot—no custodial holds, no delays.',
  'Gasless UX with sponsored fees and transparent, publicly auditable donation records.',
];

const flowSteps = [
  {
    title: '1. Universal Onclick Link',
    text: 'Personalised handles, themed hosted pages, and embeddable widgets ready to share everywhere.',
  },
  {
    title: '2. Dual Payment Rails',
    text: 'Supporters choose local currency or crypto in one flow, while you always receive verified digital assets.',
  },
  {
    title: '3. Instant Settlement',
    text: 'Funds settle straight to your wallet with optional goal tracking and progress bars for full transparency.',
  },
];

const targetUsers = [
  {
    title: 'Creators & Influencers',
    text: 'Launch tip jars, sell digital drops, and reward superfans globally with one link.',
  },
  {
    title: 'NGOs & Community Projects',
    text: 'Accept transparent donations with on-chain records, wallet splits, and global reach.',
  },
  {
    title: 'SMEs & Businesses',
    text: 'Offer local checkout while settling in crypto—perfect for global storefronts and memberships.',
  },
  {
    title: 'Supporters & Customers',
    text: 'Pay with fiat or crypto in under two minutes, no wallet required to start.',
  },
];

const roadmapPhases = [
  {
    phase: 'Phase 1 – Core Launch',
    detail: 'Hosted pages, universal links, dual payment rails, and direct wallet settlements.',
  },
  {
    phase: 'Phase 2 – Product Maturity',
    detail: 'Auto-split wallets, recurring donations, and analytics dashboard rollouts.',
  },
  {
    phase: 'Phase 3 – Growth',
    detail: 'Expanded on/off ramps, embedded wallets, and social login support.',
  },
  {
    phase: 'Phase 4 – Ecosystem',
    detail: 'SDKs for platforms, multi-chain expansion, and full account abstraction.',
  },
];

const successMetrics = [
  { label: 'Creators onboarded', value: '1,000', sub: 'within 6 months' },
  { label: 'Average checkout time', value: '< 2 min', sub: 'frictionless completion' },
  { label: 'Checkout success rate', value: '> 70%', sub: 'for all payment flows' },
  { label: 'Repeat supporter rate', value: '> 25%', sub: 'shows long-term engagement' },
  { label: 'Fiat adoption', value: '40%', sub: 'of volume via local currency' },
  { label: 'Settlement speed', value: '< 30s', sub: 'direct on-chain payouts' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-900 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-10 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-28 px-4 sm:px-6 lg:px-12">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="https://res.cloudinary.com/dxswouxj5/video/upload/v1761270457/6913299_Motion_Graphics_Motion_Graphic_1080x1920_u1bpqe.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
            <motion.div
              className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/25 blur-3xl"
              animate={{ x: ['-50%', '40%', '-30%', '-50%'], opacity: [0.3, 0.6, 0.3, 0.4] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"
              animate={{ y: [20, -40, 10], opacity: [0.15, 0.35, 0.2] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            />
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white text-center"
            >
              Seamless Web3 payments for everyone
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto"
            >
              Create beautiful payment pages, accept crypto globally, and grow your community with the most intuitive Web3 payment platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/role-selection"
                className="inline-flex items-center justify-center rounded-full bg-white text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:bg-slate-100 transition-all"
              >
                Create Your Page
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/public-page"
                className="inline-flex items-center justify-center rounded-full border border-white/60 bg-transparent px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all"
              >
                Explore Creators
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Payment Flow */}
        <section className="relative -mt-12 px-4 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {flowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-[32px] bg-white shadow-xl shadow-blue-100/60 border border-white/70 px-8 py-10"
              >
                <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Roles in Orbits */}
        <section className="py-20 px-4 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-black text-slate-900"
            >
              Built for every kind of builder
            </motion.h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Choose a starting point and craft a page that reflects your brand identity while staying transparent with supporters.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
              {roles.map((role, index) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, scale: 0.85, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut' }}
                    className={`mx-auto flex h-64 w-64 flex-col items-center justify-center rounded-full bg-gradient-to-br ${role.gradient} text-white shadow-2xl`}
                  >
                    <div className="mb-4 rounded-full bg-white/20 p-4">
                      {role.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{role.title}</h3>
                    <p className="mt-3 text-sm text-white/80 px-6 leading-relaxed">{role.description}</p>
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 mx-auto h-64 w-64 rounded-full border border-white/50"
                    animate={{ rotate: [0, 6, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-12 overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dxswouxj5/image/upload/v1763029768/3392075_zeeyay.jpg')" }}
          />
          <div className="absolute inset-0 z-10 bg-white/35 backdrop-blur-[1px]" />
          <div className="relative z-20 max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center text-4xl md:text-5xl font-black text-slate-900"
            >
              Roadmap to the universal payment layer
            </motion.h2>
            <div className="mt-16 relative">
              <div className="absolute left-1/2 top-0 bottom-0 hidden w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-300 via-blue-100 to-transparent md:block" />
              <div className="space-y-12">
                {roadmapPhases.map((phase, index) => (
                  <motion.div
                    key={phase.phase}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white font-bold shadow-xl">
                      {index + 1}
                    </div>
                    <div className="md:w-1/2 rounded-3xl bg-white px-8 py-6 shadow-lg border border-white/60">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{phase.phase}</h3>
                      <p className="text-slate-600 leading-relaxed">{phase.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature stream */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-12 overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dxswouxj5/image/upload/v1763036363/10515443_mt9s3c.png')" }}
          />
          <div className="absolute inset-0 z-10 bg-white/35 backdrop-blur-[1px]" />
          <div className="relative z-20 max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-black text-slate-900"
            >
              Why choose OnClick?
            </motion.h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              The entire platform is orchestrated to feel elegant, fast, and transparent for both supporters and recipients.
            </p>
          </div>

          <div className="relative z-20 mx-auto mt-20 h-[500px] w-full max-w-6xl px-4">
            {/* Top row - 3 cards evenly spaced */}
            <DiamondCard feature={features[0]} index={0} positionClass="left-[8%] top-0" />
            <DiamondCard feature={features[1]} index={1} positionClass="left-1/2 -translate-x-1/2 top-0" />
            <DiamondCard feature={features[2]} index={2} positionClass="right-[8%] top-0" />
            
            {/* Bottom row - 2 cards positioned in the gaps between top cards */}
            <DiamondCard feature={features[3]} index={3} positionClass="left-[25%] top-[260px]" />
            <DiamondCard feature={features[4]} index={4} positionClass="right-[25%] top-[260px]" />
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-12 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl"
              animate={{ opacity: [0.25, 0.6, 0.3], scale: [1, 1.1, 0.95] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/2 right-8 h-80 w-80 -translate-y-1/2 rounded-full bg-sky-200/40 blur-[120px]"
              animate={{ opacity: [0.2, 0.45, 0.25], scale: [0.95, 1.1, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            />
            <motion.div
              className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-200/45 blur-3xl"
              animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.9, 1.08, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
 
          <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-[3rem] primary-gradient px-10 py-16"
            >
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
              >
                One click. Global reach. Instant crypto.
              </motion.h2>
 
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl mx-auto"
              >
                Open your universal payment page, accept local currency or crypto with zero friction, and receive non-custodial settlements straight to your wallet.
              </motion.p>
 
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex justify-center"
              >
                <Link
                  href="/role-selection"
                  className="inline-flex items-center justify-center rounded-full bg-white px-12 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-100"
                >
                  Create Your Page
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
