'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Movie } from '@/app/page'

interface NavigationState {
  currentView: 'home' | 'search' | 'movie' | 'genre'
  currentMovie: Movie | null
  searchQuery: string
  selectedGenres: string[]
  selectedLanguages: string[]
  scrollPosition: number
  breadcrumbs: BreadcrumbItem[]
}

interface BreadcrumbItem {
  label: string
  action?: () => void
  isActive?: boolean
}

interface NavigationHistory {
  state: NavigationState
  timestamp: number
}

interface NavigationContextType {
  currentState: NavigationState
  history: NavigationHistory[]
  navigateToMovie: (movie: Movie) => void
  navigateToSearch: (query: string) => void
  navigateToGenre: (genres: string[]) => void
  navigateBack: () => void
  canGoBack: boolean
  updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  saveScrollPosition: (position: number) => void
  clearHistory: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

const initialState: NavigationState = {
  currentView: 'home',
  currentMovie: null,
  searchQuery: '',
  selectedGenres: [],
  selectedLanguages: [],
  scrollPosition: 0,
  breadcrumbs: [{ label: 'Home', isActive: true }]
}

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentState, setCurrentState] = useState<NavigationState>(initialState)
  const [history, setHistory] = useState<NavigationHistory[]>([])

  const saveToHistory = useCallback((state: NavigationState) => {
    setHistory(prev => [...prev, { state: { ...state }, timestamp: Date.now() }])
  }, [])

  const navigateToMovie = useCallback((movie: Movie) => {
    saveToHistory(currentState)
    
    const movieBreadcrumbs: BreadcrumbItem[] = [
      { 
        label: 'Home', 
        action: () => {
          setCurrentState(initialState)
          setHistory([])
        }
      },
      ...(currentState.searchQuery ? [{ 
        label: `Search: "${currentState.searchQuery}"`,
        action: () => navigateBack()
      }] : []),
      ...(currentState.selectedGenres.length > 0 ? [{ 
        label: currentState.selectedGenres.join(', '),
        action: () => navigateBack()
      }] : []),
      { label: movie.title, isActive: true }
    ]

    setCurrentState({
      ...currentState,
      currentView: 'movie',
      currentMovie: movie,
      breadcrumbs: movieBreadcrumbs
    })
  }, [currentState, saveToHistory])

  const navigateToSearch = useCallback((query: string) => {
    if (currentState.currentView !== 'search' || currentState.searchQuery !== query) {
      saveToHistory(currentState)
    }
    
    const searchBreadcrumbs: BreadcrumbItem[] = [
      { 
        label: 'Home', 
        action: () => {
          setCurrentState(initialState)
          setHistory([])
        }
      },
      { label: `Search: "${query}"`, isActive: true }
    ]

    setCurrentState({
      ...currentState,
      currentView: 'search',
      searchQuery: query,
      currentMovie: null,
      breadcrumbs: searchBreadcrumbs
    })
  }, [currentState, saveToHistory])

  const navigateToGenre = useCallback((genres: string[]) => {
    if (currentState.currentView !== 'genre' || 
        JSON.stringify(currentState.selectedGenres) !== JSON.stringify(genres)) {
      saveToHistory(currentState)
    }
    
    const genreBreadcrumbs: BreadcrumbItem[] = [
      { 
        label: 'Home', 
        action: () => {
          setCurrentState(initialState)
          setHistory([])
        }
      },
      { label: `Genre: ${genres.join(', ')}`, isActive: true }
    ]

    setCurrentState({
      ...currentState,
      currentView: 'genre',
      selectedGenres: genres,
      currentMovie: null,
      breadcrumbs: genreBreadcrumbs
    })
  }, [currentState, saveToHistory])

  const navigateBack = useCallback(() => {
    if (history.length > 0) {
      // Get the previous state from history
      const previousState = history[history.length - 1].state
      
      // Update the history by removing the current state
      setHistory(prev => {
        const newHistory = [...prev]
        newHistory.pop()
        return newHistory
      })
      
      // Update the current state with the previous state
      setCurrentState(previousState)
      
      // Restore scroll position after a brief delay
      setTimeout(() => {
        window.scrollTo({ 
          top: previousState.scrollPosition || 0, 
          behavior: 'smooth' 
        })
      }, 100)
      
      return true
    }
    return false
  }, [history])

  // Calculate canGoBack based on history length
  const canGoBack = history.length > 0

  const updateBreadcrumbs = useCallback((breadcrumbs: BreadcrumbItem[]) => {
    setCurrentState(prev => ({ ...prev, breadcrumbs }))
  }, [])

  const saveScrollPosition = useCallback((position: number) => {
    setCurrentState(prev => ({ ...prev, scrollPosition: position }))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentState(initialState)
  }, [])

  const contextValue: NavigationContextType = {
    currentState,
    history,
    navigateToMovie,
    navigateToSearch,
    navigateToGenre,
    navigateBack,
    canGoBack,
    updateBreadcrumbs,
    saveScrollPosition,
    clearHistory
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
