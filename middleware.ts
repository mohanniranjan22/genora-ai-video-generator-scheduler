import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { updateSession } from '@/utils/supabase/middleware'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/inngest(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
      await auth.protect()
  }
  // Run Supabase middleware to refresh session if necessary
  return await updateSession(req)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
