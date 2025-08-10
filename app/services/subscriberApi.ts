export const subscriberApi = {
  async subscribe(data: { email: string; name?: string; group?: string; source?: string }) {
    try {
      const email = (data.email || '').toLowerCase().trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!isValidEmail.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      const payload = { ...data, email };
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to subscribe')
      }

      const result = await response.json()
      return result
    } catch (error) {
      throw error
    }
  },

  async unsubscribe(data: { email: string; token?: string }) {
    try {
      console.log('🔍 Unsubscribing via Prisma API:', data);
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('📡 Unsubscribe response status:', response.status);

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Unsubscribe error:', error);
        throw new Error(error.error || 'Failed to unsubscribe')
      }

      const result = await response.json()
      console.log('✅ Unsubscribe success:', result);
      return result
    } catch (error) {
      console.error('💥 Unsubscribe exception:', error);
      throw error
    }
  }
} 