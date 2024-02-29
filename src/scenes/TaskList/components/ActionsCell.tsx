import React, { useState, useTransition } from "react";
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
import callServerAction from "@/server/helpers/callServerAction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ActionsCellProps = {
  task: Task;
};

/**
 * Client-side component containing the actions for a given task in the task list. Used as a cell in the TaskTable component.
 * @param task - The task to display the actions for.
 */
const ActionsCell = ({ task }: ActionsCellProps) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [, startTransition] = useTransition();
  const onDeleteClick = () => {
    startTransition(async () => {
      const res = await callServerAction(deleteTask, { taskId: task.id });
      if (!res.success) {
        toast({
          title: "Failed to delete task",
          description: res.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Task deleted",
        });
      }
    });
  };
  const onCompleteClick = () => {
    startTransition(async () => {
      const res = await callServerAction(completeTask, { taskId: task.id });
      if (!res.success) {
        toast({
          title: "Failed to complete task",
          description: res.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Task completed",
        });
      }
    });
  };
  const { toast } = useToast();
  return (
    <>
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
            {task.description && (
              <DialogDescription>
                {task.deadline && (
                  <p>Deadline: {task.deadline.toLocaleDateString()}</p>
                )}
                {task.description}
              </DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex flex-row justify-end gap-2 items-center">
        {task.status === "TODO" && (
          <TooltipProvider>
            <Tooltip delayDuration={400}>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-success/40 dark:bg-success/80 text-success-foreground hover:bg-success/35 hover:text-success-foreground"
                  onClick={onCompleteClick}
                >
                  <Check className="w-4 h-4" />
                  <span className="sr-only">Mark as completed</span>
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
            <DropdownMenuItem
              onClick={() => {
                setIsDetailDialogOpen(true);
              }}
            >
              See detail
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/edit-task/${task.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteClick}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ActionsCell;
