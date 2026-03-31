import { API_BASE_URL } from "../../data/config";

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

const getCurrentUser = async () => {
  try {
    const response = await fetch(buildAuthUrl("/me"), {
      credentials: "include",
    });

    if (response.status === 401) {
      return null;
    }

    return normalizeUser(await readJsonResponse(response));
  } catch (error) {
    return null;
  }
};

const observeAuthState = (callback) => {
  let active = true;

  getCurrentUser().then((user) => {
    if (active) {
      callback(user);
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

  return normalizeUser(await readJsonResponse(response));
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

  return normalizeUser(await readJsonResponse(response));
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

  return true;
};

export { getCurrentUser, logout, observeAuthState, signIn, signUp };
