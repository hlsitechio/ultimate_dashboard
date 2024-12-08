import { Card } from "@nextui-org/react";
import Banner from "../components/Banner";
import { useUIStore } from "../store/uiStore";
import SearchOverlay from "../components/dashboard/SearchOverlay";
import DashboardActions from "../components/dashboard/DashboardActions";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";

const Dashboard = () => {
  const { isSidebarCollapsed, sidebarWidth } = useUIStore();
  
  return (
    <div 
      className="-m-6"
      style={{
        width: `calc(100vw - ${isSidebarCollapsed ? 64 : sidebarWidth}px)`,
      }}
    >
      <Banner className="mb-0" />
      
      <div className="bg-background border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <SearchOverlay />
          <DashboardSummary />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <DashboardActions />
          </div>

          <div className="col-span-12">
            <AnalyticsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;