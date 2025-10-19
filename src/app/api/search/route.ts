import { NextRequest, NextResponse } from 'next/server'
import moviesData from '@/data/movies.json'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.toLowerCase() || ''
    const genres = searchParams.get('genres')?.split(',').filter(Boolean) || []
    const languages = searchParams.get('languages')?.split(',').filter(Boolean) || []
    const limit = parseInt(searchParams.get('limit') || '20')

    let filteredMovies = moviesData

    // Apply search query filter
    if (query) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.cast.some(actor => actor.toLowerCase().includes(query)) ||
        movie.genres.some(genre => genre.toLowerCase().includes(query)) ||
        movie.description.toLowerCase().includes(query)
      )
    }

    // Apply genre filter
    if (genres.length > 0) {
      filteredMovies = filteredMovies.filter(movie =>
        genres.some(genre => movie.genres.includes(genre))
      )
    }

    // Apply language filter
    if (languages.length > 0) {
      filteredMovies = filteredMovies.filter(movie =>
        languages.includes(movie.language)
      )
    }

    // Sort by rating (highest first) and limit results
    const results = filteredMovies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)

    return NextResponse.json({
      movies: results,
      total: results.length,
      query: {
        search: query,
        genres,
        languages,
        limit
      }
    })

  } catch (error) {
    console.error('Error searching movies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
