import fs from "node:fs";
import path from "node:path";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envPath)) {
  const rawEnv = fs.readFileSync(envPath, "utf8");

  for (const line of rawEnv.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const apiBaseUrl = process.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const firebaseConfig = {
  apiKey: process.env.VITE_APIKEY,
  authDomain: process.env.VITE_AUTHDOMAIN,
  projectId: process.env.VITE_PROJECTID,
  storageBucket: process.env.VITE_STOREGEBUCKET,
  messagingSenderId: process.env.VITE_MESSAGINGSENDERID,
  appId: process.env.VITE_APPID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

const fetchFirebaseCollection = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const importGenericCollection = async (collectionName) => {
  const currentResponse = await fetch(
    `${apiBaseUrl}/content/${encodeURIComponent(collectionName)}`
  );
  const currentItems = await readJsonResponse(currentResponse);

  if (Array.isArray(currentItems) && currentItems.length > 0) {
    console.log(`${collectionName}: skipped (${currentItems.length} items already exist)`);
    return 0;
  }

  const firebaseItems = await fetchFirebaseCollection(collectionName);

  for (const item of firebaseItems) {
    const { id, ...data } = item;
    const response = await fetch(
      `${apiBaseUrl}/content/${encodeURIComponent(collectionName)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    await readJsonResponse(response);
  }

  console.log(`${collectionName}: imported ${firebaseItems.length} items`);
  return firebaseItems.length;
};

const importAuthorizedEmails = async () => {
  const firebaseItems = await fetchFirebaseCollection("authorizedEmails");
  const currentResponse = await fetch(`${apiBaseUrl}/authorized-emails`);
  const currentItems = await readJsonResponse(currentResponse);
  const existingEmails = new Set(
    currentItems
      .map((item) => item.email?.trim().toLowerCase())
      .filter(Boolean)
  );

  let imported = 0;

  for (const item of firebaseItems) {
    const email = item.email?.trim().toLowerCase();

    if (!email || existingEmails.has(email)) {
      continue;
    }

    const response = await fetch(`${apiBaseUrl}/authorized-emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    await readJsonResponse(response);
    imported += 1;
    existingEmails.add(email);
  }

  console.log(`authorizedEmails: imported ${imported} new emails`);
  return imported;
};

async function main() {
  const collections = ["about", "contacto", "Home"];
  let importedTotal = 0;

  for (const collectionName of collections) {
    importedTotal += await importGenericCollection(collectionName);
  }

  importedTotal += await importAuthorizedEmails();

  console.log(`Firestore import finished. ${importedTotal} items migrated.`);
}

main().catch((error) => {
  console.error("Firestore import failed:", error);
  process.exit(1);
});
