import DashboardContent from "@/components/admin/DashboardContent";
import DashboardHeader from "@/components/admin/DashboardHeader";

import { SidebarInset } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      <DashboardHeader />
      <div className="flex-1 overflow-y-auto">
        <DashboardContent />
      </div>
    </SidebarInset>
  );
};

export default DashboardLayout;
