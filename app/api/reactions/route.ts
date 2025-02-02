import { NextResponse } from 'next/server'

const API_BASE_URL = 'https://admin.dnbdoctor.com/wp-json/mlds/v1'

interface ReactionResponse {
  likes: number
  dislikes: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')

  if (!postId) {
    return NextResponse.json({ error: 'Missing postId parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/reactions?postId=${postId}`,
      { next: { revalidate: 60 } }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch reactions')
    }
    
    const data: ReactionResponse = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { postId, reactionType } = body

  if (!postId || !reactionType) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: postId,
        reaction_type: reactionType
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update reaction')
    }

    const data: ReactionResponse = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating reaction:', error)
    return NextResponse.json(
      { error: 'Failed to update reaction' }, 
      { status: 500 }
    )
  }
} 