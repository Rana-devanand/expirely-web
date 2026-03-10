const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const CONFIG = {
  API_URL: `${BASE_URL}/api`,
  TIMEOUT: 10000,
};
