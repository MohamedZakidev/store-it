export type authFormType = "sign-in" | "sign-up";

export type authFormProps = {
  type: authFormType;
};

export type ActionType = {
  label: string;
  icon: string;
  value: string;
};

// user action params types
export type CreateAccountParams = {
  fullName: string;
  email: string;
};

export type VerifyEmailOtpParams = {
  accountId: string;
  password: string;
};

// file action params types
export type UploadFileParams = {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
};

export type FileType = "document" | "image" | "video" | "audio" | "other";
export type getFilesParams = {
  types?: FileType[];
  sort?: string;
  limit?: number;
};

export type RenameFileParams = {
  fileId: string;
  bucketFileId: string;
  newName: string;
  extentstion: string;
  path: string;
};

export type UpdateSharedUsersFileParams = {
  fileId: string;
  emails: string[];
  path: string;
};

export type DeleteFileParams = {
  fileId: string;
  bucketFileId: string;
  path: string;
};
