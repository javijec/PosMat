import { DATA_PROVIDER } from "./config";
import * as postgresProvider from "./providers/postgresProvider";

const dataProvider = DATA_PROVIDER;
const activeProvider = postgresProvider;

export { activeProvider, dataProvider };
