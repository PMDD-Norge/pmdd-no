import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { logger, logError } from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify the webhook is from Sanity
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate all pages and layout
    revalidatePath('/', 'layout');
    revalidateTag('sanity');

    logger.info('Revalidated from Sanity webhook', {
      type: body._type,
      id: body._id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logError(error, { context: 'Revalidation webhook' });
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}