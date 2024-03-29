"use server";

import { z } from "zod";
import { prisma } from "@/server/prismaClient";
import requireUser from "@/server/helpers/requireUser";
import { revalidatePath } from "next/cache";

const completeTaskSchema = z.object({
  taskId: z.string(),
});

type CompleteTaskInput = z.infer<typeof completeTaskSchema>;

/**
 * Server action which marks a task as completed. If the task is not found or the current user is not the author, an error is thrown.
 *
 * @param dataInput - Object containing the id of the task to complete.
 */
const completeTask = async (dataInput: CompleteTaskInput) => {
  const { id: userId } = await requireUser();
  const data = completeTaskSchema.parse(dataInput);
  const task = await prisma.task.findUnique({
    where: {
      id: data.taskId,
      authorId: userId,
    },
  });

  if (!task) {
    throw new Error("Invalid task id");
  }

  await prisma.task.update({
    where: {
      id: data.taskId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  revalidatePath("/", "page");
};

export default completeTask;
