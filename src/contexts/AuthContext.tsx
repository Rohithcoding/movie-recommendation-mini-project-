'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  uid: string
  email?: string
  phoneNumber?: string
  displayName?: string
  photoURL?: string
  name?: string
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  age?: number
  isProfileComplete?: boolean
  createdAt?: Date
  lastLoginAt?: Date
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithPhone: (phoneNumber: string) => Promise<string>
  verifyOTP: (verificationId: string, otp: string) => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  logout: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize Firebase auth state listener
  useEffect(() => {
    // Simulate loading user from localStorage or Firebase
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('cineai-user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const saveUserToStorage = (userData: User) => {
    localStorage.setItem('cineai-user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const userData: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        isProfileComplete: false,
        lastLoginAt: new Date()
      }
      
      saveUserToStorage(userData)
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData: User = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        isProfileComplete: false,
        createdAt: new Date(),
        lastLoginAt: new Date()
      }
      
      saveUserToStorage(userData)
    } catch (error) {
      throw new Error('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const userData: User = {
        uid: `google_${Date.now()}`,
        email: 'user@gmail.com',
        displayName: 'Google User',
        photoURL: 'https://via.placeholder.com/100x100/4285f4/ffffff?text=G',
        isProfileComplete: false,
        createdAt: new Date(),
        lastLoginAt: new Date()
      }
      
      saveUserToStorage(userData)
    } catch (error) {
      throw new Error('Google login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loginWithPhone = async (phoneNumber: string): Promise<string> => {
    setLoading(true)
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Return mock verification ID
      return `verification_${Date.now()}`
    } catch (error) {
      throw new Error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (verificationId: string, otp: string): Promise<void> => {
    setLoading(true)
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Please try again.')
      }
      
      const userData: User = {
        uid: `phone_${Date.now()}`,
        phoneNumber: '+1234567890',
        displayName: 'Phone User',
        isProfileComplete: false,
        createdAt: new Date(),
        lastLoginAt: new Date()
      }
      
      saveUserToStorage(userData)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in')
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUser = {
        ...user,
        ...profileData,
        isProfileComplete: !!(profileData.name && profileData.gender && profileData.age)
      }
      
      saveUserToStorage(updatedUser)
    } catch (error) {
      throw new Error('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setLoading(true)
    try {
      localStorage.removeItem('cineai-user')
      setUser(null)
    } catch (error) {
      throw new Error('Logout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      // Simulate sending password reset email
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      throw new Error('Failed to send password reset email.')
    }
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    loginWithGoogle,
    loginWithPhone,
    verifyOTP,
    updateProfile,
    logout,
    sendPasswordReset
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
