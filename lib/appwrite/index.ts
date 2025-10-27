import { Account, Client, Databases } from "appwrite";
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
    get databases() {
      return new Databases(client);
    },
  };
}

export function createAdminClient() {
  return 0;
}
