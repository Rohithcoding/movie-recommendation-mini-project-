'use client'

import { useCallback, useEffect, useState } from 'react'
import { X, Star, Calendar, Globe, User, Film, Play, Tv, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Movie } from '@/app/page'
import { getEnhancedRecommendations } from '@/utils/recommendations'
import { getPlatformIcon } from '@/utils/streamingLinks'
import { useNavigation } from '@/contexts/NavigationContext'
import MovieCard from './MovieCard'

interface MovieModalProps {
  movie: Movie
  onClose: () => void
  allMovies: Movie[]
  onMovieSelect?: (movie: Movie) => void
}

export default function MovieModal({ movie, onClose, allMovies, onMovieSelect }: MovieModalProps) {
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { navigateBack, canGoBack, currentState } = useNavigation()

  // Find current movie index in filtered results for navigation
  useEffect(() => {
    const index = allMovies.findIndex(m => m.id === movie.id)
    setCurrentMovieIndex(index)
  }, [movie, allMovies])

  const navigateToMovie = (movie: Movie) => {
    if (onMovieSelect) {
      onMovieSelect(movie);
    }
  };

  useEffect(() => {
    // Generate recommendations when modal opens
    const recs = getEnhancedRecommendations(movie, allMovies, 12) // Show more recommendations
    setRecommendations(recs)
    
    // Add to navigation history
    navigateToMovie(movie)
    
    return () => {
      const handleClose = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        document.body.style.overflow = 'auto'
        onClose()
      }

      const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }
    }
  }, [movie, allMovies, onMovieSelect])

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose()
          break
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            navigateToPrevious()
          }
          break
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            navigateToNext()
          }
          break
        case 'Backspace':
          if (canGoBack) {
            e.preventDefault()
            navigateBack()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [canGoBack, navigateBack, allMovies, currentMovieIndex])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleClose = () => {
    if (canGoBack) {
      navigateBack()
    } else {
      onClose()
    }
  }

  const navigateToPrevious = useCallback(() => {
    if (currentMovieIndex > 0) {
      const prevMovie = allMovies[currentMovieIndex - 1]
      if (prevMovie && onMovieSelect) {
        setIsLoading(true)
        onMovieSelect(prevMovie)
        // No need for setTimeout as we want immediate feedback
        setIsLoading(false)
      }
    }
  }, [currentMovieIndex, allMovies, onMovieSelect])

  const navigateToNext = useCallback(() => {
    if (currentMovieIndex < allMovies.length - 1) {
      const nextMovie = allMovies[currentMovieIndex + 1]
      if (nextMovie && onMovieSelect) {
        setIsLoading(true)
        onMovieSelect(nextMovie)
        // No need for setTimeout as we want immediate feedback
        setIsLoading(false)
      }
    }
  }, [currentMovieIndex, allMovies.length, onMovieSelect])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if modal is open
      if (!document.body.classList.contains('modal-open')) return

      switch (e.key) {
        case 'Escape':
          handleClose()
          break
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            navigateToPrevious()
          }
          break
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            navigateToNext()
          }
          break
        case 'Backspace':
          if (canGoBack) {
            e.preventDefault()
            navigateBack()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigateToPrevious, navigateToNext, canGoBack, navigateBack, handleClose])

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        {/* Navigation Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={() => canGoBack ? navigateBack() : handleClose()}
            className="text-gray-400 hover:text-white flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 transition-colors"
            aria-label={canGoBack ? 'Go back' : 'Close'}
          >
            <ArrowLeft size={20} />
            {canGoBack ? 'Back' : 'Close'}
          </button>

          {/* Movie Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={navigateToPrevious}
              disabled={currentMovieIndex <= 0}
              className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous movie (Ctrl+←)"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {currentMovieIndex + 1} of {allMovies.length}
            </span>
            <button
              onClick={navigateToNext}
              disabled={currentMovieIndex >= allMovies.length - 1}
              className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next movie (Ctrl+→)"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-white">Loading...</span>
            </div>
          </div>
        )}

        <div className="overflow-y-auto max-h-[95vh]">
          {/* Hero Section */}
          <div className="relative min-h-80 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            
            {/* Movie Path/Breadcrumb */}
            <div className="absolute top-20 left-6 right-6 z-10">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>Movies</span>
                {movie.genres.length > 0 && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span>{movie.genres[0]}</span>
                  </>
                )}
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">{movie.title}</span>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-end h-full p-6 md:p-8 pt-16">
              <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6 w-full">
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-40 h-60 md:w-48 md:h-72 object-cover rounded-lg shadow-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title)}`
                    }}
                  />
                </div>

                {/* Movie Info */}
                <div className="flex-1 pb-4 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{movie.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-5 h-5 text-gray-300" />
                      <span className="text-gray-300">{movie.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-5 h-5 text-gray-300" />
                      <span className="text-gray-300">{movie.language}</span>
                    </div>
                  </div>
                  
                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-600 bg-opacity-80 text-white text-sm rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Director */}
                  <div className="flex items-center space-x-2 text-gray-300 mb-4">
                    <Film className="w-5 h-5" />
                    <span>Directed by {movie.director}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <a
                      href={movie.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Play className="w-5 h-5" />
                      <span>Watch Trailer</span>
                    </a>
                    <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      <Tv className="w-5 h-5" />
                      <span>Add to Watchlist</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>
            </div>

            {/* Where to Watch */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Tv className="w-5 h-5 mr-2" />
                Where to Watch
              </h3>
              <div className="flex flex-wrap gap-3">
                {movie.streamingPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-lg">{getPlatformIcon(platform.name)}</span>
                    <span className="font-semibold">{platform.name}</span>
                    <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </a>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-3">
                🎬 Click any platform to watch the movie directly on their website
              </p>
              
              {/* Keyboard shortcuts hint */}
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-xs mb-2">⌨️ Keyboard shortcuts:</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span><kbd className="bg-gray-700 px-1 rounded">ESC</kbd> Close</span>
                  <span><kbd className="bg-gray-700 px-1 rounded">Ctrl+←</kbd> Previous</span>
                  <span><kbd className="bg-gray-700 px-1 rounded">Ctrl+→</kbd> Next</span>
                  <span><kbd className="bg-gray-700 px-1 rounded">Backspace</kbd> Back</span>
                </div>
              </div>
            </div>

            {/* Cast */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Cast
              </h3>
              <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 z-10 bg-gray-900 bg-opacity-90 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-800">
                  <button
                    onClick={() => canGoBack ? navigateBack() : handleClose()}
                    className="text-gray-400 hover:text-white flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 transition-colors"
                    aria-label={canGoBack ? 'Go back' : 'Close'}
                  >
                    <ArrowLeft size={20} />
                    {canGoBack ? 'Back' : 'Close'}
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Film className="w-6 h-6 mr-2 text-blue-400" />
                  Similar Movies You Might Like
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendations.map((recMovie) => (
                    <div key={recMovie.id} className="transform hover:scale-105 transition-all duration-200">
                      <MovieCard
                        movie={recMovie}
                        onClick={() => {
                          if (onMovieSelect) {
                            setIsLoading(true)
                            setTimeout(() => {
                              onMovieSelect(recMovie)
                              setIsLoading(false)
                            }, 150)
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-4 text-center">
                  Click on any movie to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
