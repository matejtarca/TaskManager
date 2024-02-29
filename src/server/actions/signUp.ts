"use server";

import { z } from "zod";
import { passwordSchema } from "@/server/helpers/schemas";
import { prisma } from "@/server/prismaClient";
import { ExpectedServerActionError } from "@/server/helpers/ExpectedServerActionError";
import { hash } from "argon2";

const signUpSchema = z.object({
  username: z.string().min(3).max(50),
  password: passwordSchema,
});

type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Server action which creates a new user in the database. If the username is already taken, an expected error is thrown.
 *
 * @param data - Object containing the username and plaintext password of the user to create.
 */
const signUp = async (data: SignUpInput) => {
  const { username, password } = signUpSchema.parse(data);

  const sameUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (sameUser) {
    throw new ExpectedServerActionError("Username already taken");
  }

  const hashedPassword = await hash(password);

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
};

export default signUp;
