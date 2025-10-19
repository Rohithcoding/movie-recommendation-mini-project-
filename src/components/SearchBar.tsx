'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, ArrowLeft, LogIn } from 'lucide-react'
import { Movie } from '@/app/page'
import { useNavigation } from '@/contexts/NavigationContext'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import UserProfile from './UserProfile'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  movies: Movie[]
  onMovieSelect?: (movie: Movie) => void
  onAuthClick?: () => void
  onProfileEdit?: () => void
}

export default function SearchBar({ searchQuery, setSearchQuery, movies, onMovieSelect, onAuthClick, onProfileEdit }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { navigateToSearch, navigateToMovie, navigateBack, canGoBack } = useNavigation()
  const { user, isAuthenticated } = useFirebaseAuth()

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cineai-search-history')
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse search history:', e)
      }
    }
  }, [])

  // Save search history to localStorage
  const saveToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 9)] // Keep last 10 searches
      setSearchHistory(newHistory)
      localStorage.setItem('cineai-search-history', JSON.stringify(newHistory))
    }
  }

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(true)
      setShowHistory(false)
    } else {
      setShowSuggestions(false)
      setShowHistory(searchHistory.length > 0)
    }
  }, [searchQuery, movies, searchHistory])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (query?: string) => {
    const finalQuery = query || searchQuery
    if (finalQuery.trim()) {
      saveToHistory(finalQuery)
      navigateToSearch(finalQuery)
      if (query) setSearchQuery(query)
    }
    setShowSuggestions(false)
    setShowHistory(false)
    // Scroll to movies section to show results
    setTimeout(() => {
      document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowSuggestions(false)
    setShowHistory(searchHistory.length > 0)
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('cineai-search-history')
    setShowHistory(false)
  }

  const handleMovieClick = (movie: Movie) => {
    navigateToMovie(movie)
    setShowSuggestions(false)
    setShowHistory(false)
    if (onMovieSelect) {
      onMovieSelect(movie)
    }
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            {canGoBack && (
              <button
                onClick={navigateBack}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                CineAI
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 md:mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search movies, directors, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="w-full pl-10 pr-10 py-3 bg-gray-800/70 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400"
                onFocus={() => {
                  if (searchQuery.length > 1) {
                    setShowSuggestions(true)
                  } else if (searchHistory.length > 0) {
                    setShowHistory(true)
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
                {suggestions.map((movie) => (
                  <div
                    key={movie.id}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-10 h-15 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://via.placeholder.com/40x60/1a1a1a/ffffff?text=${encodeURIComponent(movie.title.slice(0, 2))}`
                        }}
                      />
                      <div>
                        <div className="font-medium text-white">{movie.title}</div>
                        <div className="text-sm text-gray-400">
                          {movie.year} • {movie.language} • {movie.director}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search History */}
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
                <div className="px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {searchHistory.map((query, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => handleSearch(query)}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-white">{query}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth/Profile Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSearch()}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors hidden sm:block"
            >
              Search
            </button>
            
            {isAuthenticated && user ? (
              <UserProfile onEditProfile={onProfileEdit || (() => {})} />
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
