import requireUser from "@/server/helpers/requireUser";
import { getServerSession } from "next-auth";
import { createMockUser } from "@/jest/userFactory";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

const getServerSessionMock = getServerSession as jest.Mock;
describe("requireUser", () => {
  it("should throw if no session is present", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    await expect(requireUser()).rejects.toThrow("Unauthorized");
  });

  it("should throw if user in session is not in database", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: "test" });
    createMockUser({
      user: null,
    });
    await expect(requireUser()).rejects.toThrow("Invalid user id in session");
  });

  it("should return the user if the session is valid", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: "test" });
    createMockUser({
      user: {
        id: "test",
      },
    });
    const user = await requireUser();
    expect(user).toEqual(expect.objectContaining({ id: "test" }));
  });
});
