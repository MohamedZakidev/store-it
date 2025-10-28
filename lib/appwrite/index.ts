"use server";

import { Account, Avatars, Client, Storage, TablesDB } from "appwrite";
import { cookies } from "next/headers";
import { appwriteConfig } from "./config";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite_session");

  if (!session || !session.value) throw new Error("No session found");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setDevKey(appwriteConfig.secretKey);

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
