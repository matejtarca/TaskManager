import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/authOptions";
import { prisma } from "@/server/prismaClient";

/**
 * Helper function used on the server which asserts that a user is logged in the current session and exists in the
 * database. If the user is not logged in or does not exist in the database, an error is thrown, otherwise the user
 * object is returned.
 *
 * @returns {Promise<User>} The user object from the database. Contains the user's id and username.
 */
const requireUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });
  if (!user) {
    throw new Error("Invalid user id in session");
  }

  return user;
};

export default requireUser;
