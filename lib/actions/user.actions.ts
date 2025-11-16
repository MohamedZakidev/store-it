"use server";

import { createAccountParams, verifyEmailOtpParams } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";
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

export async function getUserByrowId(userId: string) {
  const { tablesDB } = await createAdminClient();
  try {
    const user = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      rowId: userId,
    });
    return user;
  } catch (error) {
    handleError(error, "Failed to get user by row ID");
  }
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
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return session.$id;
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
}

export async function getAuthenticatedUser() {
  const { account, tablesDB } = await createSessionClient();
  try {
    const result = await account.get();
    const user = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      queries: [Query.equal("accountId", result.$id)],
    });
    return user.total > 0 ? user.rows[0] : null;
  } catch (error) {
    handleError(error, "Failed to get authenticated user");
  }
}

export async function logoutUser() {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession({
      sessionId: "current",
    });
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to logout user");
  } finally {
    redirect("/sign-in");
  }
}

export async function signInUser({ email }: { email: string }) {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP(email);
      return existingUser.accountId;
    }

    return { accountId: null, error: "User not found" };
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
}
