import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex  items-center bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>
    </header>
  );
};

export default DashboardHeader;
