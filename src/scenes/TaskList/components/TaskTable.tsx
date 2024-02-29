"use client";

import React from "react";
import { Task } from "@/server/getters/getTasks";
import { ColumnDef, getCoreRowModel } from "@tanstack/table-core";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  flexRender,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import ActionsCell from "@/scenes/TaskList/components/ActionsCell";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@prisma/client";
import { Timer } from "lucide-react";

const StatusDisplayMap: Record<string, string> = {
  [TaskStatus.TODO]: "To do",
  [TaskStatus.COMPLETED]: "Completed",
};

type TaskTableProps = {
  tasks: Task[];
};

/**
 * Formats a date relative to the current date. The date is formatted as a relative time (e.g. "in 3 days", "yesterday" etc.).
 * @param date - The date to format.
 *
 * @returns object - The formatted date and a boolean indicating whether the date is overdue (in the past).
 */
const formatDateRelativeToNow = (date: Date) => {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const dateMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  return {
    formatted: new Intl.RelativeTimeFormat("en", {
      style: "short",
      numeric: "auto",
    }).format(
      Math.floor(
        (dateMidnight.getTime() - todayMidnight.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      "day",
    ),
    isOverdue: dateMidnight < todayMidnight,
  };
};

/**
 * The columns configuration for the task table.
 */
const columns: ColumnDef<Task>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    cell: (cell) => {
      switch (cell.row.original.status) {
        case "TODO":
          return <Badge variant="info">To do</Badge>;
        case "COMPLETED":
          return <Badge variant="success">Completed</Badge>;
      }
    },
  },
  {
    header: "Deadline",
    id: "deadline",
    accessorKey: "deadline",
    cell: (cell) => {
      const task = cell.row.original;
      if (task.deadline && task.status === "TODO") {
        const { formatted, isOverdue } = formatDateRelativeToNow(task.deadline);
        return (
          <div
            className={`flex items-center ${isOverdue ? "text-red-500" : ""}`}
          >
            <Timer className="w-5 h-5 mr-1" />
            {formatted}
          </div>
        );
      }
      return null;
    },
  },
  {
    header: "",
    id: "actions",
    cell: (cell) => <ActionsCell task={cell.row.original} />,
  },
];

/**
 * Client-side table component to display a list of tasks. Each task displays its title, status, deadline and actions.
 * The tasks can be filtered by title or status.
 *
 * @param tasks - The list of tasks to display.
 */
const TaskTable = ({ tasks }: TaskTableProps) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <Input
          placeholder="Search tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("status")?.setFilterValue(undefined);
            } else {
              table.getColumn("status")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">(all)</SelectItem>
            {Object.keys(TaskStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {StatusDisplayMap[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskTable;
