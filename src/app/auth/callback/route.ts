import { supabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${request.headers.get('origin')}/login?error=${error.message}`);
    }
  }

  return NextResponse.redirect(`${request.headers.get('origin')}${next}`);
}
