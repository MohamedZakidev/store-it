"use client";
import { Account, Client, TablesDB } from "appwrite";
import { appwriteConfig } from "./config";

// CLIENT-SIDE SDK (browser)
export const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
// console.log({ account })
export const tablesDB = new TablesDB(client);