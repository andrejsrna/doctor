import { NextRequest } from "next/server";

/**
 * Validates origin for admin endpoints
 * Since admin endpoints are protected by authentication, we can be more permissive
 * This function logs origin mismatches but doesn't block requests
 */
export function validateAdminOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  
  // Only validate origin if it's present and different from request origin
  // This allows for cases where origin header might be missing (e.g., same-origin requests)
  if (origin && origin !== requestOrigin) {
    // Log the mismatch for debugging but don't block the request
    console.warn(`Origin mismatch (but allowing): ${origin} vs ${requestOrigin}`);
  }
}

/**
 * Validates origin for admin endpoints with more permissive logic
 * Handles edge cases like missing origin headers and development environments
 */
export function validateAdminOriginPermissive(request: NextRequest): void {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  
  // If no origin header is present, it's likely a same-origin request (allow it)
  if (!origin) {
    console.log(`No origin header present, allowing request from ${requestOrigin}`);
    return;
  }
  
  // If origins match, allow the request
  if (origin === requestOrigin) {
    return;
  }
  
  // For development environments, be more permissive
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = origin.includes('localhost') || requestOrigin.includes('localhost');
  
  if (isDevelopment && isLocalhost) {
    console.log(`Development localhost origin mismatch (allowing): ${origin} vs ${requestOrigin}`);
    return;
  }
  
  // Log other mismatches for debugging but don't block
  console.warn(`Origin mismatch (but allowing): ${origin} vs ${requestOrigin}`);
}
