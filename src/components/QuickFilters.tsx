'use client'

interface QuickFiltersProps {
  selectedGenres: string[]
  setSelectedGenres: (genres: string[]) => void
  selectedLanguages: string[]
  setSelectedLanguages: (languages: string[]) => void
}

export default function QuickFilters({
  selectedGenres,
  setSelectedGenres,
  selectedLanguages,
  setSelectedLanguages
}: QuickFiltersProps) {
  const popularGenres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Sci-Fi']
  const popularLanguages = ['Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam']

  const handleGenreClick = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre)
        ? selectedGenres.filter(g => g !== genre)
        : [...selectedGenres, genre]
    )
    // Scroll to movies section
    setTimeout(() => {
      document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleLanguageClick = (language: string) => {
    setSelectedLanguages(
      selectedLanguages.includes(language)
        ? selectedLanguages.filter(l => l !== language)
        : [...selectedLanguages, language]
    )
    // Scroll to movies section
    setTimeout(() => {
      document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <section className="py-12 px-4 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Popular Genres */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Popular Genres</h3>
          <div className="flex flex-wrap gap-3">
            {popularGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedGenres.includes(genre)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Languages */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Popular Languages</h3>
          <div className="flex flex-wrap gap-3">
            {popularLanguages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageClick(language)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedLanguages.includes(language)
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
