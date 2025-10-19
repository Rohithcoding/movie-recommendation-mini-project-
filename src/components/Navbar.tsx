'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Movie } from '@/app/page'

interface NavbarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedGenres: string[]
  setSelectedGenres: (genres: string[]) => void
  selectedLanguages: string[]
  setSelectedLanguages: (languages: string[]) => void
  allGenres: string[]
  allLanguages: string[]
  movies: Movie[]
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  selectedGenres,
  setSelectedGenres,
  selectedLanguages,
  setSelectedLanguages,
  allGenres,
  allLanguages,
  movies
}: NavbarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

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
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery, movies])

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

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre)
        ? selectedGenres.filter(g => g !== genre)
        : [...selectedGenres, genre]
    )
  }

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(
      selectedLanguages.includes(language)
        ? selectedLanguages.filter(l => l !== language)
        : [...selectedLanguages, language]
    )
  }

  const clearAllFilters = () => {
    setSelectedGenres([])
    setSelectedLanguages([])
    setSearchQuery('')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              CineAI
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 md:mx-8 relative" ref={searchRef} id="search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search movies, directors, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSuggestions(false)
                    // Scroll to movies section to show results
                    document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400"
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              />
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {suggestions.map((movie) => (
                  <div
                    key={movie.id}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => {
                      setSearchQuery(movie.title)
                      setShowSuggestions(false)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-10 h-15 object-cover rounded"
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
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {(selectedGenres.length > 0 || selectedLanguages.length > 0) && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {selectedGenres.length + selectedLanguages.length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-6 bg-gray-800/50 border border-gray-600 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Genres */}
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {allLanguages.map((language) => (
                    <button
                      key={language}
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedLanguages.includes(language)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
