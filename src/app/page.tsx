import React from "react";
import Link from "next/link";
import TaskList from "@/scenes/TaskList/TaskList";

export default async function Home() {
  return (
    <div>
      <TaskList />
    </div>
  );
}
