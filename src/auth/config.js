const AUTH_PROVIDER = (
  import.meta.env.VITE_AUTH_PROVIDER ||
  import.meta.env.VITE_DATA_PROVIDER ||
  "firebase"
).toLowerCase();

export { AUTH_PROVIDER };
