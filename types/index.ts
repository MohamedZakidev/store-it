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
export type createAccountParams = {
  fullName: string;
  email: string;
};

export type verifyEmailOtpParams = {
  accountId: string;
  password: string;
};

// file action params types
export type uploadFileParams = {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
};

export type RenameFileParams = {
  fileId: string;
  newName: string;
  extentstion: string;
  path: string;
};
