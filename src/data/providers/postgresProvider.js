import { API_BASE_URL } from "../config";

const ensureApiBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL no está configurado para usar el proveedor postgres"
    );
  }
};

const routeMap = {
  authorizedEmails: "authorized-emails",
  courses: "courses",
};

const buildCollectionUrl = (collectionName, id = "") => {
  ensureApiBaseUrl();

  const mappedRoute = routeMap[collectionName];
  const basePath = mappedRoute
    ? `${API_BASE_URL}/${mappedRoute}`
    : `${API_BASE_URL}/content/${encodeURIComponent(collectionName)}`;

  return `${basePath}${id ? `/${encodeURIComponent(id)}` : ""}`;
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

const uploadTesisPdf = async (file, tesisId) => {
  ensureApiBaseUrl();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tesisId", tesisId);

  const response = await fetch(`${API_BASE_URL}/uploads/tesis`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await readJsonResponse(response);
};

const deleteTesisPdf = async (url) => {
  let fileName;
  try {
    fileName = new URL(url).pathname.match(/\/api\/uploads\/tesis\/(tesis-[a-zA-Z0-9-]+\.pdf)$/)?.[1];
  } catch {
    return false;
  }
  if (!fileName) return false;

  const response = await fetch(`${API_BASE_URL}/uploads/tesis/${encodeURIComponent(fileName)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.status === 404) return false;
  await readJsonResponse(response);
  return true;
};

const uploadResourceFile = async (file) => {
  ensureApiBaseUrl();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/uploads/resources`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await readJsonResponse(response);
};

const deleteResourceFile = async (url) => {
  let fileName;
  try {
    fileName = new URL(url).pathname.match(/\/api\/uploads\/resources\/(resource-[a-zA-Z0-9-]+\.[a-z0-9]+)$/i)?.[1];
  } catch {
    return false;
  }
  if (!fileName) return false;

  const response = await fetch(`${API_BASE_URL}/uploads/resources/${encodeURIComponent(fileName)}`, {
    method: "DELETE",
    credentials: "include",
  });

  await readJsonResponse(response);
  return true;
};

export {
  addDocument,
  deleteTesisPdf,
  deleteResourceFile,
  deleteDocument,
  fetchCollection,
  getDocument,
  saveDocument,
  uploadTesisPdf,
  uploadResourceFile,
};
