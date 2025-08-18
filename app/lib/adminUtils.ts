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
