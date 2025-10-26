# AutoTrip Frontend

A modern Next.js frontend for the AutoTrip travel planning application.

## 🚀 Features

- **Modern UI**: Built with Next.js 14 and TypeScript
- **Responsive Design**: TailwindCSS with mobile-first approach
- **Interactive Maps**: Google Maps integration for visual trip planning
- **Smooth Animations**: Framer Motion for enhanced user experience
- **State Management**: React Query for efficient server state management

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: React Query
- **Maps**: Google Maps JavaScript API

## 📁 Project Structure

```
frontend/
├── components/          # React components
│   ├── TripForm.tsx
│   ├── MapView.tsx
│   ├── HotelCardList.tsx
│   └── ItineraryList.tsx
├── pages/              # Next.js pages
│   ├── index.tsx
│   └── plan.tsx
├── hooks/              # Custom React hooks
│   ├── useGenerateItinerary.ts
│   └── useHotels.ts
├── lib/                # Utilities and API client
└── styles/             # Global styles
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Maps API key

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API keys:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
