import { Prisma, User } from "@prisma/client";
import { prismaMock } from "@/jest/prismaMock";

type CreateMockUserOptions = {
  user?: Partial<User> | null;
};
export const createMockUser = (options?: CreateMockUserOptions) => {
  const { user } = options ?? {};
  const mockedUser = new Promise((resolve) =>
    resolve(
      user === null
        ? null
        : {
            id: "test",
            username: "test",
            password: "test",
            createdAt: new Date(),
            ...user,
          },
    ),
  ) as Prisma.Prisma__UserClient<User | null>;
  prismaMock.user.findFirst.mockReturnValue(mockedUser);
  prismaMock.user.findUnique.mockReturnValue(mockedUser);
};
