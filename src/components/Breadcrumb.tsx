'use client'

import { ChevronRight, Home, ArrowLeft } from 'lucide-react'
import { useNavigation } from '@/contexts/NavigationContext'

export default function Breadcrumb() {
  const { currentState, navigateBack, canGoBack } = useNavigation()

  if (currentState.breadcrumbs.length <= 1) {
    return null
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm">
            {currentState.breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-500 mx-2" />
                )}
                {index === 0 && (
                  <Home className="w-4 h-4 text-gray-400 mr-2" />
                )}
                {crumb.isActive ? (
                  <span className="text-white font-medium">{crumb.label}</span>
                ) : (
                  <button
                    onClick={crumb.action}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
                  >
                    {crumb.label}
                  </button>
                )}
              </div>
            ))}
          </nav>
          
          {canGoBack && (
            <button
              onClick={navigateBack}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
