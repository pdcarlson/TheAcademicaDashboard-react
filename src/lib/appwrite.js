import { Client, Account, Databases } from "appwrite";

// configuration
const VITE_APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const VITE_APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const VITE_APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const VITE_COURSES_COLLECTION_ID = import.meta.env.VITE_COURSES_COLLECTION_ID;
export const VITE_ASSIGNMENTS_COLLECTION_ID = import.meta.env.VITE_ASSIGNMENTS_COLLECTION_ID;
export const VITE_TIME_SESSIONS_COLLECTION_ID = import.meta.env.VITE_TIME_SESSIONS_COLLECTION_ID;


const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };