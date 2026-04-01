import { API_BASE_URL } from "../../data/config";

const AUTH_CACHE_KEY = "posmat_auth_user";

const ensureApiBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL no está configurado para usar auth en backend"
    );
  }
};

const buildAuthUrl = (path = "") => {
  ensureApiBaseUrl();
  return `${API_BASE_URL}/auth${path}`;
};

const readJsonResponse = async (response) => {
  const data =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role || "admin",
    provider: "backend",
  };
};

const persistUser = (user) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.sessionStorage.removeItem(AUTH_CACHE_KEY);
    return;
  }

  window.sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
};

const getPersistedUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(AUTH_CACHE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(raw));
  } catch {
    window.sessionStorage.removeItem(AUTH_CACHE_KEY);
    return null;
  }
};

const getCurrentUser = async () => {
  const response = await fetch(buildAuthUrl("/me"), {
    credentials: "include",
  });

  if (response.status === 401) {
    persistUser(null);
    return null;
  }

  const user = normalizeUser(await readJsonResponse(response));
  persistUser(user);
  return user;
};

const observeAuthState = (callback) => {
  let active = true;
  const persistedUser = getPersistedUser();

  if (persistedUser) {
    callback(persistedUser);
  }

  getCurrentUser()
    .then((user) => {
      if (active) {
        callback(user);
      }
    })
    .catch((error) => {
      console.warn("Transient auth check failure:", error);

      if (active && !persistedUser) {
        callback(null);
      }
    });

  return () => {
    active = false;
  };
};

const signIn = async (email, password) => {
  const response = await fetch(buildAuthUrl("/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const user = normalizeUser(await readJsonResponse(response));
  persistUser(user);
  return user;
};

const signUp = async (email, password) => {
  const response = await fetch(buildAuthUrl("/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const user = normalizeUser(await readJsonResponse(response));
  persistUser(user);
  return user;
};

const logout = async () => {
  try {
    const response = await fetch(buildAuthUrl("/logout"), {
      method: "POST",
      credentials: "include",
    });

    if (response.status !== 204) {
      await readJsonResponse(response);
    }
  } catch (error) {
    console.error("Error logging out from backend auth:", error);
  }

  persistUser(null);

  return true;
};

export {
  getCurrentUser,
  getPersistedUser,
  logout,
  observeAuthState,
  signIn,
  signUp,
};
