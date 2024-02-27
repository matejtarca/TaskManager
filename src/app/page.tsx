import React from "react";
import TaskList from "@/scenes/TaskList/TaskList";
import { authOptions } from "@/server/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskManager | Task List",
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }
  return <TaskList />;
}
