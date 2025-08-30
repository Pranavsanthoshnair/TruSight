# TruSight - News Platform with AI Bias Detection

TruSight is a comprehensive news platform that combines real-time news coverage with AI-powered bias detection tools. Stay informed with the latest news from around the world, then analyze potential bias to make more informed decisions.

## 🚀 Features

- **📰 Real-time News**: Access to trending news from multiple reliable sources
- **🎯 AI Bias Detection**: Advanced machine learning algorithms to detect media bias
- **🔍 Smart Search**: Search and filter news by topic, category, or keywords
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🌙 Dark/Light Mode**: Toggle between themes for comfortable reading
- **💾 Persistent Storage**: Save your analysis history and progress
- **🎮 Gamified Experience**: Earn truth points for analyzing articles

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives
- **State Management**: React Hooks
- **News APIs**: GNews, NewsAPI (with fallback mock data)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd trusight-1
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# News API Keys (Optional - app works with mock data if not provided)
NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_api_key_here
NEXT_PUBLIC_NEWSAPI_KEY=your_newsapi_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=TruSight
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Getting API Keys

### GNews API (Recommended - 100 requests/day free)
1. Visit [GNews](https://gnews.io/)
2. Sign up for a free account
3. Get your API key from the dashboard

### NewsAPI (Alternative - 100 requests/day free)
1. Visit [NewsAPI](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard

### NewsData.io (Alternative - 200 requests/day free)
1. Visit [NewsData.io](https://newsdata.io/)
2. Sign up for a free account
3. Get your API key from the dashboard

## 📁 Project Structure

```
trusight-1/
├── app/                    # Next.js App Router
│   ├── page.tsx          # Home page (News feed)
│   ├── bias/             # Bias detection tool
│   │   └── page.tsx
│   ├── about/            # About page
│   │   └── page.tsx
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── navbar.tsx        # Navigation bar
│   ├── news-card.tsx     # News article card
│   ├── search-bar.tsx    # Search and filters
│   ├── footer.tsx        # Footer component
│   ├── ui/               # UI primitives
│   └── ...               # Other components
├── lib/                   # Utility functions
│   ├── news-service.ts   # News API integration
│   ├── mock-data.ts      # Mock data for development
│   └── utils.ts          # Helper functions
├── public/                # Static assets
├── styles/                # Additional styles
└── package.json           # Dependencies and scripts
```

## 🎯 Key Components

### News Service (`lib/news-service.ts`)
- Handles API calls to news services
- Implements caching and fallback to mock data
- Supports multiple news APIs with automatic fallback

### News Card (`components/news-card.tsx`)
- Displays article information
- Includes "Analyze Bias" button
- Responsive design with image handling

### Search Bar (`components/search-bar.tsx`)
- Search functionality with real-time filtering
- Category selection
- Responsive design

### Bias Detection (`app/bias/page.tsx`)
- Full bias analysis interface
- Chat-based interaction
- Analysis history and persistence

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_GNEWS_API_KEY=your_production_gnews_api_key
NEXT_PUBLIC_NEWSAPI_KEY=your_production_newsapi_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔧 Customization

### Adding New News Sources

1. Update `lib/news-service.ts`
2. Add new API endpoint
3. Implement data transformation
4. Add to fallback chain

### Modifying Bias Detection

1. Update `app/bias/page.tsx`
2. Modify analysis logic in `sendMessage` function
3. Update UI components as needed

### Styling Changes

1. Modify `app/globals.css`
2. Update Tailwind classes in components
3. Customize theme in `components/theme-provider.tsx`

## 📱 Mobile Responsiveness

The platform is built with mobile-first design principles:
- Responsive grid layouts
- Touch-friendly interactions
- Mobile-optimized navigation
- Adaptive image handling

## 🔒 Security Features

- API key management
- Input sanitization
- XSS protection
- Secure localStorage usage

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🚀 Roadmap

- [ ] Real-time news updates
- [ ] Advanced bias detection algorithms
- [ ] User accounts and profiles
- [ ] Social sharing features
- [ ] Mobile app versions
- [ ] API rate limiting improvements
- [ ] More news sources
- [ ] Advanced analytics dashboard

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible component primitives
- Framer Motion for smooth animations
- All the free news APIs that make this possible

---

**Made with ❤️ for better journalism and media literacy**
