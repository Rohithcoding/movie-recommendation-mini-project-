'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Movie } from '@/app/page'
import MovieCard from './MovieCard'

interface InstantSearchProps {
  movies: Movie[]
  onMovieClick: (movie: Movie) => void
}

export default function InstantSearch({ movies, onMovieClick }: InstantSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Instant search functionality
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([])
      setShowResults(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    // Debounce search
    const timeoutId = setTimeout(() => {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      setSearchResults(filtered)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, movies])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  const handleMovieClick = (movie: Movie) => {
    onMovieClick(movie)
    setShowResults(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
        <input
          type="text"
          placeholder="Search movies like YouTube - instant results..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length > 0 && setShowResults(true)}
          className="w-full pl-12 pr-12 py-4 text-lg bg-gray-800/70 border-2 border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-gray-400 backdrop-blur-sm"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-hidden z-50">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Searching movies...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-4">
                Found {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto">
                {searchResults.slice(0, 12).map((movie) => (
                  <div key={movie.id} className="transform hover:scale-105 transition-transform">
                    <MovieCard
                      movie={movie}
                      onClick={() => handleMovieClick(movie)}
                    />
                  </div>
                ))}
              </div>
              {searchResults.length > 12 && (
                <div className="text-center mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">
                    Showing first 12 results. Refine your search for more specific results.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
              <p className="text-gray-400">
                Try searching for a different movie, actor, or director
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
