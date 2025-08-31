# 🎯 TruSight - AI-Powered News Analysis & Bias Detection

> **Stay Informed, Stay Objective** - Discover the latest news and analyze potential bias with our AI-powered detection tool.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

## 🌟 Overview

TruSight is a comprehensive news analysis platform that combines real-time news aggregation with advanced AI-powered bias detection. Built with Next.js 15, it provides users with objective insights into media content while maintaining a beautiful, responsive interface.

## ✨ Key Features

### 🗞️ **News Aggregation**
- **Real-time News**: Latest headlines from around the world
- **Category Filtering**: Politics, Business, Technology, Sports, and more
- **Search Functionality**: Find specific topics or sources
- **Auto-refresh**: Get the latest news with one click
- **Responsive Grid**: Beautiful card-based layout for all devices

### 🤖 **AI-Powered Bias Detection**
- **Advanced Analysis**: Powered by Groq's Llama 3.1 70B model
- **Bias Classification**: Left, Right, Center, or Neutral bias detection
- **Confidence Scoring**: Percentage-based confidence in analysis
- **Missing Perspectives**: Identify underrepresented viewpoints
- **Detailed Reasoning**: Understand why bias was detected

### 🔊 **Voice Response System**
- **Text-to-Speech**: Convert bias analysis to natural speech
- **ElevenLabs Integration**: High-quality AI voice synthesis
- **Browser Fallback**: Automatic fallback to built-in TTS if API fails
- **Optional Usage**: Only activates when user requests it
- **Multiple Voices**: Professional voice options available
- **Provider Indication**: Shows which TTS service is currently active

### 🌐 **Browser Extension**
- **Extension Showcase**: Dedicated page for browser extension
- **GitHub Integration**: Direct link to extension repository
- **Installation Guide**: Step-by-step setup instructions
- **Feature Overview**: Complete extension capabilities

### 🔐 **User Management**
- **Clerk Authentication**: Secure user registration and login
- **Chat History**: Save and manage bias analysis conversations
- **Personal Dashboard**: Track your analysis history
- **Profile Management**: Customize your experience

### 🎨 **Modern UI/UX**
- **Theme Support**: Light and dark mode with dynamic backgrounds
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Framer Motion powered interactions
- **Accessibility**: Keyboard shortcuts and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pranavsanthoshnair/truext.git
   cd TruSight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

Create a `.env.local` file in your project root with the following variables:

