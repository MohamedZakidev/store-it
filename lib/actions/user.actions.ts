"use server";

import { createAccountParams, verifyEmailOtpParams } from "@/types";
import { ID, Query } from "appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

// helper functions

function handleError(error: unknown, message: string) {
  console.log(error, message);
  throw error;
}

export async function getUserByEmail(email: string) {
  const { tablesDB } = await createAdminClient();
  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries: [Query.equal("email", email)],
  });
  return result.total > 0 ? result.rows[0] : null;
}

// this is where the user get created in the auth system if email doesnot exist and send otp to the email
export async function sendEmailOTP(email: string) {
  const { account } = await createAdminClient();
  try {
    const sessionToken = await account.createEmailToken({
      userId: ID.unique(),
      email: email,
    });
    return sessionToken.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
}

// create a new user account in the user table inside the database
export async function createAccount({ fullName, email }: createAccountParams) {
  const accountId = await sendEmailOTP(email);
  if (!accountId) throw new Error("Failed to send an OTP");

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    const { tablesDB } = await createAdminClient();
    try {
      await tablesDB.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersTableId,
        rowId: ID.unique(),
        data: {
          fullName: fullName,
          email: email,
          avatar: "/assets/images/avatar.png",
          accountId: accountId,
        },
      });
    } catch (error) {
      handleError(error, "Failed to create user account in the database");
    }
  }
  return parseStringify(accountId);
}

// verify the otp entered by the user and create a session if otp is correct
export async function verifyEmailOTP({
  accountId,
  password,
}: verifyEmailOtpParams) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession({
      userId: accountId,
      secret: password,
    });

    return session.$id;
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
}

export async function getAuthunticatedUser() {
  try {
    // console.log({ account })
    const { account } = await createSessionClient()
    const result = await account.get();
    console.log({ result });
    // return result;
  } catch (error) {
    handleError(error, "Failed to get authenticated user");
  }
}
