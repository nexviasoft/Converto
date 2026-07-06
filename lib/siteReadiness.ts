/**
 * Public feature switches used while the site is being reviewed for AdSense.
 *
 * Nothing is deleted: the routes, components, APIs, billing code, waitlist and
 * assets stay in the project. Set the matching environment variable to "true"
 * in Vercel when a feature is fully ready to be publicly promoted again.
 */
export const PRO_PUBLIC = process.env.NEXT_PUBLIC_ENABLE_PRO === "true";
export const SIGN_IN_PUBLIC =
  process.env.NEXT_PUBLIC_ENABLE_SIGN_IN === "true";
export const ANDROID_APP_PUBLIC =
  process.env.NEXT_PUBLIC_ENABLE_ANDROID_APP === "true";
export const WAITLIST_PUBLIC =
  process.env.NEXT_PUBLIC_ENABLE_WAITLIST === "true";
