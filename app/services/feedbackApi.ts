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
      
      console.log('Fetching track info from:', url.toString());
      
      const response = await fetch(url.toString());
      
      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
      
      let data;
      try {
        data = await response.json();
        console.log('API Response data:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);
        throw new Error('API returned invalid JSON response');
      }
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Track not found - please check if the track ID exists');
        }
        
        // Ignore missing token error
        if (data.message?.includes('token')) {
          console.warn('Token issue detected, continuing without token');
        } else {
          throw new Error(data.message || `API error: ${response.status} ${response.statusText}`);
        }
      }
      
      if (!data) {
        throw new Error('No track data received from API');
      }
      
      if (!data.track_id || !data.title || !data.url) {
        console.error('Incomplete track data:', data);
        throw new Error('Incomplete track data received from API');
      }
      
      return {
        id: data.track_id,
        title: data.title,
        url: data.url,
        artist: data.artist || '', 
        cover_url: data.cover_url
      };
    } catch (error) {
      console.error('Error fetching track info:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to API server. Please check your internet connection.');
      }
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