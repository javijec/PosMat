import {
  clearAllDataCache,
  clearCollectionCache,
  clearPendingRequest,
  getCachedCollection,
  getPendingRequest,
  hasCachedCollection,
  hasPendingRequest,
  setCachedCollection,
  setPendingRequest,
} from "./cache";
import { activeProvider, dataProvider } from "./repository";

const fetchData = async (collectionName, options = {}) => {
  const { force = false } = options;

  if (!force && hasCachedCollection(collectionName)) {
    return getCachedCollection(collectionName);
  }

  if (!force && hasPendingRequest(collectionName)) {
    return getPendingRequest(collectionName);
  }

  const request = (async () => {
    try {
      const data = await activeProvider.fetchCollection(collectionName);
      setCachedCollection(collectionName, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    } finally {
      clearPendingRequest(collectionName);
    }
  })();

  setPendingRequest(collectionName, request);
  return request;
};

const getItem = async (collectionName, id) => {
  try {
    return await activeProvider.getDocument(collectionName, id);
  } catch (error) {
    console.error(`Error getting item from ${collectionName}:`, error);
    return null;
  }
};

const saveItem = async (collectionName, id, data) => {
  try {
    await activeProvider.saveDocument(collectionName, id, data);
    clearCollectionCache(collectionName);
    return true;
  } catch (error) {
    console.error(`Error saving item to ${collectionName}:`, error);
    return false;
  }
};

const addItem = async (collectionName, data) => {
  try {
    const id = await activeProvider.addDocument(collectionName, data);
    clearCollectionCache(collectionName);
    return id;
  } catch (error) {
    console.error(`Error adding item to ${collectionName}:`, error);
    return null;
  }
};

const deleteItem = async (collectionName, id) => {
  try {
    await activeProvider.deleteDocument(collectionName, id);
    clearCollectionCache(collectionName);
    return true;
  } catch (error) {
    console.error(`Error deleting item from ${collectionName}:`, error);
    return false;
  }
};

export {
  addItem,
  clearAllDataCache,
  dataProvider,
  deleteItem,
  fetchData,
  getItem,
  saveItem,
};
