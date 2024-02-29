import { useTheme } from "next-themes";
import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/components/Navbar/components/ThemeToggle";
import { userEvent } from "@testing-library/user-event";

jest.mock("next-themes");

const setThemeMock = jest.fn();

describe("ThemeToggle", () => {
  beforeAll(() => {
    (useTheme as jest.Mock).mockReturnValue({ setTheme: setThemeMock });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a button with a dropdown menu", async () => {
    render(<ThemeToggle />);

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();

    await userEvent.click(toggleButton);

    expect(screen.getByRole("menuitem", { name: /light/i })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: /dark/i })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: /system/i })).toBeVisible();
  });

  it("should call setTheme with 'light' when clicking on the light theme option", async () => {
    render(<ThemeToggle />);

    await userEvent.click(
      screen.getByRole("button", { name: /toggle theme/i }),
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /light/i }));

    expect(setThemeMock).toHaveBeenCalledWith("light");
  });

  it("should call setTheme with 'dark' when clicking on the dark theme option", async () => {
    render(<ThemeToggle />);

    await userEvent.click(
      screen.getByRole("button", { name: /toggle theme/i }),
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /dark/i }));

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("should call setTheme with 'system' when clicking on the system theme option", async () => {
    render(<ThemeToggle />);

    await userEvent.click(
      screen.getByRole("button", { name: /toggle theme/i }),
    );

    await userEvent.click(screen.getByRole("menuitem", { name: /system/i }));

    expect(setThemeMock).toHaveBeenCalledWith("system");
  });
});
