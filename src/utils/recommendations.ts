import { Movie } from '@/app/page'

// Simple text preprocessing
function preprocessText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
}

// Create a simple TF-IDF like vector for a movie
function createMovieVector(movie: Movie, allWords: string[]): number[] {
  const movieText = [
    movie.title,
    movie.description,
    ...movie.genres,
    movie.director,
    ...movie.cast,
    movie.language
  ].join(' ')
  
  const words = preprocessText(movieText)
  const wordCount: { [key: string]: number } = {}
  
  // Count word frequencies
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  
  // Create vector based on all words
  return allWords.map(word => wordCount[word] || 0)
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0)
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0))
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}

// Get movie recommendations based on similarity
export function getRecommendations(targetMovie: Movie, allMovies: Movie[], limit: number = 6): Movie[] {
  // Extract all unique words from all movies
  const allWords = Array.from(new Set(
    allMovies.flatMap(movie => {
      const movieText = [
        movie.title,
        movie.description,
        ...movie.genres,
        movie.director,
        ...movie.cast,
        movie.language
      ].join(' ')
      return preprocessText(movieText)
    })
  ))
  
  // Create vectors for all movies
  const movieVectors = allMovies.map(movie => createMovieVector(movie, allWords))
  const targetVector = createMovieVector(targetMovie, allWords)
  
  // Calculate similarities
  const similarities = allMovies.map((movie, index) => ({
    movie,
    similarity: movie.id === targetMovie.id ? -1 : cosineSimilarity(targetVector, movieVectors[index])
  }))
  
  // Sort by similarity and return top recommendations
  return similarities
    .filter(item => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.movie)
}

// Enhanced recommendations that also consider genre and language preferences
export function getEnhancedRecommendations(
  targetMovie: Movie, 
  allMovies: Movie[], 
  limit: number = 6
): Movie[] {
  const baseRecommendations = getRecommendations(targetMovie, allMovies, limit * 2)
  
  // Boost movies with same language or overlapping genres
  const scoredRecommendations = baseRecommendations.map(movie => {
    let score = 1
    
    // Language bonus
    if (movie.language === targetMovie.language) {
      score += 0.3
    }
    
    // Genre overlap bonus
    const genreOverlap = movie.genres.filter(genre => 
      targetMovie.genres.includes(genre)
    ).length
    score += genreOverlap * 0.2
    
    // Rating bonus (prefer highly rated movies)
    score += (movie.rating - 7) * 0.1
    
    return { movie, score }
  })
  
  return scoredRecommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie)
}
