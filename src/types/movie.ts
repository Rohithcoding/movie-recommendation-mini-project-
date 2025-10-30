// Supported languages
export type Language = 'English' | 'Hindi' | 'Kannada' | 'Tamil' | 'Telugu' | 'Malayalam';

// Supported OTT platforms
export type OTTPlatform = 
  | 'Netflix' 
  | 'Amazon Prime Video' 
  | 'Disney+ Hotstar' 
  | 'ZEE5' 
  | 'SonyLIV' 
  | 'Sun NXT' 
  | 'MX Player' 
  | 'Voot' 
  | 'Aha' 
  | 'YouTube' 
  | 'JioCinema';

// Movie interface with enhanced fields
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string; // For regional language titles
  year: number;
  languages: Language[];
  originalLanguage: Language;
  genres: string[];
  description: string;
  poster: string;
  backdrop?: string;
  rating: number;
  voteCount: number;
  duration: number; // in minutes
  director: string;
  cast: string[];
  
  // Enhanced OTT platform information
  streamingPlatforms: Array<{
    name: OTTPlatform;
    url: string;
    type: 'rent' | 'buy' | 'subscription' | 'free';
    price?: number; // For rent/buy options
    quality?: 'SD' | 'HD' | '4K' | 'HDR';
    availableSince?: string; // ISO date
  }>;
  
  // Additional metadata
  ageRating: string; // 'U', 'UA', 'A', etc.
  releaseDate: string; // ISO date
  trailerUrl: string;
  imdbId?: string;
  tmdbId?: string;
  
  // Regional specific data
  regionalData?: {
    [key in Language]?: {
      title: string;
      description: string;
      poster?: string;
    };
  };
}

// Filter options
export interface FilterOptions {
  languages: Language[];
  genres: string[];
  minRating: number;
  yearRange: [number, number];
  ottPlatforms: OTTPlatform[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// OTT Platform details
export const ottPlatforms: Record<OTTPlatform, { 
  icon: string; 
  color: string; 
  baseUrl: string;
}> = {
  'Netflix': { 
    icon: '🎬', 
    color: '#E50914',
    baseUrl: 'https://www.netflix.com/title/'
  },
  'Amazon Prime Video': { 
    icon: '📺', 
    color: '#00A8E1',
    baseUrl: 'https://www.primevideo.com/detail/'
  },
  'Disney+ Hotstar': { 
    icon: '🌟', 
    color: '#113CCF',
    baseUrl: 'https://www.hotstar.com/in/movies/'
  },
  'ZEE5': { 
    icon: '📺', 
    color: '#0C1B5C',
    baseUrl: 'https://www.zee5.com/movies/'
  },
  'SonyLIV': { 
    icon: '🎥', 
    color: '#C4AF00',
    baseUrl: 'https://www.sonyliv.com/movies/'
  },
  'Sun NXT': { 
    icon: '☀️', 
    color: '#FF6B00',
    baseUrl: 'https://www.sunnxt.com/movie/'
  },
  'MX Player': { 
    icon: '▶️', 
    color: '#FF1F3D',
    baseUrl: 'https://www.mxplayer.in/movie/'
  },
  'Voot': { 
    icon: '📱', 
    color: '#5CCBAB',
    baseUrl: 'https://www.voot.com/movies/'
  },
  'Aha': { 
    icon: '🎭', 
    color: '#FF3E6C',
    baseUrl: 'https://www.aha.video/movie/'
  },
  'YouTube': { 
    icon: '▶️', 
    color: '#FF0000',
    baseUrl: 'https://www.youtube.com/watch?v='
  },
  'JioCinema': { 
    icon: '🎬', 
    color: '#D81F26',
    baseUrl: 'https://www.jiocinema.com/movies/'
  }
};

// Available languages
export const availableLanguages: Language[] = [
  'English',
  'Hindi',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam'
];

// Common genres across Indian cinema
export const availableGenres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  // Indian specific genres
  'Masala',
  'Tollywood',
  'Bollywood',
  'Sandalwood',
  'Kollywood',
  'Mollywood',
  'Dubbed',
  'Mythology',
  'Devotional'
];
