import { getDocs, getDoc, collection, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "./dbConnection";

const collectionCache = new Map();
const pendingRequests = new Map();

const invalidateCollectionCache = (collectionName) => {
  collectionCache.delete(collectionName);
  pendingRequests.delete(collectionName);
};

const fetchData = async (collectionName, options = {}) => {
  const { force = false } = options;

  if (!force && collectionCache.has(collectionName)) {
    return collectionCache.get(collectionName);
  }

  if (!force && pendingRequests.has(collectionName)) {
    return pendingRequests.get(collectionName);
  }

  const request = (async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      collectionCache.set(collectionName, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    } finally {
      pendingRequests.delete(collectionName);
    }
  })();

  pendingRequests.set(collectionName, request);
  return request;
};

const getItem = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error(`Error getting item from ${collectionName}:`, error);
  }
};

const saveItem = async (collectionName, id, data) => {
  try {
    await setDoc(doc(db, collectionName, id), data, { merge: true });
    invalidateCollectionCache(collectionName);
    return true;
  } catch (error) {
    console.error(`Error saving item to ${collectionName}:`, error);
    return false;
  }
};

const addItem = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    invalidateCollectionCache(collectionName);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding item to ${collectionName}:`, error);
    return null;
  }
};

const deleteItem = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    invalidateCollectionCache(collectionName);
    return true;
  } catch (error) {
    console.error(`Error deleting item from ${collectionName}:`, error);
    return false;
  }
};

export { fetchData, getItem, saveItem, addItem, deleteItem };
