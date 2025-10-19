'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut, Edit, ChevronDown } from 'lucide-react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import toast from 'react-hot-toast'

interface UserProfileProps {
  onEditProfile: () => void
}

export default function UserProfile({ onEditProfile }: UserProfileProps) {
  const { user, logout } = useFirebaseAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (!user) return null

  const displayName = user.name || user.displayName || user.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <div className="text-white text-sm font-medium">{displayName}</div>
          {!user.isProfileComplete && (
            <div className="text-xs text-yellow-400">Complete profile</div>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{displayName}</div>
                <div className="text-gray-400 text-sm truncate">
                  {user.email || user.phoneNumber}
                </div>
                {user.age && user.gender && (
                  <div className="text-gray-500 text-xs">
                    {user.age} years • {user.gender}
                  </div>
                )}
              </div>
            </div>
            
            {!user.isProfileComplete && (
              <div className="mt-2 px-2 py-1 bg-yellow-900/30 border border-yellow-600/30 rounded text-yellow-400 text-xs">
                ⚠️ Complete your profile for better recommendations
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                onEditProfile()
                setIsOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="border-t border-gray-700 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Profile Completion Progress */}
          {!user.isProfileComplete && (
            <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/50">
              <div className="text-xs text-gray-400 mb-2">Profile Completion</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((user.name ? 1 : 0) + (user.gender ? 1 : 0) + (user.age ? 1 : 0)) / 3 * 100}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(((user.name ? 1 : 0) + (user.gender ? 1 : 0) + (user.age ? 1 : 0)) / 3 * 100)}% complete
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
