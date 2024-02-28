"use client";

import React from "react";
import { Task } from "@/server/getters/getTasks";
import { ColumnDef, getCoreRowModel } from "@tanstack/table-core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const StatusDisplayMap: Record<string, string> = {
  [TaskStatus.TODO]: "To do",
  [TaskStatus.COMPLETED]: "Completed",
};

type TaskTableProps = {
  tasks: Task[];
};

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
    header: "",
    id: "actions",
    cell: (cell) => <ActionsCell task={cell.row.original} />,
  },
];
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
      <div className="flex flex-col gap-2 py-4">
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
                  No results.
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
