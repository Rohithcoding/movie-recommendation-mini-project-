'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  ConfirmationResult,
  RecaptchaVerifier,
  onAuthStateChanged
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  addDoc
} from 'firebase/firestore'
import { auth, db, googleProvider, setupRecaptcha } from '@/lib/firebase'
import toast from 'react-hot-toast'

export interface UserProfile {
  uid: string
  email?: string
  phoneNumber?: string
  displayName?: string
  photoURL?: string
  name?: string
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  age?: number
  isProfileComplete?: boolean
  emailVerified?: boolean
  createdAt?: any
  lastLoginAt?: any
  preferences?: {
    favoriteGenres?: string[]
    preferredLanguages?: string[]
    watchlist?: string[]
  }
}

interface AuthContextType {
  user: UserProfile | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>
  verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>
  logout: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function FirebaseAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)

  // Initialize reCAPTCHA
  useEffect(() => {
    const initRecaptcha = () => {
      if (!recaptchaVerifier) {
        try {
          const verifier = setupRecaptcha('recaptcha-container')
          setRecaptchaVerifier(verifier)
        } catch (error) {
          console.error('Error setting up reCAPTCHA:', error)
        }
      }
    }

    initRecaptcha()
    
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
      }
    }
  }, [recaptchaVerifier])

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile
            setUser({
              ...userData,
              uid: firebaseUser.uid,
              email: firebaseUser.email || userData.email,
              phoneNumber: firebaseUser.phoneNumber || userData.phoneNumber,
              displayName: firebaseUser.displayName || userData.displayName,
              photoURL: firebaseUser.photoURL || userData.photoURL,
              emailVerified: firebaseUser.emailVerified
            })
          } else {
            // Create new user profile
            const newUserProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              phoneNumber: firebaseUser.phoneNumber || undefined,
              displayName: firebaseUser.displayName || undefined,
              photoURL: firebaseUser.photoURL || undefined,
              emailVerified: firebaseUser.emailVerified,
              isProfileComplete: false,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            }
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile)
            setUser(newUserProfile)
          }
          
          // Update last login time
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            lastLoginAt: serverTimestamp()
          })
          
        } catch (error) {
          console.error('Error fetching user profile:', error)
          toast.error('Error loading user profile')
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      if (!result.user.emailVerified) {
        toast.error('Please verify your email before signing in')
        await signOut(auth)
        return
      }
      
      toast.success('Login successful!')
    } catch (error: any) {
      console.error('Login error:', error)
      
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email')
          break
        case 'auth/wrong-password':
          toast.error('Incorrect password')
          break
        case 'auth/invalid-email':
          toast.error('Invalid email address')
          break
        case 'auth/too-many-requests':
          toast.error('Too many failed attempts. Please try again later')
          break
        default:
          toast.error('Login failed. Please try again')
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Send email verification
      await sendEmailVerification(result.user)
      toast.success('Account created! Please check your email for verification link')
      
      // Sign out until email is verified
      await signOut(auth)
      
    } catch (error: any) {
      console.error('Signup error:', error)
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('An account with this email already exists')
          break
        case 'auth/invalid-email':
          toast.error('Invalid email address')
          break
        case 'auth/weak-password':
          toast.error('Password should be at least 6 characters')
          break
        default:
          toast.error('Signup failed. Please try again')
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      
      // Update display name if not set
      if (!result.user.displayName && result.user.email) {
        await updateProfile(result.user, {
          displayName: result.user.email.split('@')[0]
        })
      }
      
      toast.success('Google login successful!')
    } catch (error: any) {
      console.error('Google login error:', error)
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          toast.error('Login cancelled')
          break
        case 'auth/popup-blocked':
          toast.error('Popup blocked. Please allow popups and try again')
          break
        default:
          toast.error('Google login failed. Please try again')
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    try {
      setLoading(true)
      
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized')
      }
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      toast.success('OTP sent to your phone!')
      return confirmationResult
      
    } catch (error: any) {
      console.error('Phone login error:', error)
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          toast.error('Invalid phone number')
          break
        case 'auth/too-many-requests':
          toast.error('Too many requests. Please try again later')
          break
        default:
          toast.error('Failed to send OTP. Please try again')
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string): Promise<void> => {
    try {
      setLoading(true)
      await confirmationResult.confirm(otp)
      toast.success('Phone verification successful!')
    } catch (error: any) {
      console.error('OTP verification error:', error)
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          toast.error('Invalid OTP. Please try again')
          break
        case 'auth/code-expired':
          toast.error('OTP expired. Please request a new one')
          break
        default:
          toast.error('OTP verification failed. Please try again')
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!firebaseUser) throw new Error('No user logged in')
    
    try {
      setLoading(true)
      
      // Update Firestore document
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        ...profileData,
        isProfileComplete: !!(profileData.name && profileData.gender && profileData.age),
        updatedAt: serverTimestamp()
      })
      
      // Update Firebase Auth profile if display name changed
      if (profileData.name && profileData.name !== firebaseUser.displayName) {
        await updateProfile(firebaseUser, {
          displayName: profileData.name
        })
      }
      
      // Refresh user data
      await refreshUser()
      toast.success('Profile updated successfully!')
      
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile. Please try again')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      await signOut(auth)
      setUser(null)
      setFirebaseUser(null)
      toast.success('Logged out successfully')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Logout failed. Please try again')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent!')
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email')
          break
        case 'auth/invalid-email':
          toast.error('Invalid email address')
          break
        default:
          toast.error('Failed to send password reset email')
      }
      throw error
    }
  }

  const sendVerificationEmail = async (): Promise<void> => {
    if (!firebaseUser) throw new Error('No user logged in')
    
    try {
      await sendEmailVerification(firebaseUser)
      toast.success('Verification email sent!')
    } catch (error: any) {
      console.error('Email verification error:', error)
      toast.error('Failed to send verification email')
      throw error
    }
  }

  const refreshUser = async (): Promise<void> => {
    if (!firebaseUser) return
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile
        setUser({
          ...userData,
          uid: firebaseUser.uid,
          email: firebaseUser.email || userData.email,
          phoneNumber: firebaseUser.phoneNumber || userData.phoneNumber,
          displayName: firebaseUser.displayName || userData.displayName,
          photoURL: firebaseUser.photoURL || userData.photoURL,
          emailVerified: firebaseUser.emailVerified
        })
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const contextValue: AuthContextType = {
    user,
    firebaseUser,
    loading,
    isAuthenticated: !!firebaseUser,
    login,
    signup,
    loginWithGoogle,
    loginWithPhone,
    verifyOTP,
    updateUserProfile,
    logout,
    sendPasswordReset,
    sendVerificationEmail,
    refreshUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider')
  }
  return context
}
