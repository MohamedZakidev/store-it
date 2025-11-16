"use server";

import { RenameFileParams, uploadFileParams } from "@/types";
import { revalidatePath } from "next/cache";
import { ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { constructFileUrl, getFileType } from "../utils";
import { getAuthenticatedUser } from "./user.actions";

function handleError(error: unknown, message: string) {
  console.log(error, message);
  throw error;
}

export async function uploadFile({
  file,
  ownerId,
  accountId,
  path,
}: uploadFileParams) {
  const { storage, tablesDB } = await createAdminClient();
  const inputFile = InputFile.fromBuffer(file, file.name);

  try {
    const bucketFile = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: inputFile,
    });

    const fileRow = {
      name: bucketFile.name,
      size: bucketFile.sizeOriginal,
      url: constructFileUrl(bucketFile.$id),
      type: getFileType(bucketFile.name).type,
      extension: getFileType(bucketFile.name).extension,
      owner: ownerId,
      accountId: accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const createdFileRow = await tablesDB
      .createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.filesTableId,
        rowId: ID.unique(),
        data: fileRow,
      })
      .catch(async (error) => {
        await storage.deleteFile({
          bucketId: appwriteConfig.bucketId,
          fileId: bucketFile.$id,
        });
        handleError(error, "Failed to create file row");
      });
    revalidatePath(path);
    return createdFileRow;
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
}

function createQueries(user: Models.DefaultRow) {
  const queries = [
    Query.or([
      Query.equal("owner", [user.$id]),
      Query.contains("users", [user.email]),
    ]),
    Query.select(["*", "owner.*"]),
  ];
  return queries;
}

export async function getFiles() {
  const { tablesDB } = await createAdminClient();

  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) {
    throw new Error("User not authenticated");
  }

  const queries = createQueries(authenticatedUser);
  try {
    const files = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      queries: queries,
    });
    return files;
  } catch (error) {
    handleError(error, "Failed to get files");
  }
}

export async function renameFile({
  fileId,
  newName,
  extentstion,
  path,
}: RenameFileParams) {
  const { tablesDB } = await createAdminClient();
  try {
    const updatedFile = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      rowId: fileId,
      data: { name: `${newName}.${extentstion}` },
    });
    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
}
