"use server";

import { z } from "zod";
import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";
import { revalidatePath } from "next/cache";

const deleteTaskSchema = z.object({
  taskId: z.string(),
});

type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

const editTask = async (dataInput: DeleteTaskInput) => {
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

export default editTask;
