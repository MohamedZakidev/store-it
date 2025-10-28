export type authFormType = "sign-in" | "sign-up";

export type authFormProps = {
  type: authFormType;
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
