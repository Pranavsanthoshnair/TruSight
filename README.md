# TruSight - AI-Powered Bias Detection

TruSight is a Next.js application that helps users analyze news articles for potential media bias using AI-powered detection tools.

## Features

- 📰 **Real-time News**: Fetch live news from external APIs (GNews, NewsAPI)
- 🤖 **AI-Powered Bias Detection**: Advanced bias analysis using Groq's Llama 3.1 70B model
- 🔊 **Voice Responses**: Optional text-to-speech narration of bias analysis results (ElevenLabs)
- 🔌 **Browser Extension**: Chrome/Firefox extension for real-time bias detection on any website
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

3. Set up your API keys:
   - **Groq API Key** (required for bias detection): Get a free API key from [Groq](https://console.groq.com/)
   - **News API Key** (optional but recommended): Get a free API key from [GNews](https://gnews.io/) (100 requests/day) or [NewsAPI.org](https://newsapi.org/) (100 requests/day)
   - See [SETUP_NEWS_API.md](./SETUP_NEWS_API.md) for detailed instructions

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Setup

### Groq API (Required for Bias Detection)

The bias detection feature uses Groq's Llama 3.1 70B model for advanced AI-powered analysis:

1. **Get a Groq API Key**:
   - Sign up at [Groq Console](https://console.groq.com/)
   - Create a new API key

2. **Configure the API**:
   - Add `GROQ_API_KEY=your_api_key_here` to your `.env.local` file
   - Restart your development server

### News API (Optional)

To get real-time news instead of sample data:

1. **Get an API Key**:
   - [GNews API](https://gnews.io/) - Recommended, 100 requests/day free
   - [NewsAPI.org](https://newsapi.org/) - Alternative, 100 requests/day free

2. **Configure the API**:
   - Use the built-in API key setup component on the homepage
   - Or create a `.env.local` file with your API key
   - See [SETUP_NEWS_API.md](./SETUP_NEWS_API.md) for detailed setup

3. **Restart your server** after configuration

### ElevenLabs API (Optional - Voice Responses)

To enable voice narration of bias analysis results:

1. **Get an API Key**:
   - Sign up at [ElevenLabs](https://elevenlabs.io/)
   - Go to your profile settings to get your API key

2. **Configure the API**:
   - Add `NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here` to your `.env.local` file
   - See [VOICE_SETUP.md](./VOICE_SETUP.md) for detailed setup

3. **Restart your server** after configuration

### Browser Extension

TruSight also offers a powerful browser extension for real-time bias detection:

1. **Get the Extension**:
   - Visit our [GitHub repository](https://github.com/Pranavsanthoshnair/truext)
   - Download the latest release
   - Install in your browser

2. **Features**:
   - Real-time bias detection on any website
   - Political bias analysis with confidence metrics
   - Tone analysis and evidence extraction
   - Cross-browser compatibility (Chrome, Edge, Brave, Firefox)

3. **Usage**:
   - Navigate to any website
   - Click the TruSight extension icon
   - Get instant bias analysis results

## Project Structure

```
TruSight/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── analyze/           # Analysis page
│   ├── bias/              # Bias detection page
│   ├── extension/         # Browser extension page
│   ├── learn-more/        # Learning resources
│   └── page.tsx           # Homepage
├── components/             # React components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── news-card.tsx      # News article display
│   ├── search-bar.tsx     # Search and filters
│   ├── voice-button.tsx   # Voice response button
│   └── ...
├── lib/                    # Utility functions
│   ├── news-service.ts    # News API integration
│   ├── elevenlabs-service.ts # Voice response service
│   ├── config.ts          # API configuration
│   └── ...
├── public/                 # Static assets
├── VOICE_SETUP.md         # Voice functionality setup guide
└── SUPABASE_SETUP.md      # Database and voice setup
```

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Voice**: ElevenLabs Text-to-Speech API
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
