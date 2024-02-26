import React from "react";
import NewTaskForm from "@/scenes/NewTaskForm/NewTaskForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskManager | Create Task",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }
  return <NewTaskForm mode="create" />;
}
