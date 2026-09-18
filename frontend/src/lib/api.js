/* Use the same origin locally so phones and tablets can reach the API through Vite. */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);
