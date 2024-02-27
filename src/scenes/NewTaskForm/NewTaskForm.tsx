"use client";

import React, { useTransition } from "react";
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
import { AlertCircle, Loader2 } from "lucide-react";
import editTask from "@/server/actions/editTask";
import Link from "next/link";

const newTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(50),
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
    },
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);
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
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
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
                <FormDescription>Brief description</FormDescription>
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
    </>
  );
};

export default NewTaskForm;
