import React from "react";
import { Metadata } from "next";
import getTaskDetail from "@/server/getters/getTaskDetail";
import NewTaskForm from "@/scenes/NewTaskForm/NewTaskForm";

export const metadata: Metadata = {
  title: "TaskManager | Edit Task",
};

export default async function Page({ params }: { params: { taskId: string } }) {
  const task = await getTaskDetail(params.taskId);
  if (!task) {
    return <p>Task not found</p>;
  }
  return <NewTaskForm mode="edit" initialData={task} taskId={params.taskId} />;
}
