import { Movie, FilterOptions, Language } from '@/types/movie';

/**
 * Filter movies based on the provided filter options
 */
export function filterMovies(
  movies: Movie[], 
  filters: Partial<FilterOptions>
): Movie[] {
  return movies.filter(movie => {
    // Filter by languages
    if (filters.languages?.length && !filters.languages.some(lang => 
      movie.languages.includes(lang as Language)
    )) {
      return false;
    }

    // Filter by genres
    if (filters.genres?.length && !filters.genres.some(genre => 
      movie.genres.includes(genre)
    )) {
      return false;
    }

    // Filter by OTT platforms
    if (filters.ottPlatforms?.length && !filters.ottPlatforms.some(platform => 
      movie.streamingPlatforms.some(p => p.name === platform)
    )) {
      return false;
    }

    // Filter by minimum rating
    if (filters.minRating && movie.rating < filters.minRating) {
      return false;
    }

    // Filter by year range
    if (filters.yearRange) {
      const [minYear, maxYear] = filters.yearRange;
      if (movie.year < minYear || movie.year > maxYear) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get unique values for filters
 */
export function getUniqueValues<T>(items: T[], key: keyof T): any[] {
  return Array.from(new Set(items.map(item => item[key])));
}

/**
 * Get movies by language
 */
export function getMoviesByLanguage(movies: Movie[], language: Language): Movie[] {
  return movies.filter(movie => 
    movie.languages.includes(language)
  );
}

/**
 * Get recommended movies based on the current movie
 */
export function getRecommendedMovies(
  currentMovie: Movie, 
  allMovies: Movie[], 
  limit: number = 5
): Movie[] {
  // Get movies with similar genres and language
  const similarMovies = allMovies
    .filter(movie => 
      movie.id !== currentMovie.id && 
      movie.originalLanguage === currentMovie.originalLanguage
    )
    .map(movie => ({
      ...movie,
      // Calculate a similarity score
      score: calculateSimilarityScore(currentMovie, movie)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...movie }) => movie);

  return similarMovies;
}

/**
 * Calculate similarity score between two movies
 */
function calculateSimilarityScore(movie1: Movie, movie2: Movie): number {
  let score = 0;
  
  // Genre match
  const commonGenres = movie1.genres.filter(genre => 
    movie2.genres.includes(genre)
  ).length;
  score += commonGenres * 5;
  
  // Same director
  if (movie1.director && movie1.director === movie2.director) {
    score += 10;
  }
  
  // Same cast members
  const commonCast = movie1.cast.filter(actor => 
    movie2.cast.includes(actor)
  ).length;
  score += commonCast * 2;
  
  // Similar release year (within 5 years)
  if (Math.abs(movie1.year - movie2.year) <= 5) {
    score += 5;
  }
  
  return score;
}

/**
 * Search movies by query
 */
export function searchMovies(movies: Movie[], query: string): Movie[] {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm) ||
    movie.originalTitle?.toLowerCase().includes(searchTerm) ||
    movie.director.toLowerCase().includes(searchTerm) ||
    movie.cast.some(actor => actor.toLowerCase().includes(searchTerm)) ||
    movie.genres.some(genre => genre.toLowerCase().includes(searchTerm))
  );
}

/**
 * Group movies by language
 */
export function groupMoviesByLanguage(movies: Movie[]): Record<Language, Movie[]> {
  const result: Partial<Record<Language, Movie[]>> = {};
  
  movies.forEach(movie => {
    movie.languages.forEach(lang => {
      if (!result[lang]) {
        result[lang] = [];
      }
      result[lang]!.push(movie);
    });
  });
  
  return result as Record<Language, Movie[]>;
}

/**
 * Get available languages from movie list
 */
export function getAvailableLanguages(movies: Movie[]): Language[] {
  const languages = new Set<Language>();
  
  movies.forEach(movie => {
    movie.languages.forEach(lang => languages.add(lang as Language));
  });
  
  return Array.from(languages);
}

/**
 * Get available genres from movie list
 */
export function getAvailableGenres(movies: Movie[]): string[] {
  const genres = new Set<string>();
  
  movies.forEach(movie => {
    movie.genres.forEach(genre => genres.add(genre));
  });
  
  return Array.from(genres);
}
