"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

/**
 * Client-side component containing a button to sign out the user.
 */
const SignOutButton = () => {
  return (
    <Button variant="secondary" size="sm" onClick={() => signOut()}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
