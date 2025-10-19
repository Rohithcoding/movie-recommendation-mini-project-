export function getStreamingUrl(platformName: string, movieTitle: string): string {
  const encodedTitle = encodeURIComponent(movieTitle)
  
  switch (platformName.toLowerCase()) {
    case 'netflix':
      return `https://www.netflix.com/search?q=${encodedTitle}`
    
    case 'amazon prime video':
    case 'prime video':
      return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`
    
    case 'disney+':
    case 'disney plus':
      return `https://www.disneyplus.com/search/${encodedTitle}`
    
    case 'disney+ hotstar':
    case 'hotstar':
      return `https://www.hotstar.com/in/search/${encodedTitle}`
    
    case 'hbo max':
    case 'max':
      return `https://www.max.com/search?q=${encodedTitle}`
    
    case 'apple tv+':
    case 'apple tv':
      return `https://tv.apple.com/search?q=${encodedTitle}`
    
    case 'youtube':
      return `https://www.youtube.com/results?search_query=${encodedTitle}+full+movie`
    
    case 'hulu':
      return `https://www.hulu.com/search?q=${encodedTitle}`
    
    case 'paramount+':
    case 'paramount plus':
      return `https://www.paramountplus.com/search/?query=${encodedTitle}`
    
    default:
      // Fallback to Google search for the movie on that platform
      return `https://www.google.com/search?q=${encodedTitle}+${encodeURIComponent(platformName)}+watch+online`
  }
}

export function getPlatformIcon(platformName: string): string {
  switch (platformName.toLowerCase()) {
    case 'netflix':
      return '🎬'
    case 'amazon prime video':
    case 'prime video':
      return '📺'
    case 'disney+':
    case 'disney plus':
      return '🏰'
    case 'disney+ hotstar':
    case 'hotstar':
      return '⭐'
    case 'hbo max':
    case 'max':
      return '🎭'
    case 'apple tv+':
    case 'apple tv':
      return '🍎'
    case 'youtube':
      return '▶️'
    case 'hulu':
      return '🟢'
    case 'paramount+':
    case 'paramount plus':
      return '⛰️'
    default:
      return '📱'
  }
}
