const DATA_PROVIDER = (
  import.meta.env.VITE_DATA_PROVIDER || "postgres"
).toLowerCase();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

export { API_BASE_URL, DATA_PROVIDER };
