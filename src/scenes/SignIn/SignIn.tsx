"use client";

import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const signInSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn = () => {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      callbackUrl: "/",
    });
  };

  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  return (
    <div>
      {error === "CredentialsSignin" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Invalid credentials, please try again.
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    autoComplete="username"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      Don&apos;t have an account? <Link href={"sign-up"}>Sign up</Link>
    </div>
  );
};

export default SignIn;