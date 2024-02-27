import React, { useTransition } from "react";
import { Task } from "@/server/getters/getTasks";
import { Button } from "@/components/ui/button";
import completeTask from "@/server/actions/completeTask";
import { Check, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import deleteTask from "@/server/actions/deleteTask";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

type ActionsCellProps = {
  task: Task;
};
const ActionsCell = ({ task }: ActionsCellProps) => {
  const [, startTransition] = useTransition();
  const onDeleteClick = () => {
    startTransition(async () => {
      await deleteTask({ taskId: task.id });
    });
  };
  const onCompleteClick = () => {
    startTransition(async () => {
      await completeTask({ taskId: task.id });
      toast({
        title: "Task completed",
      });
    });
  };
  const { toast } = useToast();
  return (
    <div className="flex flex-row justify-end gap-2 items-center">
      {task.status === "TODO" && (
        <TooltipProvider>
          <Tooltip delayDuration={400}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="bg-success/40 text-success-foreground hover:bg-success/35 hover:text-success-foreground"
                onClick={onCompleteClick}
              >
                <Check className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as completed</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/edit-task/${task.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteClick}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsCell;
