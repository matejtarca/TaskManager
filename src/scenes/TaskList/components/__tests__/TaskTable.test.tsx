import { render, screen } from "@testing-library/react";
import TaskTable from "@/scenes/TaskList/components/TaskTable";
import deleteTask from "@/server/actions/deleteTask";
import completeTask from "@/server/actions/completeTask";
import { userEvent } from "@testing-library/user-event";
import { Toaster } from "@/components/ui/toaster";

jest.mock("@/server/actions/deleteTask", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockDeleteTask = deleteTask as jest.Mock;

jest.mock("@/server/actions/completeTask", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockCompleteTask = completeTask as jest.Mock;

describe("TaskTable", () => {
  it("renders a table with the list of tasks", async () => {
    render(
      <TaskTable
        tasks={[
          {
            id: "1",
            title: "Task 1",
            description: "",
            status: "TODO",
            deadline: null,
          },
          {
            id: "2",
            title: "Task 2",
            description: "Description 2",
            status: "COMPLETED",
            deadline: new Date("2023-01-01"),
          },
        ]}
      />,
    );

    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByRole("cell", { name: "Task 1" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "To do" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "Task 2" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "Completed" })).toBeVisible();

    expect(
      screen.getByRole("button", { name: "Mark as completed" }),
    ).toBeVisible();
    expect(
      await screen.findAllByRole("button", { name: "Open menu" }),
    ).toHaveLength(2);
  });

  describe("actions", () => {
    beforeEach(() => {
      render(
        <>
          <TaskTable
            tasks={[
              {
                id: "1",
                title: "Task 1",
                description: "Description 1",
                status: "TODO",
                deadline: null,
              },
            ]}
          />
          <Toaster />
        </>,
      );
      jest.clearAllMocks();
    });

    it("calls completeTask when the 'Mark as completed' button is clicked", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Mark as completed" }),
      );
      expect(mockCompleteTask).toHaveBeenCalledWith({ taskId: "1" });
      expect(screen.getByText("Task completed")).toBeVisible();
    });

    it("calls deleteTask when the 'Delete' button is clicked", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
      await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
      expect(mockDeleteTask).toHaveBeenCalledWith({ taskId: "1" });
      expect(screen.getByText("Task deleted")).toBeVisible();
    });

    it("has link to edit task", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
      expect(screen.getByRole("menuitem", { name: "Edit" })).toBeVisible();
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
        "href",
        "/edit-task/1",
      );
    });

    it("shows a dialog with the task details when the 'Details' button is clicked", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
      await userEvent.click(
        screen.getByRole("menuitem", { name: "See detail" }),
      );
      expect(screen.getByRole("dialog")).toBeVisible();
      expect(screen.getByRole("heading", { name: "Task 1" })).toBeVisible();
      expect(screen.getByText("Description 1")).toBeVisible();
    });
  });
});
