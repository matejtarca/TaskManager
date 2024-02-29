import { render, screen } from "@testing-library/react";
import SignOutButton from "@/components/Navbar/components/SignOutButton";
import { signOut } from "next-auth/react";
import { userEvent } from "@testing-library/user-event";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));
const mockSignOut = signOut as jest.Mock;

describe("SignOutButton", () => {
  it("should render and call signOut", async () => {
    render(<SignOutButton />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();

    await userEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();
  });
});
