import { DataTable } from "@/components/table/DataTable";
import { columns } from "../table/columns";
import { useAdminStore } from "@/stores/useAdminStore";
import { useEffect } from "react";
const DashboardContent = () => {
  const { Users, getAllUsers } = useAdminStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="p-4  h-full flex flex-col overflow-hidden">
      <DataTable columns={columns} data={Users} />
    </div>
  );
};

export default DashboardContent;
