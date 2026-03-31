import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/dbConnection";

const fetchCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

const getDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

const saveDocument = async (collectionName, id, data) => {
  await setDoc(doc(db, collectionName, id), data, { merge: true });
  return true;
};

const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

const deleteDocument = async (collectionName, id) => {
  await deleteDoc(doc(db, collectionName, id));
  return true;
};

export {
  addDocument,
  deleteDocument,
  fetchCollection,
  getDocument,
  saveDocument,
};
