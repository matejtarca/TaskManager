import React from "react";

export default function Page({ params }: { params: { taskId: string } }) {
  return <h1>Edit task - {params.taskId}</h1>;
}
