'use client'

import { useState } from 'react'
import { Star, Play } from 'lucide-react'
import { Movie } from '@/app/page'

interface MovieCardProps {
  movie: Movie
  onClick: () => void
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true) // Consider error state as loaded
  }

  return (
    <div
      className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg group-hover:shadow-2xl">
        {/* Movie Poster */}
        <div className="aspect-[2/3] relative">
          {!imageError ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🎬</div>
                <div className="text-sm font-medium text-gray-300">{movie.title}</div>
              </div>
            </div>
          )}

          {/* Loading placeholder */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-600">Loading...</div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100" />
          </div>

          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium text-white">{movie.rating}</span>
          </div>

          {/* Language badge */}
          <div className="absolute top-2 left-2 bg-blue-600 bg-opacity-90 rounded px-2 py-1">
            <span className="text-xs font-medium text-white">{movie.language}</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-xs mb-2">{movie.year}</p>
          
          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
              >
                {genre}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="text-xs text-gray-500">+{movie.genres.length - 2}</span>
            )}
          </div>

          {/* Director */}
          <p className="text-gray-500 text-xs truncate">
            Dir: {movie.director}
          </p>
        </div>
      </div>
    </div>
  )
}
