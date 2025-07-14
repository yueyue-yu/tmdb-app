import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';

    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}&language=zh-CN`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top rated movies' },
      { status: 500 }
    );
  }
}
