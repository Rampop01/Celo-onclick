'use client';

import { motion } from 'framer-motion';
import { Twitter, MessageCircle, Github, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 mb-6 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white">
                  OnClick
                </span>
              </motion.div>
            </Link>
            <p className="text-blue-100 mb-8 max-w-md leading-relaxed">
              The most intuitive Web3 payment platform for creators, businesses, and dreamers. 
              One click, global reach, instant crypto.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-100" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-blue-100" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5 text-blue-100" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-100" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#features"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#docs"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#api"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#tutorials"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-blue-100 hover:text-white transition-colors font-medium"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100 text-sm font-medium">
              © 2025 OnClick | Powered by Polkadot
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a
                href="#privacy"
                className="text-blue-100 hover:text-white transition-colors text-sm font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-blue-100 hover:text-white transition-colors text-sm font-medium"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-blue-100 hover:text-white transition-colors text-sm font-medium"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
