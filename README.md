# OnClick - Web3 Payment Platform UI

A complete, modern, and responsive Web3 payment platform UI built with Next.js 16, TypeScript, and Tailwind CSS. OnClick is a decentralized platform that lets creators, crowdfunders, and businesses receive crypto payments or donations easily, globally, and instantly.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with dark/light mode support
- **Three User Roles**: Creator, Business, and Crowdfunder dashboards
- **Interactive Components**: Animated cards, modals, and smooth transitions
- **Payment Simulation**: Mock payment flows with QR code generation
- **Real-time Updates**: Live progress tracking and supporter management
- **Global Sharing**: QR codes, social media integration, and link sharing

## 🎨 Design System

- **Primary Color**: `#8CCDEB` (Sky Blue)
- **Secondary**: Shiny black gradients
- **Typography**: Geist Sans (modern, clean)
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icons

## 📦 Tech Stack

- **Framework**: Next.js 16.0.0 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **QR Codes**: react-qr-code
- **State Management**: React Context (Theme)

## 🏗️ Project Structure

```
onclick/
├── app/
│   ├── globals.css          # Global styles and theme
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page with router
│   ├── providers.tsx        # Theme context provider
│   └── routing.tsx          # Simple client-side routing
├── components/
│   ├── Navbar.tsx           # Navigation with dark mode toggle
│   ├── Footer.tsx           # Footer with social links
│   ├── PaymentModal.tsx     # Payment processing modal
│   └── QRShareModal.tsx     # QR code sharing modal
├── pages/
│   ├── RoleSelection.tsx    # Role selection page
│   ├── PublicPage.tsx       # Public checkout/support page
│   └── dashboard/
│       ├── CreatorDashboard.tsx      # Creator management
│       ├── BusinessDashboard.tsx     # Business product management
│       └── CrowdfunderDashboard.tsx  # Campaign management
└── data/
    └── dummyData.ts         # Mock data for all components
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
```bash
npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 User Journey

1. **Landing Page**: Hero section with features and CTA buttons
2. **Role Selection**: Choose between Creator, Business, or Crowdfunder
3. **Dashboard**: Manage your page, products, or campaign
4. **Public Page**: Share your link for supporters to make payments
5. **Payment Flow**: Simulated crypto/card payments with success confirmation

## 🎨 Key Components

### Landing Page
- Hero section with animated statistics
- Feature highlights with icons
- How it works (3-step process)
- Call-to-action sections

### Role Selection
- Three animated role cards
- Hover effects and selection states
- Role-specific features and descriptions

### Dashboards
- **Creator**: Support tracking, page editing, recent payments
- **Business**: Product management, order tracking, revenue stats
- **Crowdfunder**: Campaign progress, milestone tracking, supporter list

### Public Pages
- Profile display with banner and avatar
- Progress tracking with animated bars
- Support form with amount input
- Recent supporters feed
- Social sharing options

## 🔧 Customization

### Theme Colors
Update the CSS variables in `app/globals.css`:
```css
:root {
  --primary-accent: #8CCDEB;
  --shiny-black: #0a0a0a;
  --gradient-start: #8CCDEB;
  --gradient-end: #4A90E2;
}
```

### Dummy Data
Modify `data/dummyData.ts` to customize:
- User profiles and content
- Product listings
- Campaign information
- Payment history

## 🌟 Features Implemented

- ✅ Responsive design (mobile-first)
- ✅ Dark/light mode toggle
- ✅ Smooth animations and transitions
- ✅ Interactive modals and forms
- ✅ QR code generation and sharing
- ✅ Payment simulation flow
- ✅ Real-time progress tracking
- ✅ Social media integration
- ✅ Copy-to-clipboard functionality
- ✅ File download capabilities

## 🚧 Future Enhancements

- Backend integration with real blockchain
- User authentication system
- Real payment processing
- Advanced analytics dashboard
- Multi-language support
- Mobile app development

## 📄 License

This project is for demonstration purposes. Built with ❤️ using modern web technologies.

---

**OnClick** - One Click. Global Reach. Instant Crypto. 🌍💫
