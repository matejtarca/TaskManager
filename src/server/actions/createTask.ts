"use server";

import { z } from "zod";
import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";
import { revalidatePath } from "next/cache";

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  deadline: z.date().optional(),
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;

/**
 * Server action which creates a new task in the database. The current user is set as the author of the task.
 *
 * @param dataInput - Object containing the details of the task to create - title, description and optional deadline.
 */
const createTask = async (dataInput: CreateTaskInput) => {
  const { id: userId } = await requireUser();
  const data = createTaskSchema.parse(dataInput);
  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      authorId: userId,
      deadline: data.deadline,
    },
  });

  revalidatePath("/", "page");
};

export default createTask;
