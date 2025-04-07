import { Client, Account, Databases } from 'appwrite';

// Check if environment variables are set
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error(
    'Missing Appwrite environment variables: NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID'
  );
}

// Database and collection IDs
export const DATABASES_ID = '67ef94ce00302fe66895';
export const CONTENT_COLLECTION_ID = '67ef94e80005b889897a';
export const USER_PROFILES_COLLECTION_ID = '67ef9774000e4d09d47a';
export const SAVED_CONTENT_COLLECTION_ID = '67f38ed9002317506cff';

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export default client;
