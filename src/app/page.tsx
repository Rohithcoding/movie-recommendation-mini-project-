'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import OTTFilters from '@/components/OTTFilters'
import QuickFilters from '@/components/QuickFilters'
import MovieGrid from '@/components/MovieGrid'
import MovieModal from '@/components/MovieModal'
import HotstarAuthModal from '@/components/HotstarAuthModal'
import ProfileModal from '@/components/ProfileModal'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'
import { getStreamingUrl } from '@/utils/streamingLinks'
import { useNavigation } from '@/contexts/NavigationContext'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import moviesData from '@/data/movies.json'
import toast, { Toaster } from 'react-hot-toast'

export interface Movie {
  id: number
  title: string
  year: number
  language: string
  genres: string[]
  description: string
  poster: string
  rating: number
  director: string
  cast: string[]
  streamingPlatforms: Array<{
    name: string
    url: string
  }>
  trailerUrl: string
}

export default function Home() {
  // Transform movies data to handle both old and new streaming platform formats
  const transformedMovies = moviesData.map(movie => ({
    ...movie,
    streamingPlatforms: Array.isArray(movie.streamingPlatforms) && typeof movie.streamingPlatforms[0] === 'string'
      ? (movie.streamingPlatforms as string[]).map(platform => ({
          name: platform,
          url: getStreamingUrl(platform, movie.title)
        }))
      : movie.streamingPlatforms as Array<{name: string, url: string}>
  })) as Movie[]

  const [movies, setMovies] = useState<Movie[]>(transformedMovies)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(transformedMovies)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const { navigateToMovie, navigateToSearch, navigateToGenre, currentState, saveScrollPosition } = useNavigation()
  const { user, isAuthenticated } = useFirebaseAuth()

  // Save scroll position periodically
  useEffect(() => {
    const handleScroll = () => {
      saveScrollPosition(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [saveScrollPosition])

  // Show profile completion modal for new users
  useEffect(() => {
    if (isAuthenticated && user && !user.isProfileComplete) {
      const timer = setTimeout(() => {
        setShowProfileModal(true)
      }, 2000) // Show after 2 seconds
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user])

  // Welcome message for new users
  useEffect(() => {
    if (isAuthenticated && user) {
      const welcomeShown = localStorage.getItem(`welcome-shown-${user.uid}`)
      if (!welcomeShown) {
        toast.success(`Welcome ${user.name || user.displayName || 'to CineAI'}! 🎬`, {
          duration: 4000,
          icon: '👋'
        })
        localStorage.setItem(`welcome-shown-${user.uid}`, 'true')
      }
    }
  }, [isAuthenticated, user])

  // Extract unique genres and languages
  const allGenres = Array.from(new Set(movies.flatMap(movie => movie.genres)))
  const allLanguages = Array.from(new Set(movies.map(movie => movie.language)))

  // Sync with navigation context
  useEffect(() => {
    if (currentState.searchQuery !== searchQuery) {
      setSearchQuery(currentState.searchQuery)
    }
    if (JSON.stringify(currentState.selectedGenres) !== JSON.stringify(selectedGenres)) {
      setSelectedGenres(currentState.selectedGenres)
    }
    if (JSON.stringify(currentState.selectedLanguages) !== JSON.stringify(selectedLanguages)) {
      setSelectedLanguages(currentState.selectedLanguages)
    }
    if (currentState.currentMovie !== selectedMovie) {
      setSelectedMovie(currentState.currentMovie)
    }
  }, [currentState])

  // Filter movies based on search, genres, and languages
  useEffect(() => {
    let filtered = movies

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie =>
        selectedGenres.some(genre => movie.genres.includes(genre))
      )
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(movie =>
        selectedLanguages.includes(movie.language)
      )
    }

    setFilteredMovies(filtered)
  }, [searchQuery, selectedGenres, selectedLanguages, movies])

  const handleMovieClick = (movie: Movie) => {
    navigateToMovie(movie)
    setSelectedMovie(movie)
  }

  const handleGenreChange = (genres: string[]) => {
    setSelectedGenres(genres)
    if (genres.length > 0) {
      navigateToGenre(genres)
    }
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      navigateToSearch(query)
    }
  }

  const handleAuthClick = () => {
    setShowAuthModal(true)
  }

  const handleProfileEdit = () => {
    setShowProfileModal(true)
  }

  return (
    <main className="min-h-screen">
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        movies={movies}
        onMovieSelect={handleMovieClick}
        onAuthClick={handleAuthClick}
        onProfileEdit={handleProfileEdit}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* OTT Filters */}
      <OTTFilters
        selectedGenres={selectedGenres}
        setSelectedGenres={handleGenreChange}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        allGenres={allGenres}
        allLanguages={allLanguages}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 py-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            CineAI
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {isAuthenticated && user 
              ? `Welcome back, ${user.name || user.displayName}! Discover your next favorite movie with personalized AI recommendations`
              : 'Discover your next favorite movie with AI-powered recommendations across Indian and Hollywood cinema'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Movies
            </button>
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthModal(true)
                }}
                className="w-full sm:w-auto px-8 py-4 border-2 border-blue-400 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg text-blue-400"
              >
                Join CineAI
              </button>
            ) : (
              <button
                onClick={() => {
                  const searchBar = document.querySelector('input[placeholder*="Search movies"]') as HTMLInputElement
                  searchBar?.focus()
                }}
                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-400 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
              >
                Search Movies
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <QuickFilters
        selectedGenres={selectedGenres}
        setSelectedGenres={handleGenreChange}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
      />

      {/* Movies Section */}
      <section id="movies" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {searchQuery || selectedGenres.length > 0 || selectedLanguages.length > 0
                  ? `Search Results`
                  : 'Featured Movies'
                }
              </h2>
              {searchQuery && (
                <p className="text-gray-400 mt-2">
                  Showing results for "<span className="text-blue-400 font-medium">{searchQuery}</span>"
                </p>
              )}
            </div>
            <div className="text-gray-400 text-sm sm:text-base">
              {filteredMovies.length} of {movies.length} movies
            </div>
          </div>
          
          <MovieGrid
            movies={filteredMovies}
            onMovieClick={handleMovieClick}
          />
        </div>
      </section>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          allMovies={filteredMovies.length > 0 ? filteredMovies : movies}
          onMovieSelect={handleMovieClick}
        />
      )}

      {/* Authentication Modal */}
      <HotstarAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Profile Completion Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff'
            }
          }
        }}
      />

      <Footer />
    </main>
  )
}
