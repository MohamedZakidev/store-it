"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authFormProps, authFormType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function generateAuthFormSchema(formType: authFormType) {
  return z.object({
    email: z.email("Please enter a valid email address"),
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(2, "Your name must be at least 2 characters long")
            .max(50)
        : z.string().optional(),
  });
}

function AuthForm({ type }: authFormProps) {
  // state
  console.log("auth form render");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  // form schema
  const formSchema = generateAuthFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-up" ? "Create Account" : "Login"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full Name"
                        className="shad-input"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      className="shad-input"
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="form-submit-button"
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src={"/assets/icons/loader.svg"}
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center text-light-100">
            {type === "sign-in" ? (
              <p>
                Don&apos;t have an account?{" "}
                <span className="text-brand font-medium">
                  <Link href={"/sign-up"}>Create Account</Link>
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span className="text-brand font-medium">
                  <Link href={"/sign-in"}>Login</Link>
                </span>
              </p>
            )}
          </div>
        </form>
      </Form>
      {/* otp verfication */}
    </>
  );
}

export default AuthForm;
