import { API_BASE_URL } from "../config";

const ensureApiBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL no está configurado para usar el proveedor postgres"
    );
  }
};

const buildCollectionUrl = (collectionName, id = "") => {
  ensureApiBaseUrl();
  return `${API_BASE_URL}/content/${encodeURIComponent(collectionName)}${
    id ? `/${encodeURIComponent(id)}` : ""
  }`;
};

const readJsonResponse = async (response) => {
  const data =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

const fetchCollection = async (collectionName) => {
  const response = await fetch(buildCollectionUrl(collectionName), {
    credentials: "include",
  });

  return (await readJsonResponse(response)) ?? [];
};

const getDocument = async (collectionName, id) => {
  const response = await fetch(buildCollectionUrl(collectionName, id), {
    credentials: "include",
  });

  return await readJsonResponse(response);
};

const saveDocument = async (collectionName, id, data) => {
  const response = await fetch(buildCollectionUrl(collectionName, id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  await readJsonResponse(response);
  return true;
};

const addDocument = async (collectionName, data) => {
  const response = await fetch(buildCollectionUrl(collectionName), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const createdItem = await readJsonResponse(response);
  return createdItem?.id ?? null;
};

const deleteDocument = async (collectionName, id) => {
  const response = await fetch(buildCollectionUrl(collectionName, id), {
    method: "DELETE",
    credentials: "include",
  });

  await readJsonResponse(response);
  return true;
};

export {
  addDocument,
  deleteDocument,
  fetchCollection,
  getDocument,
  saveDocument,
};
