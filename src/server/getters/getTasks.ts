import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";
import { TaskStatus } from "@prisma/client";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  deadline: Date | null;
};

const getTasks = async (): Promise<Task[]> => {
  const user = await requireUser();
  return prisma.task.findMany({
    where: {
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      deadline: true,
    },
    orderBy: [
      {
        status: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

export default getTasks;
