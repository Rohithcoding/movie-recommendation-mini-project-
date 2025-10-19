import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CineAI - Movie Recommendations',
  description: 'AI-powered movie recommendations for Indian and Hollywood films',
  keywords: 'movies, recommendations, AI, Bollywood, Hollywood, streaming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseAuthProvider>
          <NavigationProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
              {children}
            </div>
          </NavigationProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  )
}
