/**
 * FARGO — SUPABASE CLIENT
 * Single reusable client for lightweight case persistence.
 * Credentials come from window.__FARGO_ENV__ (set by env.js — never commit real values).
 * Dead Internet Theory
 */

const FargoSupabase = (() => {
  // ------------------------------------------------------------------
  // Resolve credentials from the env shim.
  // env.js sets window.__FARGO_ENV__ = { SUPABASE_URL, SUPABASE_ANON_KEY }
  // On Netlify, the build step generates env.js from environment variables.
  // ------------------------------------------------------------------
  const env = (typeof window !== 'undefined' && window.__FARGO_ENV__) || {};
  const SUPABASE_URL     = env.SUPABASE_URL     || '';
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || '';

  let _client = null;

  /**
   * Returns the singleton Supabase client, or null if credentials are missing.
   */
  function getClient() {
    if (_client) return _client;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

    // supabase-js is loaded via CDN <script> tag — exposes window.supabase
    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
      return null;
    }

    try {
      _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('[Fargo] Supabase client init failed:', e);
      _client = null;
    }
    return _client;
  }

  /**
   * Save a completed forensic analysis case to the `analyses` table.
   *
   * @param {Object} pkg        - Complete DIT-FORENSICS-2.0 JSON object
   * @param {Object} fileInfo   - Staged file metadata { name, size, mime_type, ... }
   * @param {string} mediaType  - 'image' | 'video' | 'audio'
   * @returns {Object|null}     - The inserted row, or null on failure
   */
  async function saveCase(pkg, fileInfo, mediaType) {
    const client = getClient();
    if (!client || !pkg) return null;

    const row = {
      filename:      fileInfo?.name     || pkg?.media?.filename      || 'unknown',
      media_type:    mediaType          || pkg?.media_type           || 'image',
      file_size:     fileInfo?.size     || pkg?.media?.file_size_bytes || 0,
      mime_type:     fileInfo?.mime_type || pkg?.media?.mime_type    || '',
      verdict:       pkg?.overall_assessment?.verdict                || '',
      confidence:    pkg?.overall_assessment?.confidence_score       || 0,
      risk_level:    pkg?.overall_assessment?.risk_level             || '',
      analysis_json: pkg,
      report_status: 'finalized'
    };

    try {
      const { data, error } = await client
        .from('analyses')
        .insert([row])
        .select()
        .single();

      if (error) {
        console.warn('[Fargo] DB insert failed:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('[Fargo] DB save error:', e);
      return null;
    }
  }

  /**
   * Fetch recent analyses from the `analyses` table.
   *
   * @param {number} limit - Max rows to return (default 50)
   * @returns {Array}      - Array of row objects, or [] on failure
   */
  async function fetchCases(limit = 50) {
    const client = getClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('analyses')
        .select('id, created_at, filename, media_type, file_size, mime_type, verdict, confidence, risk_level, analysis_json, report_status')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('[Fargo] DB fetch failed:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('[Fargo] DB fetch error:', e);
      return [];
    }
  }

  /**
   * Returns true only if credentials are configured (does not test connectivity).
   */
  function isConfigured() {
    return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  }

  return { saveCase, fetchCases, isConfigured, getClient };
})();
