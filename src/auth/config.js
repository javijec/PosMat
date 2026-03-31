const AUTH_PROVIDER = (
  import.meta.env.VITE_AUTH_PROVIDER ||
  import.meta.env.VITE_DATA_PROVIDER ||
  "backend"
).toLowerCase();

export { AUTH_PROVIDER };
