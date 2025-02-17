import { getDocs, getDoc, collection, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "./dbConnection";

const fetchData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
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
    return true;
  } catch (error) {
    console.error(`Error saving item to ${collectionName}:`, error);
    return false;
  }
};

const addItem = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding item to ${collectionName}:`, error);
    return null;
  }
};

const deleteItem = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error(`Error deleting item from ${collectionName}:`, error);
    return false;
  }
};

export { fetchData, getItem, saveItem, addItem, deleteItem };
