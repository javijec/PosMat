import { AUTH_PROVIDER } from "./config";
import * as backendAuthProvider from "./providers/backendAuthProvider";
import * as firebaseAuthProvider from "./providers/firebaseAuthProvider";

const providerMap = {
  backend: backendAuthProvider,
  firebase: firebaseAuthProvider,
};

const authProvider = providerMap[AUTH_PROVIDER] ? AUTH_PROVIDER : "backend";
const activeAuthProvider = providerMap[authProvider];

export { activeAuthProvider, authProvider };
