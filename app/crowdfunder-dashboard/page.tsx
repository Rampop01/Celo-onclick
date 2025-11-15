'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import QRShareModal from '../../components/QRShareModal';
import { 
  Target, 
  Eye, 
  Share2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Edit3,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react';
import { dummyData } from '../../data/dummyData';

export default function CrowdfunderDashboard() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [crowdfunderData, setCrowdfunderData] = useState(dummyData.crowdfunder);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handlePreview = () => {
    // In a real app, this would open the public campaign page
    console.log('Opening campaign preview');
  };

  const handleShare = () => {
    setIsQRModalOpen(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save the data
    console.log('Saving campaign data:', crowdfunderData);
  };

  const progressPercentage = (crowdfunderData.raised / crowdfunderData.goal) * 100;

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
                  Crowdfunding Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your campaign and track supporters
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
                  <span>{isEditing ? 'Save Changes' : 'Edit Campaign'}</span>
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Total Raised</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${crowdfunderData.raised.toLocaleString()}
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Supporters</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {crowdfunderData.supporters}
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Days Left</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {crowdfunderData.daysLeft}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-500" />
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
                    Campaign Progress
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(progressPercentage)}% funded
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="gradient-bg h-4 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>${crowdfunderData.raised.toLocaleString()} raised</span>
                  <span>${crowdfunderData.goal.toLocaleString()} goal</span>
                </div>
              </motion.div>

              {/* Milestones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Campaign Milestones
                </h3>
                <div className="space-y-4">
                  {crowdfunderData.campaign.milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        milestone.completed
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.completed
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {milestone.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ${milestone.amount.toLocaleString()} target
                          </p>
                        </div>
                      </div>
                      {milestone.completed && (
                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                          Completed
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Supporters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Supporters
                </h3>
                <div className="space-y-4">
                  {crowdfunderData.recentSupporters.map((supporter, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {supporter.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {supporter.message}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${supporter.amount}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {supporter.date}
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
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Edit Campaign
                </h3>

                <div className="space-y-6">
                  {/* Campaign Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      value={crowdfunderData.campaign.title}
                      onChange={(e) => setCrowdfunderData({
                        ...crowdfunderData,
                        campaign: { ...crowdfunderData.campaign, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Funding Goal ($)
                    </label>
                    <input
                      type="number"
                      value={crowdfunderData.goal}
                      onChange={(e) => setCrowdfunderData({ ...crowdfunderData, goal: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Days Left */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Days Remaining
                    </label>
                    <input
                      type="number"
                      value={crowdfunderData.daysLeft}
                      onChange={(e) => setCrowdfunderData({ ...crowdfunderData, daysLeft: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Story */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Campaign Story
                    </label>
                    <textarea
                      value={crowdfunderData.campaign.story}
                      onChange={(e) => setCrowdfunderData({
                        ...crowdfunderData,
                        campaign: { ...crowdfunderData.campaign, story: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={6}
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
        url={`https://onclick.app/campaign/${crowdfunderData.campaign.title.toLowerCase().replace(/\s+/g, '-')}`}
        title={crowdfunderData.campaign.title}
      />
    </div>
  );
}
