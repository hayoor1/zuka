import { NextResponse } from 'next/server';
import { getServerUserId } from '../../../../lib/user-id';

/**
 * GET /api/user/id
 * 
 * Returns the current user's ID.
 * Creates one if it doesn't exist.
 * 
 * Used by client-side code to get the user ID.
 */
export async function GET() {
  try {
    const userId = await getServerUserId();
    
    return NextResponse.json({
      userId,
      success: true,
    });
  } catch (error) {
    console.error('Failed to get user ID:', error);
    return NextResponse.json(
      { error: 'Failed to get user ID' },
      { status: 500 }
    );
  }
}