### **Required API Keys**
```bash
# Groq AI Service (Bias Detection)
GROQ_API_KEY=your_groq_api_key_here

# GNews API (News Aggregation)
NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_api_key_here

# Supabase (Database & Authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk (User Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# ElevenLabs (Voice Responses - Optional)
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### **API Setup Guides**
- [Groq Setup Guide](./GROQ_SETUP.md) - AI bias detection service
- [News API Setup](./SETUP_NEWS_API.md) - GNews integration
- [Supabase Setup](./SUPABASE_SETUP.md) - Database configuration
- [Voice Setup Guide](./VOICE_SETUP.md) - ElevenLabs integration

## 🏗️ Project Structure

```
TruSight/
├── app/                          # Next.js 15 App Router
│   ├── about/                    # About page
│   ├── api/                      # API routes
│   │   └── analyze-bias/         # Bias analysis endpoint
│   ├── bias/                     # Bias detection page
│   ├── extension/                # Browser extension showcase
│   ├── learn-more/               # Educational content
│   ├── profile/                  # User profile management
│   ├── sign-in/                  # Authentication pages
│   ├── sign-up/                  # User registration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   │   ├── avatar.tsx            # User avatar component
│   │   ├── badge.tsx             # Status badges
│   │   ├── button.tsx            # Button variants
│   │   ├── card.tsx              # Card layouts
│   │   ├── input.tsx             # Form inputs
│   │   ├── progress.tsx          # Progress indicators
│   │   ├── scroll-area.tsx       # Scrollable areas
│   │   └── textarea.tsx          # Multi-line inputs
│   ├── chat-window.tsx           # Chat interface
│   ├── footer.tsx                # Site footer
│   ├── input-box.tsx             # Message input
│   ├── navbar.tsx                # Navigation bar
│   ├── news-card.tsx             # News article cards
│   ├── Prism.tsx                 # Light theme background
│   ├── PrismaticBurst.tsx       # Dark theme background
│   ├── search-bar.tsx            # News search
│   ├── sidebar.tsx               # Chat sidebar
│   ├── stamp-effect.tsx          # Visual effects
│   ├── theme-provider.tsx        # Theme management
│   ├── theme-toggle.tsx          # Theme switcher
│   └── voice-button.tsx          # Voice response button
├── lib/                          # Core services & utilities
│   ├── chat-service.ts           # Chat management
│   ├── config.ts                 # Configuration
│   ├── groq-service.ts           # AI bias detection
│   ├── news-service.ts           # News aggregation
│   ├── supabase.ts               # Database client
│   ├── types.ts                  # TypeScript definitions
│   ├── elevenlabs-service.ts     # Voice synthesis
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
│   ├── ai.png                    # AI avatar image
│   ├── placeholder-logo.svg      # Logo placeholder
│   ├── robot-avatar.svg          # Robot avatar
│   └── robots.txt                # SEO robots file
├── styles/                       # Additional stylesheets
├── .env.local                    # Environment variables
├── components.json               # shadcn/ui configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind CSS config
└── tsconfig.json                 # TypeScript configuration
```

## 🎮 Usage Guide

### **Getting Started**
1. **Browse News**: Visit the homepage to see latest headlines
2. **Search & Filter**: Use the search bar and category filters
3. **Analyze Bias**: Click "Analyze Bias" on any news article
4. **View Results**: Get detailed bias analysis with confidence scores
5. **Voice Response**: Click the 🔊 button to hear analysis narrated
6. **Save Chats**: Your analysis history is automatically saved

### **Keyboard Shortcuts**
- **Ctrl/Cmd + B**: Go to bias detection page
- **Ctrl/Cmd + E**: Go to extension page
- **Ctrl/Cmd + T**: Toggle theme (light/dark)
- **Ctrl/Cmd + R**: Refresh news
- **Ctrl/Cmd + F**: Focus search bar
- **Escape**: Clear search and filters

### **Bias Analysis Features**
- **Real-time Processing**: Instant AI analysis
- **Confidence Metrics**: Understand analysis reliability
- **Bias Spectrum**: Visual representation of political leanings
- **Missing Perspectives**: Identify underrepresented viewpoints
- **Detailed Reasoning**: AI explanations for bias detection

## 🛠️ Development

### **Tech Stack**
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **AI Services**: Groq (Llama 3.1 70B), ElevenLabs
- **News API**: GNews
- **Deployment**: Vercel (recommended)

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### **Code Quality**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**
1. Build the project: `npm run build`
2. Start production server: `npm run start`
3. Configure your hosting provider

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Development Setup**
```bash
git clone https://github.com/Pranavsanthoshnair/truext.git
cd TruSight
npm install
npm run dev
```

## 📚 Documentation

- [API Reference](./docs/api.md) - API endpoints and usage
- [Component Library](./docs/components.md) - UI component documentation
- [Styling Guide](./docs/styling.md) - Design system and theming
- [Testing Guide](./docs/testing.md) - Testing strategies and examples

## 🐛 Troubleshooting

### **Common Issues**
1. **Voice button not visible**: Check ElevenLabs API key in `.env.local`
2. **News not loading**: Verify GNews API key configuration
3. **Bias analysis fails**: Ensure Groq API key is set correctly
4. **Authentication issues**: Check Clerk configuration

### **Getting Help**
- Check the [Issues](https://github.com/Pranavsanthoshnair/truext/issues) page
- Review setup guides in the documentation
- Verify environment variable configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing the AI bias detection service
- **ElevenLabs** for high-quality text-to-speech
- **GNews** for reliable news aggregation
- **Supabase** for database and authentication
- **Clerk** for user management
- **shadcn/ui** for beautiful component library

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Pranavsanthoshnair/truext/issues)
- **Documentation**: [Complete setup and usage guides](./docs/)
- **Community**: Join our discussions and get help

---

**Made with ❤️ by the TruSight Team**

> **Stay informed, stay objective, stay TruSight.**
