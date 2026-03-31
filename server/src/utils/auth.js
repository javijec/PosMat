import jwt from "jsonwebtoken";

const AUTH_COOKIE_NAME = "posmat_token";
const TOKEN_SECRET = process.env.JWT_SECRET || "posmat-dev-secret-change-me";
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

const signAuthToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

const verifyAuthToken = (token) => jwt.verify(token, TOKEN_SECRET);

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (req.cookies?.[AUTH_COOKIE_NAME]) {
    return req.cookies[AUTH_COOKIE_NAME];
  }

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
};

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
};

export {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  getTokenFromRequest,
  sanitizeUser,
  setAuthCookie,
  signAuthToken,
  verifyAuthToken,
};
