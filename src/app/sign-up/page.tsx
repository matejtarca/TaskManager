import React from "react";
import SignUp from "@/scenes/SignUp/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskManager | Sign up",
};
export default function Page() {
  return <SignUp />;
}
