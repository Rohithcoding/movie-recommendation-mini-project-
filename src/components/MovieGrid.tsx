'use client'

import { Movie } from '@/app/page'
import MovieCard from './MovieCard'

interface MovieGridProps {
  movies: Movie[]
  onMovieClick: (movie: Movie) => void
}

export default function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-2xl font-semibold mb-2">No movies found</h3>
        <p className="text-gray-400 text-center max-w-md">
          Try adjusting your search terms or filters to find more movies.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </div>
  )
}
