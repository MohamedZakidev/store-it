"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchemaForSignUp = z.object({
  fullName: z.string().min(2).max(50),
  email: z.email("Please enter a valid email address"),
});

const formSchemaForSignIn = z.object({
  email: z.email("Please enter a valid email address"),
});

type authFormProps = {
  type: "sign-in" | "sign-up";
};

function AuthForm({ type }: authFormProps) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:
      type === "sign-up"
        ? zodResolver(formSchemaForSignUp)
        : zodResolver(formSchemaForSignIn),
    defaultValues:
      type === "sign-up"
        ? {
            fullName: "",
            email: "",
          }
        : {
            email: "",
          },
  });

  return <div>{type === "sign-in" ? "Sign In" : "Sign Up"}</div>;
}

export default AuthForm;
