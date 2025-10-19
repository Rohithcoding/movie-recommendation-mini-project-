import { NextRequest, NextResponse } from 'next/server'
import moviesData from '@/data/movies.json'
import { getEnhancedRecommendations } from '@/utils/recommendations'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const movieId = searchParams.get('movieId')
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      )
    }

    // Find the target movie
    const targetMovie = moviesData.find(movie => movie.id === parseInt(movieId))
    
    if (!targetMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    // Get recommendations
    const recommendations = getEnhancedRecommendations(targetMovie, moviesData, limit)

    return NextResponse.json({
      targetMovie,
      recommendations,
      count: recommendations.length
    })

  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { movieTitle, limit = 6 } = body

    if (!movieTitle) {
      return NextResponse.json(
        { error: 'Movie title is required' },
        { status: 400 }
      )
    }

    // Find movie by title (case insensitive)
    const targetMovie = moviesData.find(movie => 
      movie.title.toLowerCase() === movieTitle.toLowerCase()
    )

    if (!targetMovie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    // Get recommendations
    const recommendations = getEnhancedRecommendations(targetMovie, moviesData, limit)

    return NextResponse.json({
      targetMovie,
      recommendations,
      count: recommendations.length
    })

  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
