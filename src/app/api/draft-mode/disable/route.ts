import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const draft = await draftMode();
    draft.disable();
    
    // Get the redirect URL from query params or default to home
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
    const url = new URL(redirectTo, request.url);
    
    const response = NextResponse.redirect(url);
    
    // Ensure draft mode cookie is cleared
    response.cookies.delete("__prerender_bypass");
    response.cookies.delete("__next_preview_data");
    
    return response;
  } catch (error) {
    console.error("Error disabling draft mode:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
