import { Client, Account } from 'appwrite';

// Check if environment variables are set
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error(
    'Missing Appwrite environment variables: NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID'
  );
}

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);

// You can export other services here as needed, e.g.:
// import { Databases } from 'appwrite';
// export const databases = new Databases(client);

export default client;
