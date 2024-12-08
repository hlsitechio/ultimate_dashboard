import { Button } from "@nextui-org/react";
import { Calendar, ChevronLeft, ChevronRight, Home, LayoutDashboard, Mail, Settings, ShoppingCart, FileText, User, HardDrive, ListTodo } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import { useMediaQuery } from '../hooks/useMediaQuery';

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Mail, label: "Email", path: "/email" },
    { icon: ListTodo, label: "Tasks", path: "/tasks" },
    { icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { icon: FileText, label: "Notes", path: "/notes" },
    { icon: HardDrive, label: "Storage", path: "/storage" },
    { divider: true },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (isMobile) {
    return (
      <div className="flex items-center justify-between p-4 bg-background border-b border-gray-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Home className="h-8 w-8 text-primary flex-shrink-0" />
          <span className="text-xl font-bold">Dashboard</span>
        </Link>
        <Button
          isIconOnly
          variant="flat"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-background border-r border-gray-800 flex flex-col relative">
      <Link to="/dashboard" className="flex items-center gap-2 p-4 mb-6">
        <Home className="h-8 w-8 text-primary flex-shrink-0" />
        {!isSidebarCollapsed && (
          <span className="text-xl font-bold">Dashboard</span>
        )}
      </Link>

      <Button
        isIconOnly
        variant="flat"
        className="absolute -right-3 top-14 h-6 w-6 min-w-6 bg-background border border-gray-800 rounded-full shadow-xl z-20 hover:bg-gray-900 transition-colors p-0 hidden md:flex"
        onClick={toggleSidebar}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className="flex-1 flex flex-col gap-2 px-2">
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div key={`divider-${index}`} className="h-px bg-gray-800 my-2" />;
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              as={Link}
              to={item.path}
              variant={isActive ? "flat" : "light"}
              className={`${
                isActive ? "bg-primary/20 text-primary" : "text-gray-400 hover:text-white"
              } ${
                isSidebarCollapsed 
                  ? "px-0 min-w-0 justify-center w-12 h-12" 
                  : "justify-start gap-2 h-12"
              } transition-all duration-200`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!isSidebarCollapsed && (
                <span>{item.label}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;