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
