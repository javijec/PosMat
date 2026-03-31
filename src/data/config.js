const DATA_PROVIDER = "postgres";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

export { API_BASE_URL, DATA_PROVIDER };
