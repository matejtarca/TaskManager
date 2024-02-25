"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const TaskList = () => {
  const { data, status } = useSession();
  return (
    <>
      {data?.username || "unknown user"}
      <Button onClick={() => signOut({ callbackUrl: "/sign-in" })}>
        Sign out
      </Button>
    </>
  );
};

export default TaskList;
