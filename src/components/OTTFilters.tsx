'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, X, Filter } from 'lucide-react'

interface OTTFiltersProps {
  selectedGenres: string[]
  setSelectedGenres: (genres: string[]) => void
  selectedLanguages: string[]
  setSelectedLanguages: (languages: string[]) => void
  allGenres: string[]
  allLanguages: string[]
}

export default function OTTFilters({
  selectedGenres,
  setSelectedGenres,
  selectedLanguages,
  setSelectedLanguages,
  allGenres,
  allLanguages
}: OTTFiltersProps) {
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.genre-dropdown') && !target.closest('.genre-button')) {
        setShowGenreDropdown(false)
      }
      if (!target.closest('.language-dropdown') && !target.closest('.language-button')) {
        setShowLanguageDropdown(false)
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
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Label */}
          <div className="flex items-center space-x-2 text-white font-medium">
            <Filter className="w-5 h-5" />
            <span>Filters:</span>
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <button
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
              className="genre-button flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 text-white transition-colors"
            >
              <span>
                {selectedGenres.length > 0 
                  ? `Genres (${selectedGenres.length})` 
                  : 'All Genres'
                }
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showGenreDropdown && (
              <div className="genre-dropdown absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {allGenres.map((genre) => (
                    <label
                      key={genre}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-white">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Filter */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="language-button flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 text-white transition-colors"
            >
              <span>
                {selectedLanguages.length > 0 
                  ? `Languages (${selectedLanguages.length})` 
                  : 'All Languages'
                }
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageDropdown && (
              <div className="language-dropdown absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {allLanguages.map((language) => (
                    <label
                      key={language}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        onChange={() => handleLanguageToggle(language)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-white">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedGenres.length > 0 || selectedLanguages.length > 0) && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Active:</span>
              
              {/* Selected Genres */}
              {selectedGenres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                >
                  <span>{genre}</span>
                  <button
                    onClick={() => handleGenreToggle(genre)}
                    className="hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Selected Languages */}
              {selectedLanguages.map((language) => (
                <span
                  key={language}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                >
                  <span>{language}</span>
                  <button
                    onClick={() => handleLanguageToggle(language)}
                    className="hover:bg-purple-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Clear All Button */}
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
