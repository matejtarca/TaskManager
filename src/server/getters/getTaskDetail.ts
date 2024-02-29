import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";

export type TaskForForm = {
  title: string;
  description: string;
  deadline: Date | null;
};

/**
 * Get the details of a task used to pre-fill the form for editing a task.
 *
 * @param taskId The id of the task to get the details for.
 *
 * @returns {Promise<TaskForForm | null>} The details of the task, or null if the task does not exist or
 * is not owned by the current user.
 */
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
      deadline: true,
    },
  });

  if (!task) {
    return null;
  }

  return task;
};

export default getTaskDetail;
