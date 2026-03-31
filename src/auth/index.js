import { AUTH_PROVIDER } from "./config";
import * as backendAuthProvider from "./providers/backendAuthProvider";

const authProvider = AUTH_PROVIDER;
const activeAuthProvider = backendAuthProvider;

export { activeAuthProvider, authProvider };
