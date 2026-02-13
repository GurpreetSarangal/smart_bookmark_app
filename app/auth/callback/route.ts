import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    // Exchange the OAuth code for a Supabase session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to a protected page after successful login
  return NextResponse.redirect(new URL("/protected", request.url));
}
