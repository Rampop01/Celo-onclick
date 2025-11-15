export const dummyData = {
  creator: {
    name: "Alex Chen",
    title: "Digital Artist & NFT Creator",
    description: "Creating unique digital art and NFTs. Support my journey to bring more beautiful creations to the world!",
    banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    goal: 5000,
    raised: 3200,
    supporters: 127,
    recentPayments: [
      { id: 1, amount: 50, message: "Love your work!", supporter: "CryptoFan123", date: "2 hours ago" },
      { id: 2, amount: 25, message: "Keep creating!", supporter: "ArtLover", date: "5 hours ago" },
      { id: 3, amount: 100, message: "Amazing NFT collection", supporter: "CollectorPro", date: "1 day ago" },
    ],
    theme: "#8CCDEB"
  },
  
  business: {
    name: "TechConsult Pro",
    title: "Blockchain Consulting Services",
    description: "Professional blockchain and Web3 consulting for businesses looking to enter the decentralized space.",
    products: [
      {
        id: 1,
        name: "Digital Art License",
        price: 299,
        description: "Commercial license for digital artwork",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop"
      },
      {
        id: 2,
        name: "Consultation Session",
        price: 150,
        description: "1-hour blockchain strategy consultation",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop"
      },
      {
        id: 3,
        name: "Smart Contract Audit",
        price: 2000,
        description: "Comprehensive smart contract security audit",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop"
      }
    ],
    revenue: 15420,
    transactions: 89,
    recentOrders: [
      { id: 1, product: "Digital Art License", amount: 299, customer: "DesignStudio", date: "1 hour ago" },
      { id: 2, product: "Consultation Session", amount: 150, customer: "StartupXYZ", date: "3 hours ago" },
      { id: 3, product: "Smart Contract Audit", amount: 2000, customer: "DeFiProject", date: "1 day ago" },
    ]
  },
  
  crowdfunder: {
    name: "EcoTech Solutions",
    title: "Sustainable Blockchain Infrastructure",
    description: "Building the next generation of eco-friendly blockchain infrastructure. Help us create a greener future for Web3!",
    goal: 50000,
    raised: 30000,
    supporters: 234,
    daysLeft: 15,
    campaign: {
      title: "Green Blockchain Revolution",
      story: "We're developing innovative consensus mechanisms that reduce energy consumption by 90% while maintaining security and decentralization. Our technology will revolutionize how blockchains operate, making them truly sustainable for the future.",
      milestones: [
        { title: "Research Phase", amount: 10000, completed: true },
        { title: "Prototype Development", amount: 25000, completed: true },
        { title: "Testing & Optimization", amount: 40000, completed: false },
        { title: "Public Launch", amount: 50000, completed: false }
      ]
    },
    recentSupporters: [
      { name: "GreenInvestor", amount: 1000, message: "Love the mission!", date: "2 hours ago" },
      { name: "EcoWarrior", amount: 500, message: "This is the future!", date: "4 hours ago" },
      { name: "TechEnthusiast", amount: 250, message: "Excited to see this launch", date: "6 hours ago" },
    ]
  }
};

export const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', provider: 'Transak' },
  { id: 'wallet', name: 'Polkadot Wallet', icon: '🔗', provider: 'Polkadot.js' },
  { id: 'crypto', name: 'Direct Crypto', icon: '₿', provider: 'Direct' }
];

export const currencies = [
  { symbol: 'DOT', name: 'Polkadot', rate: 1 },
  { symbol: 'USDT', name: 'Tether USD', rate: 0.15 },
  { symbol: 'USDC', name: 'USD Coin', rate: 0.15 },
  { symbol: 'ETH', name: 'Ethereum', rate: 0.002 }
];
