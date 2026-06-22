import { DataTable } from "@/components/table/DataTable";
import { columns } from "../table/columns";
import { useAdminStore } from "@/stores/useAdminStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }
  
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const DashboardContent = () => {
  const { Users, getAllUsers, pagination, loading } = useAdminStore();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    getAllUsers(page, limit);
  }, [page, getAllUsers]);

  return (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <DataTable columns={columns} data={Users} />
      </div>
      {pagination && (
        <div className="flex items-center justify-end space-x-4 py-4">
          <div className="text-sm text-gray-500 hidden sm:block">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {generatePagination(page, pagination.totalPages).map((p, i) => (
                p === "..." ? (
                  <span key={i} className="px-2 text-gray-500">...</span>
                ) : (
                  <Button
                    key={i}
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setPage(p as number)}
                    disabled={loading}
                  >
                    {p}
                  </Button>
                )
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
