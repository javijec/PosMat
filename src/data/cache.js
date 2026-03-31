const collectionCache = new Map();
const pendingRequests = new Map();

const getCachedCollection = (collectionName) => collectionCache.get(collectionName);
const hasCachedCollection = (collectionName) => collectionCache.has(collectionName);
const setCachedCollection = (collectionName, data) => {
  collectionCache.set(collectionName, data);
};

const getPendingRequest = (collectionName) => pendingRequests.get(collectionName);
const hasPendingRequest = (collectionName) => pendingRequests.has(collectionName);
const setPendingRequest = (collectionName, request) => {
  pendingRequests.set(collectionName, request);
};
const clearPendingRequest = (collectionName) => {
  pendingRequests.delete(collectionName);
};

const clearCollectionCache = (collectionName) => {
  collectionCache.delete(collectionName);
  pendingRequests.delete(collectionName);
};

const clearAllDataCache = () => {
  collectionCache.clear();
  pendingRequests.clear();
};

export {
  clearAllDataCache,
  clearCollectionCache,
  clearPendingRequest,
  getCachedCollection,
  getPendingRequest,
  hasCachedCollection,
  hasPendingRequest,
  setCachedCollection,
  setPendingRequest,
};
