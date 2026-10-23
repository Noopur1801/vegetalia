const DEFAULT_API_URL = "https://vegetation-i19h.onrender.com";

function resolveApiBaseUrl(value) {
  if (!value) return DEFAULT_API_URL;
  try {
    const parsed = new URL(value.trim());
    const hasValidProtocol = parsed.protocol === "https:" || parsed.protocol === "http:";
    const hasNoPath = parsed.pathname === "/" && !parsed.search && !parsed.hash;
    const isFrontendHost = parsed.hostname === "vegetalia.onrender.com";
    if (hasValidProtocol && hasNoPath && !isFrontendHost) return parsed.origin;
  } catch {
    // Invalid environment values fall back to the configured backend URL.
  }
  return DEFAULT_API_URL;
}

export const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);
