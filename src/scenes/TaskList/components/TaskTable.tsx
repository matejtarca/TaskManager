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
import { flexRender, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import completeTask from "@/server/actions/completeTask";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type TaskTableProps = {
  tasks: Task[];
};

const columns: ColumnDef<Task>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Status",
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
    cell: (cell) => {
      const taskId = cell.row.original.id;
      return (
        <div className="flex flex-row justify-end">
          {cell.row.original.status === "TODO" && (
            <Button
              size="sm"
              variant="success"
              onClick={async () =>
                await completeTask({
                  taskId,
                })
              }
            >
              <Check className="w-4 h-4 mr-2" />
              Complete
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/edit-task/${taskId}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
const TaskTable = ({ tasks }: TaskTableProps) => {
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
