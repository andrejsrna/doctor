const API_BASE_URL = 'https://admin.dnbdoctor.com/wp-json/mlds/v1'

export const subscriberApi = {
  async subscribe(data: { email: string; name?: string; group: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to subscribe')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  async unsubscribe(data: { email: string; token: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to unsubscribe')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }
} 