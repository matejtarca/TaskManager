"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {
  return <Button variant="secondary" size="sm" onClick={() => signOut()}>Sign out</Button>;
};

export default SignOutButton;
