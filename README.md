# CineAI - Movie Recommendation Web App

A responsive, full-stack movie recommendation web application built with Next.js 15, TypeScript, and TailwindCSS. Features AI-powered recommendations using cosine similarity algorithms for both Indian and Hollywood cinema.

## 🎬 Features

### Core Features
- **Responsive OTT-style UI** - Netflix/Amazon Prime inspired design
- **AI-Powered Recommendations** - Cosine similarity based on movie descriptions, genres, and metadata
- **Multi-language Support** - Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali, English, and more
- **Smart Search** - Google-style autocomplete with real-time suggestions
- **Advanced Filtering** - Multi-select genre and language filters
- **Movie Details Modal** - Comprehensive movie information with cast, director, and similar movies

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **API Routes** for recommendations and search
- **Optimized for Vercel** deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-recommendation-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
movie-recommendation-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── recommend/route.ts    # Recommendation API
│   │   │   └── search/route.ts       # Search API
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   ├── Footer.tsx                # Footer component
│   │   ├── MovieCard.tsx             # Movie card component
│   │   ├── MovieGrid.tsx             # Movie grid layout
│   │   ├── MovieModal.tsx            # Movie details modal
│   │   └── Navbar.tsx                # Navigation bar
│   ├── data/
│   │   └── movies.json               # Movie dataset
│   └── utils/
│       └── recommendations.ts        # AI recommendation logic
├── public/                           # Static assets
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # TailwindCSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

## 🤖 AI Recommendation System

The app uses a sophisticated recommendation algorithm that:

1. **Text Preprocessing** - Cleans and tokenizes movie descriptions, genres, cast, and director information
2. **Vector Creation** - Generates TF-IDF like vectors for each movie
3. **Cosine Similarity** - Calculates similarity scores between movies
4. **Enhanced Scoring** - Applies bonuses for:
   - Same language movies (+30%)
   - Genre overlap (+20% per matching genre)
   - Higher ratings (+10% for ratings above 7.0)

### API Endpoints

#### GET `/api/recommend?movieId={id}&limit={number}`
Returns movie recommendations based on a specific movie ID.

#### POST `/api/recommend`
```json
{
  "movieTitle": "Movie Name",
  "limit": 6
}
```

#### GET `/api/search?q={query}&genres={genre1,genre2}&languages={lang1,lang2}&limit={number}`
Advanced search with filters.

## 🎨 UI Components

### Navbar
- Smart search with autocomplete
- Multi-select genre and language filters
- Responsive design with mobile-friendly filters

### Movie Cards
- Hover effects with play button overlay
- Rating and language badges
- Responsive grid layout
- Fallback images for missing posters

### Movie Modal
- Detailed movie information
- Cast and crew details
- AI-generated similar movie recommendations
- Responsive design with scroll handling

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy
   - No additional configuration needed

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📊 Dataset

The app includes a curated dataset of 20 movies featuring:
- **Indian Cinema**: Hindi, Telugu, Tamil, Kannada, Malayalam films
- **Hollywood**: Popular English movies
- **Metadata**: Title, year, genres, description, rating, cast, director
- **Placeholder Images**: Fallback for missing posters

### Adding More Movies

To expand the dataset, edit `src/data/movies.json`:

```json
{
  "id": 21,
  "title": "Movie Title",
  "year": 2024,
  "language": "Hindi",
  "genres": ["Action", "Drama"],
  "description": "Movie description...",
  "poster": "https://image-url.jpg",
  "rating": 8.5,
  "director": "Director Name",
  "cast": ["Actor 1", "Actor 2"]
}
```

## 🛠️ Customization

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/app/globals.css` for global styles
- Components use TailwindCSS classes for easy customization

### Recommendation Algorithm
- Enhance `src/utils/recommendations.ts` for better accuracy
- Add more factors like release year, popularity, user ratings
- Implement collaborative filtering or machine learning models

### Features
- Add user authentication
- Implement watchlists and favorites
- Add movie trailers and streaming links
- Integrate with external APIs (TMDB, OMDB)

## 🔧 Performance Optimizations

- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic code splitting with Next.js
- **Lazy Loading** - Components and images load on demand
- **Responsive Images** - Multiple breakpoints for different devices
- **Minimal Bundle Size** - Tree shaking and optimized builds

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Movie data inspired by popular Indian and Hollywood films
- UI design inspired by Netflix and Amazon Prime Video
- Built with Next.js, TailwindCSS, and TypeScript
- Icons by Lucide React

---

**Made with ❤️ for movie enthusiasts**
