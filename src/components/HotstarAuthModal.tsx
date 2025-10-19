'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Phone, Eye, EyeOff, Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { ConfirmationResult } from 'firebase/auth'
import toast from 'react-hot-toast'

interface HotstarAuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export default function HotstarAuthModal({ isOpen, onClose, initialMode = 'login' }: HotstarAuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'phone' | 'otp' | 'forgot' | 'verify-email'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const { 
    login, 
    signup, 
    loginWithGoogle, 
    loginWithPhone, 
    verifyOTP, 
    sendPasswordReset,
    sendVerificationEmail,
    firebaseUser
  } = useFirebaseAuth()

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setPhoneNumber('')
      setOtp('')
      setErrors({})
      setConfirmationResult(null)
      setCountdown(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const newErrors: {[key: string]: string} = {}

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (mode === 'signup' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        onClose()
      } else {
        await signup(email, password)
        setMode('verify-email')
      }
    } catch (error: any) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await loginWithGoogle()
      onClose()
    } catch (error: any) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const newErrors: {[key: string]: string} = {}
    const cleanPhone = phoneNumber.replace(/\s/g, '')

    if (!validatePhone(cleanPhone)) {
      newErrors.phone = 'Please enter a valid phone number with country code'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    try {
      const result = await loginWithPhone(cleanPhone)
      setConfirmationResult(result)
      setMode('otp')
      setCountdown(60) // 60 second countdown
    } catch (error: any) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || !confirmationResult) return

    const newErrors: {[key: string]: string} = {}

    if (otp.length !== 6) {
      newErrors.otp = 'Please enter a valid 6-digit OTP'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    try {
      await verifyOTP(confirmationResult, otp)
      onClose()
    } catch (error: any) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const newErrors: {[key: string]: string} = {}

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    try {
      await sendPasswordReset(email)
      setMode('login')
    } catch (error: any) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0 || isLoading) return
    
    setIsLoading(true)
    try {
      const result = await loginWithPhone(phoneNumber.replace(/\s/g, ''))
      setConfirmationResult(result)
      setCountdown(60)
      setOtp('')
    } catch (error: any) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await sendVerificationEmail()
    } catch (error: any) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    switch (mode) {
      case 'login':
      case 'signup':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Join CineAI'}
              </h2>
              <p className="text-gray-400">
                {mode === 'login' 
                  ? 'Sign in to continue watching' 
                  : 'Create your account to get started'
                }
              </p>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({...errors, email: ''})
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({...errors, password: ''})
                    }}
                    className={`w-full pl-4 pr-10 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''})
                    }}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="text-center space-y-3">
              {mode === 'login' && (
                <button
                  onClick={() => setMode('forgot')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Forgot your password?
                </button>
              )}
              
              <div className="flex items-center justify-center space-x-2 text-sm">
                <button
                  onClick={() => setMode('phone')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Use phone number instead
                </button>
              </div>

              <div className="text-gray-400 text-sm">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </div>
          </div>
        )

      case 'phone':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Phone Login</h2>
              <p className="text-gray-400">We'll send you a verification code</p>
            </div>

            <form onSubmit={handlePhoneAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      if (errors.phone) setErrors({...errors, phone: ''})
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      errors.phone 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Include country code (e.g., +1 for US, +91 for India)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Back to email login
              </button>
            </div>
          </div>
        )

      case 'otp':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Enter Verification Code</h2>
              <p className="text-gray-400">
                We sent a 6-digit code to {phoneNumber}
              </p>
            </div>

            <form onSubmit={handleOTPVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtp(value)
                    if (errors.otp) setErrors({...errors, otp: ''})
                  }}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white text-center text-2xl tracking-widest ${
                    errors.otp 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="123456"
                  maxLength={6}
                  required
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-400 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.otp}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify Code'
                )}
              </button>
            </form>

            <div className="text-center space-y-2">
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0 || isLoading}
                className="text-blue-400 hover:text-blue-300 text-sm disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
              </button>
              <div>
                <button
                  onClick={() => setMode('phone')}
                  className="text-gray-400 hover:text-gray-300 text-sm"
                >
                  Change phone number
                </button>
              </div>
            </div>
          </div>
        )

      case 'forgot':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-gray-400">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({...errors, email: ''})
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Back to login
              </button>
            </div>
          </div>
        )

      case 'verify-email':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-gray-400 mb-4">
                We've sent a verification link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please check your email and click the verification link to activate your account.
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium mb-1">Check your spam folder</p>
                  <p>If you don't see the email, please check your spam or junk folder.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Resend Verification Email'
              )}
            </button>

            <div className="text-center">
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Back to login
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
