import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Webhook handler for Sanity to trigger ISR
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook secret (optional but recommended)
    // Skip in development mode for easier testing
    if (process.env.NODE_ENV === 'production') {
      const secret = request.headers.get('sanity-webhook-secret')
      if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Determine what to revalidate based on document type
    const { _type, _id } = body
    
    switch (_type) {
      case 'page':
        revalidateTag('pages')
        break
      case 'information':
        revalidateTag('information')
        break
      case 'post':
        revalidateTag('posts')
        break
      case 'brandAssets':
        revalidateTag('brandAssets')
        break
      case 'navigation':
        revalidateTag('navigation')
        break
      case 'socialMediaProfiles':
        revalidateTag('socialMedia')
        break
      case 'event':
        revalidateTag('events')
        break
      default:
        // Revalidate all for unknown types
        revalidateTag('sanity')
    }

    console.log(`ISR: Revalidated ${_type} document: ${_id}`)
    
    return NextResponse.json({ 
      revalidated: true, 
      type: _type,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('ISR revalidation error:', error)
    return NextResponse.json({ 
      error: 'Failed to revalidate' 
    }, { status: 500 })
  }
}