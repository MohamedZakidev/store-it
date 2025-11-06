"use server"
import { Account, Avatars, Client, Storage, TablesDB } from "appwrite";
import { appwriteConfig } from "./config";


// SERVER-SIDE (Admin)
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setDevKey(appwriteConfig.secretDevKey);

  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
}
