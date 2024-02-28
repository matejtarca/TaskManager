import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/authOptions";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";
import { Heading } from "./ui/heading";
import { Button } from "./ui/button";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex items-center p-5 fixed w-screen bg-white">
      <div className="flex-1"></div>
      <div className="flex-1 max-w-xs mx-auto text-center">
        <Link href="/">
          <Heading>
            <span className="font-light">Task</span>Manager
          </Heading>
        </Link>
      </div>
      <div className="flex-1 flex justify-end">
        {session ? (
          <div className="flex items-center gap-4">
            <span>
              Signed in as <strong>{session.username}</strong>
            </span>
            <SignOutButton />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span>Not signed in</span>
            <Link href={"/sign-in"}>
              <Button variant="secondary" size="sm">
                Sign in
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
