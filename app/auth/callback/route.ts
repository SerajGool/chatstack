import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  // Get the tokens from the URL
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');
  
  if (access_token && refresh_token) {
    // Set the session with the tokens
    await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
  }

  // Redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', origin));
}