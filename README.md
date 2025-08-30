# TruSight - AI-Powered Bias Detection

TruSight is a Next.js application that helps users analyze news articles for potential media bias using AI-powered detection tools.

## Features

- 📰 **Real-time News**: Fetch live news from external APIs (GNews, NewsAPI)
- 🔍 **Bias Detection**: AI-powered analysis of articles for potential bias
- 📊 **News Categories**: Filter news by category (technology, business, sports, etc.)
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🌙 **Dark Mode**: Theme switching with next-themes
- 📱 **Mobile First**: Responsive design for all devices

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd TruSight
```

2. Install dependencies:
```bash
npm install
```

3. Set up your news API key (optional but recommended):
   - Get a free API key from [GNews](https://gnews.io/) (100 requests/day)
   - Or use [NewsAPI.org](https://newsapi.org/) (100 requests/day)
   - See [SETUP_NEWS_API.md](./SETUP_NEWS_API.md) for detailed instructions

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## News API Setup

To get real-time news instead of sample data:

1. **Get an API Key**:
   - [GNews API](https://gnews.io/) - Recommended, 100 requests/day free
   - [NewsAPI.org](https://newsapi.org/) - Alternative, 100 requests/day free

2. **Configure the API**:
   - Use the built-in API key setup component on the homepage
   - Or create a `.env.local` file with your API key
   - See [SETUP_NEWS_API.md](./SETUP_NEWS_API.md) for detailed setup

3. **Restart your server** after configuration

## Project Structure

```
TruSight/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── analyze/           # Analysis page
│   ├── bias/              # Bias detection page
│   ├── learn-more/        # Learning resources
│   └── page.tsx           # Homepage
├── components/             # React components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── news-card.tsx      # News article display
│   ├── search-bar.tsx     # Search and filters
│   └── ...
├── lib/                    # Utility functions
│   ├── news-service.ts    # News API integration
│   ├── config.ts          # API configuration
│   └── ...
└── public/                 # Static assets
```

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **News APIs**: GNews, NewsAPI.org

## API Integration

The app automatically:
- Fetches real-time news when API keys are configured
- Falls back to sample data when APIs are unavailable
- Caches news data for 30 minutes to reduce API calls
- Supports multiple news providers for redundancy

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file for API keys:

```bash
# GNews API (recommended)
NEXT_PUBLIC_GNEWS_API_KEY=your_api_key_here

# Alternative: NewsAPI.org
# NEXT_PUBLIC_NEWSAPI_KEY=your_api_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For help with:
- **News API setup**: See [SETUP_NEWS_API.md](./SETUP_NEWS_API.md)
- **General issues**: Check the browser console for error messages
- **API limits**: Monitor your daily request count in the API provider dashboard
