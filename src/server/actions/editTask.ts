"use server";

import { z } from "zod";
import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";
import { revalidatePath } from "next/cache";

const editTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  taskId: z.string(),
  deadline: z.date().optional(),
});

type EditTaskInput = z.infer<typeof editTaskSchema>;

/**
 * Server action which edits a task in the database. If the task is not found or the current user is not the author, an error is thrown.
 *
 * @param dataInput - Object containing the details of the task to edit - title, description, deadline and the id of the task to edit.
 */
const editTask = async (dataInput: EditTaskInput) => {
  const user = await requireUser();
  const data = editTaskSchema.parse(dataInput);

  const task = await prisma.task.findUnique({
    where: {
      id: data.taskId,
      authorId: user.id,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.update({
    where: {
      id: data.taskId,
    },
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
    },
  });

  revalidatePath("/", "page");
};

export default editTask;
