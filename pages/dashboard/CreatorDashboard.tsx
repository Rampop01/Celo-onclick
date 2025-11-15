'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import QRShareModal from '../../components/QRShareModal';
import { 
  Edit3, 
  Eye, 
  Share2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Upload,
  Palette,
  Target,
  MessageCircle
} from 'lucide-react';
import { dummyData } from '../../data/dummyData';

export default function CreatorDashboard() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [creatorData, setCreatorData] = useState(dummyData.creator);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handlePreview = () => {
    // In a real app, this would open the public page
    console.log('Opening preview page');
  };

  const handleShare = () => {
    setIsQRModalOpen(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save the data
    console.log('Saving creator data:', creatorData);
  };

  const progressPercentage = (creatorData.raised / creatorData.goal) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Creator Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your creator page and track your supporters
                </p>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                    isEditing
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                  <span>{isEditing ? 'Save Changes' : 'Edit Page'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePreview}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>Preview</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="px-6 py-3 gradient-bg text-white rounded-lg font-medium flex items-center space-x-2 hover:shadow-lg transition-shadow"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Total Supporters</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {creatorData.supporters}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Total Received</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${creatorData.raised.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Goal Progress</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {Math.round(progressPercentage)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Funding Goal
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${creatorData.raised.toLocaleString()} of ${creatorData.goal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="gradient-bg h-3 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Recent Payments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Payments
                </h3>
                <div className="space-y-4">
                  {creatorData.recentPayments.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {payment.supporter}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {payment.message}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${payment.amount}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.date}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Edit Panel */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Edit Your Page
                </h3>

                <div className="space-y-6">
                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Banner Image
                    </label>
                    <div className="relative">
                      <img
                        src={creatorData.banner}
                        alt="Banner"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Upload className="w-6 h-6 text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Theme Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme Color
                    </label>
                    <div className="flex space-x-2">
                      {['#8CCDEB', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            creatorData.theme === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setCreatorData({ ...creatorData, theme: color })}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={creatorData.description}
                      onChange={(e) => setCreatorData({ ...creatorData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                    />
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Funding Goal ($)
                    </label>
                    <input
                      type="number"
                      value={creatorData.goal}
                      onChange={(e) => setCreatorData({ ...creatorData, goal: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {isEditing && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="w-full py-3 gradient-bg text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                    >
                      Save Changes
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* QR Share Modal */}
      <QRShareModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={`https://onclick.app/creator/${creatorData.name.toLowerCase().replace(/\s+/g, '-')}`}
        title={creatorData.name}
      />
    </div>
  );
}
