"use client";

import React, { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import callServerAction from "@/server/helpers/callServerAction";
import createTask from "@/server/actions/createTask";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import editTask from "@/server/actions/editTask";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const newTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(50),
  deadline: z.date().optional(),
  description: z.string().max(1000),
});

type NewTaskSchema = z.infer<typeof newTaskSchema>;
type NewTaskFormProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      initialData: NewTaskSchema;
      taskId: string;
    };
const NewTaskForm = (props: NewTaskFormProps) => {
  const form = useForm<NewTaskSchema>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      title: props.mode === "edit" ? props.initialData.title : "",
      description: props.mode === "edit" ? props.initialData.description : "",
      deadline: props.mode === "edit" ? props.initialData.deadline : undefined,
    },
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false);
  const { push } = useRouter();
  const onSubmit = async (formData: NewTaskSchema) => {
    startTransition(async () => {
      let result;
      if (props.mode === "edit") {
        result = await callServerAction(editTask, {
          ...formData,
          taskId: props.taskId,
        });
      } else {
        result = await callServerAction(createTask, formData);
      }
      if (!result.success) {
        setError(result.message);
      }
      push("/");
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <Heading>New Task</Heading>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Wash the dishes" {...field} />
                </FormControl>
                <FormDescription>What should you do?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormDescription>
                  Are there any details you want to add?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline (optional)</FormLabel>
                <Popover
                  open={isCalendarPopoverOpen}
                  onOpenChange={setIsCalendarPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="top"
                  >
                    <Calendar
                      className="h-[350px]"
                      mode="single"
                      selected={field.value}
                      onSelect={(value) => {
                        field.onChange(value);
                        setIsCalendarPopoverOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When do you need to finish this task?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-4">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
            <Button asChild variant="secondary">
              <Link href={"/"}>Back</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewTaskForm;
