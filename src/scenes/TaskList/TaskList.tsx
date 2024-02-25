import React from "react";
import getTasks from "@/server/getters/getTasks";
import Link from "next/link";

const TaskList = async () => {
  const tasks = await getTasks();
  return (
    <>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <Link href={"/create-task"}>Create new task</Link>
    </>
  );
};

export default TaskList;
