const API_BASE_URL = 'https://admin.dnbdoctor.com/wp-json/mlds/v1';

interface TrackInfo {
  id: number;
  title: string;
  url: string;
  artist: string;
  cover_url?: string;
}

interface FeedbackData {
  track_id: number;
  token?: string;
  rating: number;
  feedback: string;
  name: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: object;
}

export const feedbackApi = {
  // Get track information
  async getTrackInfo(trackId: number, token?: string): Promise<TrackInfo> {
    try {
      const url = new URL(`${API_BASE_URL}/track-info`);
      url.searchParams.append('track_id', trackId.toString());
      if (token) {
        url.searchParams.append('token', token);
      }
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Track not found');
        }
        
        // Ignore missing token error
        if (data.message?.includes('token')) {
          // Continue without token
        } else {
          throw new Error(data.message || 'Failed to get track information');
        }
      }
      
      if (!data) {
        throw new Error('No track data received');
      }
      
      return {
        id: data.track_id,
        title: data.title,
        url: data.url,
        artist: data.artist || '', // fallback ak API nevracia artist
        cover_url: data.cover_url
      };
    } catch (error) {
      console.error('Error fetching track info:', error);
      throw error instanceof Error ? error : new Error('Failed to get track information');
    }
  },

  // Submit feedback
  async submitFeedback(data: FeedbackData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit feedback');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback. Please try again later.');
    }
  }
}; 