'use client'

import { Heart, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                CineAI
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover your next favorite movie with AI-powered recommendations. 
              Explore the best of Indian and Hollywood cinema with personalized suggestions.
            </p>
            <div className="flex items-center space-x-1 text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>using Next.js & AI</span>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>AI Recommendations</li>
              <li>Multi-language Support</li>
              <li>Advanced Filters</li>
              <li>Smart Search</li>
              <li>Responsive Design</li>
            </ul>
          </div>

          {/* Languages Supported */}
          <div>
            <h3 className="text-white font-semibold mb-4">Languages</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Hindi</li>
              <li>English</li>
              <li>Telugu</li>
              <li>Tamil</li>
              <li>Kannada</li>
              <li>Malayalam</li>
              <li>And more...</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 CineAI. All rights reserved. Built for movie enthusiasts.
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
