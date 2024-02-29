import { render, screen } from "@testing-library/react";
import NewTaskForm from "@/scenes/NewTaskForm/NewTaskForm";
import createTask from "@/server/actions/createTask";
import editTask from "@/server/actions/editTask";
import { userEvent } from "@testing-library/user-event";

jest.mock("@/server/actions/createTask", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockCreateTask = createTask as jest.Mock;

jest.mock("@/server/actions/editTask", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockEditTask = editTask as jest.Mock;

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe("NewTaskForm", () => {
  describe("create mode", () => {
    beforeEach(() => {
      render(<NewTaskForm mode="create" />);
      jest.clearAllMocks();
    });

    it("renders the content of a form", () => {
      expect(screen.getByRole("heading", { name: "New Task" })).toBeVisible();
      expect(screen.getByRole("textbox", { name: "Title" })).toBeVisible();
      expect(
        screen.getByRole("textbox", { name: "Description" }),
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Deadline (optional)" }),
      ).toBeVisible();
      expect(screen.getByRole("button", { name: "Save" })).toBeVisible();

      expect(screen.getByRole("link", { name: "Back" })).toBeVisible();
      expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
        "href",
        "/",
      );
    });

    it("calls createTask when the form is submitted", async () => {
      await userEvent.type(
        screen.getByRole("textbox", { name: "Title" }),
        "Test Task",
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: "Description" }),
        "Test Description",
      );
      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(mockCreateTask).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        deadline: undefined,
      });
      expect(mockEditTask).not.toHaveBeenCalled();
    });

    it("shows an error message if the form is submitted with invalid data", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(mockCreateTask).not.toHaveBeenCalled();
      expect(mockEditTask).not.toHaveBeenCalled();
      expect(screen.getByText("Title is required")).toBeVisible();
    });
  });

  describe("edit mode", () => {
    beforeEach(() => {
      render(
        <NewTaskForm
          mode="edit"
          initialData={{
            title: "Test Task",
            description: "Test Description",
            deadline: new Date("2024-01-01"),
          }}
          taskId="1"
        />,
      );
      jest.clearAllMocks();
    });

    it("renders the content of the form", () => {
      expect(screen.getByRole("heading", { name: "Edit Task" })).toBeVisible();
      expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
        "Test Task",
      );
      expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue(
        "Test Description",
      );
      expect(
        screen.getByRole("button", { name: "Deadline (optional)" }),
      ).toHaveTextContent("1/1/2024");
      expect(screen.getByRole("button", { name: "Save" })).toBeVisible();

      expect(screen.getByRole("link", { name: "Back" })).toBeVisible();
      expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
        "href",
        "/",
      );
    });

    it("calls editTask when the form is submitted with unchanged values", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(mockEditTask).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        deadline: new Date("2024-01-01"),
        taskId: "1",
      });
      expect(mockCreateTask).not.toHaveBeenCalled();
    });

    it("calls editTask when the form is submitted with changed values", async () => {
      await userEvent.clear(screen.getByRole("textbox", { name: "Title" }));
      await userEvent.type(
        screen.getByRole("textbox", { name: "Title" }),
        "New Task",
      );
      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(mockEditTask).toHaveBeenCalledWith({
        title: "New Task",
        description: "Test Description",
        deadline: new Date("2024-01-01"),
        taskId: "1",
      });
      expect(mockCreateTask).not.toHaveBeenCalled();
    });
  });
});
