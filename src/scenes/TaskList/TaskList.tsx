import React from "react";
import getTasks from "@/server/getters/getTasks";
import Link from "next/link";
import TaskTable from "@/scenes/TaskList/components/TaskTable";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

/**
 * Server-side component rendering a list of tasks and a button to create a new task.
 */
const TaskList = async () => {
  const tasks = await getTasks();
  return (
    <div className="flex flex-col gap-4">
      <Heading>My Tasks</Heading>
      <TaskTable tasks={tasks} />
      <Link href={"/create-task"} className="w-fit">
        <Button className="w-fit">
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          Create new task
        </Button>
      </Link>
    </div>
  );
};

export default TaskList;
