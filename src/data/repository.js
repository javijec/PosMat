import { DATA_PROVIDER } from "./config";
import * as firebaseProvider from "./providers/firebaseProvider";
import * as postgresProvider from "./providers/postgresProvider";

const providerMap = {
  firebase: firebaseProvider,
  postgres: postgresProvider,
};

const dataProvider = providerMap[DATA_PROVIDER] ? DATA_PROVIDER : "postgres";
const activeProvider = providerMap[dataProvider];

export { activeProvider, dataProvider };
