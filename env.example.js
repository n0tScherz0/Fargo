/**
 * FARGO — Environment Configuration Template
 *
 * Copy this file to env.js and fill in your Supabase credentials.
 * env.js is gitignored and must NEVER be committed.
 *
 * On Netlify: set SUPABASE_URL and SUPABASE_ANON_KEY as environment variables,
 * then add a build command that generates env.js:
 *
 *   echo "window.__FARGO_ENV__ = { SUPABASE_URL: '${SUPABASE_URL}', SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY}' };" > env.js
 *
 * netlify.toml example:
 *   [build]
 *     command = "echo \"window.__FARGO_ENV__ = { SUPABASE_URL: '$SUPABASE_URL', SUPABASE_ANON_KEY: '$SUPABASE_ANON_KEY' };\" > env.js"
 *     publish = "."
 */

window.__FARGO_ENV__ = {
  SUPABASE_URL:      "https://YOUR_PROJECT_ID.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ANON_KEY"
};
