import { OTTPlatform, ottPlatforms, Movie } from '@/types/movie';

/**
 * Service to handle OTT platform related operations
 */
class OTTService {
  /**
   * Get all supported OTT platforms with their details
   */
  static getAllPlatforms() {
    return Object.entries(ottPlatforms).map(([name, details]) => ({
      name: name as OTTPlatform,
      ...details
    }));
  }

  /**
   * Get watch links for a movie
   */
  static getWatchLinks(movie: Movie) {
    return movie.streamingPlatforms.map(platform => ({
      ...platform,
      ...ottPlatforms[platform.name as OTTPlatform],
      directUrl: this.getDirectWatchLink(platform.name as OTTPlatform, platform.url, movie.id)
    }));
  }

  /**
   * Generate direct watch link for a platform
   */
  private static getDirectWatchLink(platform: OTTPlatform, url: string, movieId: string): string {
    const baseUrl = ottPlatforms[platform]?.baseUrl || '';
    
    // If URL is already a full URL, return it
    if (url.startsWith('http')) {
      return url;
    }
    
    // For YouTube, handle both full URLs and video IDs
    if (platform === 'YouTube') {
      return url.startsWith('http') ? url : `${baseUrl}${url}`;
    }
    
    // For other platforms, construct URL based on their pattern
    return `${baseUrl}${url || movieId}`;
  }

  /**
   * Get platform icon
   */
  static getPlatformIcon(platform: OTTPlatform): string {
    return ottPlatforms[platform]?.icon || '🎬';
  }

  /**
   * Get platform color
   */
  static getPlatformColor(platform: OTTPlatform): string {
    return ottPlatforms[platform]?.color || '#666666';
  }

  /**
   * Get platform by URL
   */
  static getPlatformByUrl(url: string): OTTPlatform | null {
    const platform = Object.entries(ottPlatforms).find(([_, details]) => 
      url.includes(details.baseUrl)
    );
    return platform ? platform[0] as OTTPlatform : null;
  }

  /**
   * Get the best available quality link
   */
  static getBestQualityLink(links: { quality?: string; url: string }[]) {
    const qualityOrder = ['4K', 'HDR', 'HD', 'SD'];
    for (const quality of qualityOrder) {
      const link = links.find(link => link.quality === quality);
      if (link) return link;
    }
    return links[0];
  }
}

export default OTTService;
