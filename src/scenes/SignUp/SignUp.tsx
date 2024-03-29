"use client";

import React, { useTransition } from "react";

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
import Link from "next/link";
import signUp from "@/server/actions/signUp";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { passwordSchema } from "@/server/helpers/schemas";
import callServerAction from "@/server/helpers/callServerAction";
import { signIn } from "next-auth/react";
import { Heading } from "@/components/ui/heading";

const signUpSchema = z.object({
  username: z.string().min(3).max(50),
  password: passwordSchema,
  repeatPassword: z.string(),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

/**
 * Client-side component containing a form to sign up the user. After successful sign up, the user is signed in and redirected to
 * the home page.
 */
const SignUp = () => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
    },
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: SignUpSchema) => {
    if (data.password !== data.repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    startTransition(async () => {
      const result = await callServerAction(signUp, data);
      if (!result.success) {
        setError(result.message);
        return;
      }

      await signIn("credentials", {
        username: data.username,
        password: data.password,
        callbackUrl: "/",
      });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Heading>Sign up</Heading>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input autoComplete="username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your unique username, which will be used to sign in
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
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your top secret password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Can you type that password again?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign up
          </Button>
        </form>
      </Form>
      <p>
        Already have an account?{" "}
        <Link href={"sign-in"} className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
