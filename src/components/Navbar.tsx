import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex flex-row gap-4 items-center p-5 fixed">
      <span>TaskManager - {session?.username || "Not signed in"}</span>
      <Link href={"/"}>Home</Link>
      <SignOutButton />
    </div>
  );
};

export default Navbar;
