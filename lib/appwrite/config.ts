export const appwriteConfig = {
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersTableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE!,
  filesTableId: process.env.NEXT_PUBLIC_APPWRITE_FILES_TABLE!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.APPWRITE_API_SECRET_KEY!,
};
