import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";

export type TaskForForm = {
  title: string;
  description: string;
};

const getTaskDetail = async (taskId: string): Promise<TaskForForm | null> => {
  const user = await requireUser();

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
      authorId: user.id,
    },
    select: {
      title: true,
      description: true,
    },
  });

  if (!task) {
    return null;
  }

  return task;
};

export default getTaskDetail;
