'use client'

import { useState } from 'react'
import { X, User, Calendar, Users, Loader2 } from 'lucide-react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import toast from 'react-hot-toast'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUserProfile } = useFirebaseAuth()
  const [name, setName] = useState(user?.name || user?.displayName || '')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not-to-say'>(user?.gender || 'prefer-not-to-say')
  const [age, setAge] = useState(user?.age?.toString() || '')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }

    const ageNum = parseInt(age)
    if (!age || ageNum < 13 || ageNum > 120) {
      toast.error('Please enter a valid age (13-120)')
      return
    }

    setIsLoading(true)
    try {
      await updateUserProfile({
        name: name.trim(),
        gender,
        age: ageNum
      })
      toast.success('Profile updated successfully!')
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-xl shadow-2xl border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
            <p className="text-gray-400">
              Help us personalize your movie recommendations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white appearance-none"
                  required
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Age Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be 13 or older to use CineAI
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">
                🔒 Your personal information is secure and will only be used to improve your movie recommendations. We never share your data with third parties.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Complete Profile'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
