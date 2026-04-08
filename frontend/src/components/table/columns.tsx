import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminStore } from "@/stores/useAdminStore";
import type { User } from "@/types/user";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "displayName",
    header: "Tên hiển thị",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("displayName")}</div>
    ),
  },
  {
    accessorKey: "userName",
    header: "Tên đăng nhập",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userName")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "avatarUrl",
    header: "Ảnh đại diện",
    cell: ({ row }) => (
      <div className="font-medium">
        <img className="w-[50px]" src={row.getValue("avatarUrl")} alt="" />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);

      return (
        <span>
          {date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      return row.getValue("status") === "active" ? (
        <span className="text-sm success-message">Đang hoạt động</span>
      ) : row.getValue("status") === "inactive" ? (
        <span className="text-sm error-message">Ngưng hoạt động</span>
      ) : (
        <span className="text-sm error-message">Vô hiệu hóa</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem
              className="error-message"
              onClick={() => {
                useAdminStore.getState().blockUser(row.original._id);
                toast.success("Đã vô hiệu hóa người dùng này!");
              }}
            >
              Chặn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
