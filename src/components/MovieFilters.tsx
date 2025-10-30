'use client';

import { useState, useEffect } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, OTTPlatform, ottPlatforms, availableGenres } from '@/types/movie';
import OTTService from '@/services/ottService';

interface MovieFiltersProps {
  onFilterChange: (filters: {
    languages: Language[];
    genres: string[];
    ottPlatforms: OTTPlatform[];
    minRating: number;
    yearRange: [number, number];
  }) => void;
  availableLanguages: Language[];
  availableGenres: string[];
  className?: string;
}

export default function MovieFilters({
  onFilterChange,
  availableLanguages,
  availableGenres,
  className = ''
}: MovieFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    languages: [] as Language[],
    genres: [] as string[],
    ottPlatforms: [] as OTTPlatform[],
    minRating: 0,
    yearRange: [1990, new Date().getFullYear()] as [number, number]
  });

  // Get all OTT platforms
  const allOTTPlatforms = OTTService.getAllPlatforms();

  // Update parent when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleLanguage = (language: Language) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const toggleOTTPlatform = (platform: OTTPlatform) => {
    setFilters(prev => ({
      ...prev,
      ottPlatforms: prev.ottPlatforms.includes(platform)
        ? prev.ottPlatforms.filter(p => p !== platform)
        : [...prev.ottPlatforms, platform]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      languages: [],
      genres: [],
      ottPlatforms: [],
      minRating: 0,
      yearRange: [1990, new Date().getFullYear()] as [number, number]
    });
  };

  const hasActiveFilters = 
    filters.languages.length > 0 ||
    filters.genres.length > 0 ||
    filters.ottPlatforms.length > 0 ||
    filters.minRating > 0 ||
    filters.yearRange[0] > 1990 ||
    filters.yearRange[1] < new Date().getFullYear();

  return (
    <div className={`bg-gray-900 rounded-lg p-4 shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </h3>
        <div className="flex space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
            >
              <X className="h-4 w-4 mr-1" /> Clear All
            </button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Languages */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.languages.includes(lang)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.genres.includes(genre)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* OTT Platforms */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Streaming On</h4>
            <div className="flex flex-wrap gap-2">
              {allOTTPlatforms.map(platform => (
                <button
                  key={platform.name}
                  onClick={() => toggleOTTPlatform(platform.name)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    filters.ottPlatforms.includes(platform.name)
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  style={{
                    borderLeft: `3px solid ${platform.color}`
                  }}
                >
                  <span className="mr-1">{platform.icon}</span>
                  {platform.name.replace('Amazon Prime Video', 'Prime Video')}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-300">Minimum Rating</h4>
              <span className="text-sm text-white font-medium">
                {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                minRating: parseFloat(e.target.value)
              }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-300">Release Year</h4>
              <span className="text-sm text-white font-medium">
                {filters.yearRange[0]} - {filters.yearRange[1]}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1950"
                max={new Date().getFullYear()}
                value={filters.yearRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yearRange: [parseInt(e.target.value), prev.yearRange[1]]
                }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="range"
                min="1950"
                max={new Date().getFullYear()}
                value={filters.yearRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  yearRange: [prev.yearRange[0], parseInt(e.target.value)]
                }))}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1950</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
