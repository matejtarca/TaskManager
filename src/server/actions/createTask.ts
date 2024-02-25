"use server";

import { z } from "zod";
import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";
import { revalidatePath } from "next/cache";

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;
const createTask = async (dataInput: CreateTaskInput) => {
  const { id: userId } = await requireUser();
  const data = createTaskSchema.parse(dataInput);
  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      authorId: userId,
    },
  });

  revalidatePath("/", "page");
};

export default createTask;
