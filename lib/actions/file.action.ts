"use server";

import {
  DeleteFileParams,
  getFilesParams,
  RenameFileParams,
  UpdateSharedUsersFileParams,
  UploadFileParams,
} from "@/types";
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
}: UploadFileParams) {
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
        handleError(error, "Failed to create file row in tablesDB");
      });
    revalidatePath(path);
    return createdFileRow;
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
}

function createQueries(
  user: Models.DefaultRow,
  types: string[],
  sort: string | undefined,
  limit: number | undefined
) {
  const queries = [
    Query.or([
      Query.equal("owner", [user.$id]),
      Query.contains("users", [user.email]),
    ]),
    Query.select(["*", "owner.*"]),
  ];
  if (types.length > 0) {
    queries.push(Query.equal("type", types));
  }
  // if (searchQuery) queries.push(Query.contains("name", searchQuery));
  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    const sortQuery =
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy);
    queries.push(sortQuery);
  }
  return queries;
}

export async function getFiles({ types = [], sort, limit }: getFilesParams) {
  const { tablesDB } = await createAdminClient();

  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const queries = createQueries(user, types, sort, limit);
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

export async function getSearchResultsAction({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const { tablesDB } = await createAdminClient();

  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const queries = [
    Query.or([
      Query.equal("owner", [user.$id]),
      Query.contains("users", [user.email]),
    ]),
    Query.contains("name", searchQuery),
  ];

  try {
    const files = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      queries: queries,
    });
    return files;
  } catch (error) {
    handleError(error, "Failed to get search results");
  }
}

export async function renameFile({
  fileId,
  bucketFileId,
  newName,
  extentstion,
  path,
}: RenameFileParams) {
  const { tablesDB, storage } = await createAdminClient();
  const newFileName = `${newName}.${extentstion}`;
  try {
    const updatedFile = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      rowId: fileId,
      data: { name: newFileName },
    });

    if (updatedFile) {
      await storage.updateFile({
        bucketId: appwriteConfig.bucketId,
        fileId: bucketFileId,
        name: newFileName,
      });
    }

    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
}

export async function updateSharedUsersFile({
  fileId,
  emails,
  path,
}: UpdateSharedUsersFileParams) {
  const { tablesDB } = await createAdminClient();
  try {
    const updatedFile = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      rowId: fileId,
      data: { users: emails },
    });
    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    handleError(error, "Failed to update shared users");
  }
}

export async function deleteFile({
  fileId,
  bucketFileId,
  path,
}: DeleteFileParams) {
  const { storage, tablesDB } = await createAdminClient();
  try {
    const deleteFileRow = await tablesDB.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      rowId: fileId,
    });

    if (deleteFileRow) {
      await storage
        .deleteFile({
          bucketId: appwriteConfig.bucketId,
          fileId: bucketFileId,
        })
        .catch((error) => {
          handleError(error, "Failed to delete file from storage");
        });
    }

    revalidatePath(path);
    return { status: "success" };
  } catch (error) {
    handleError(error, "Failed to delete file row");
  }
}
