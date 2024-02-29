"use server";

import { z } from "zod";
import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";
import { revalidatePath } from "next/cache";

const deleteTaskSchema = z.object({
  taskId: z.string(),
});

type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

/**
 * Server action which deletes a task from the database. If the task is not found or the current user is not the author, an error is thrown.
 *
 * @param dataInput - Object containing the id of the task to delete.
 */
const deleteTask = async (dataInput: DeleteTaskInput) => {
  const user = await requireUser();
  const data = deleteTaskSchema.parse(dataInput);

  const task = await prisma.task.findUnique({
    where: {
      id: data.taskId,
      authorId: user.id,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({
    where: {
      id: data.taskId,
    },
  });

  revalidatePath("/", "page");
};

export default deleteTask;
