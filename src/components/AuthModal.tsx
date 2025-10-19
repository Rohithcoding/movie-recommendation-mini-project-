'use client'

import { useState } from 'react'
import { X, Mail, Phone, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'phone' | 'otp' | 'forgot'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login, signup, loginWithGoogle, loginWithPhone, verifyOTP, sendPasswordReset } = useAuth()

  if (!isOpen) return null

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (mode === 'signup' && password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        toast.success('Login successful!')
      } else {
        await signup(email, password)
        toast.success('Account created successfully!')
      }
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Google login successful!')
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (!/^\+?[\d\s-()]+$/.test(phoneNumber)) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    try {
      const verificationId = await loginWithPhone(phoneNumber)
      setVerificationId(verificationId)
      setMode('otp')
      toast.success('OTP sent to your phone!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      await verifyOTP(verificationId, otp)
      toast.success('Phone verification successful!')
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      await sendPasswordReset(email)
      toast.success('Password reset email sent!')
      setMode('login')
    } catch (error: any) {
      toast.error(error.message)
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
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400">
                {mode === 'login' 
                  ? 'Sign in to access your personalized movie recommendations' 
                  : 'Join CineAI for personalized movie recommendations'
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
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
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
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="text-center space-y-2">
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
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
              <h2 className="text-2xl font-bold text-white mb-2">Enter Verification Code</h2>
              <p className="text-gray-400">
                We sent a 6-digit code to {phoneNumber}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Demo: Use code "123456"
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
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white text-center text-2xl tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                onClick={() => handlePhoneAuth(new Event('submit') as any)}
                className="text-blue-400 hover:text-blue-300 text-sm"
                disabled={isLoading}
              >
                Resend code
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

      default:
        return null
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
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
