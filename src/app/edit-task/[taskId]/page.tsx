import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskManager | Edit Task",
};

export default function Page({ params }: { params: { taskId: string } }) {
  return <h1>Edit task - {params.taskId}</h1>;
}
