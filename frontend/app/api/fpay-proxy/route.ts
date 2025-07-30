import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, data } = body;

    console.log('Fpay proxy - URL:', url);
    console.log('Fpay proxy - Data:', data);

    // Forward the request to Fpay
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...request.headers,
      },
      body: data, // Send the raw data as-is
    });

    const responseData = await response.json();
    console.log('Fpay proxy - Response:', responseData);

    return NextResponse.json(responseData, {
      status: response.status,
    });
  } catch (error) {
    console.error('Fpay proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Fpay', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Forward the request to Fpay
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...request.headers,
      },
    });

    const responseData = await response.json();

    return NextResponse.json(responseData, {
      status: response.status,
    });
  } catch (error) {
    console.error('Fpay proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Fpay' },
      { status: 500 }
    );
  }
} 