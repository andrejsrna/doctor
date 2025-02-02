const API_URL = 'https://dnbdoctor.com/wp-json/wp/v2'

export async function fetchAPI(path: string, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options
  }

  const res = await fetch(`${API_URL}${path}`, mergedOptions)
  
  if (!res.ok) {
    throw new Error('Failed to fetch API')
  }

  return res.json()
} 