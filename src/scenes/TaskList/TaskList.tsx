import React from "react";
import getTasks from "@/server/getters/getTasks";
import Link from "next/link";
import TaskTable from "@/scenes/TaskList/components/TaskTable";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

const TaskList = async () => {
  const tasks = await getTasks();
  return (
    <div className="flex flex-col gap-4">
      <Heading>Tasks</Heading>
      <TaskTable tasks={tasks} />
      <Button asChild className="w-fit">
        <span>
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          <Link href={"/create-task"}>Create new task</Link>
        </span>
      </Button>
    </div>
  );
};

export default TaskList;
