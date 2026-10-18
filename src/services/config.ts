const ENV_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function resolveBaseUrl(): string {
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    const isLocal = hostname === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
    // Local development: the web page and the backend run on the same machine.
    if (isLocal) return `${protocol}//${hostname}:5000`;
  }
  return ENV_BASE_URL;
}

export const CONFIG = {
  // A getter, so it is evaluated in the browser at call time.
  get API_URL() {
    return `${resolveBaseUrl()}/api`;
  },
  TIMEOUT: 10000,
};
