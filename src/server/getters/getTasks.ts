import requireUser from "@/server/helpers/requireUser";
import { prisma } from "@/server/prismaClient";

type Task = {
  id: string;
  title: string;
  description: string;
};

const getTasks = async (): Promise<Task[]> => {
  const user = await requireUser();
  const tasks = await prisma.task.findMany({
    where: {
      authorId: user.id,
    },
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
  }));
};

export default getTasks;
