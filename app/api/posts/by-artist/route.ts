import { NextResponse } from 'next/server'
import { fetchAPI } from '@/app/utils/fetch-api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const artistTag = searchParams.get('artist')

  try {
    const data = await fetchAPI(
      `/posts?tags=${artistTag}&_embed`,
      { cache: 'no-store' }
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching artist posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artist posts' },
      { status: 500 }
    )
  }
} 