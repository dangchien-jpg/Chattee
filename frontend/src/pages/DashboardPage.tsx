import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarAdmin } from "@/components/sidebar/sidebar-admin";
import DashboardLayout from "@/components/admin/DashboardLayout";
const DashboardPage = () => {
  return (
    <SidebarProvider>
      <SidebarAdmin />
      <div className="flex h-screen w-full md:p-6">
        <DashboardLayout />
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
