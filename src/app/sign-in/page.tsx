import React from "react";
import SignIn from "@/scenes/SignIn/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskManager | Sign in",
};

export default function Page() {
  return <SignIn />;
}
