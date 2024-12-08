import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { Bell, Settings, LogOut, User, Menu } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from '../hooks/useMediaQuery';
import ElfsightWidget from "./ElfsightWidget";
import DigitalClock from "./DigitalClock";

const Navbar = () => {
  const { isNavbarCollapsed, toggleNavbar, toggleSidebar } = useUIStore();
  const { user, signOut } = useAuthStore();
  const { dashboardTitle, dashboardTitleColor } = useSettingsStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="relative z-10">
      <nav className={`bg-background/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${
        isNavbarCollapsed ? 'h-0 overflow-hidden' : 'h-16'
      } flex items-center px-4 md:px-6`}>
        <div className="flex items-center gap-4 flex-1">
          {isMobile && (
            <Button
              isIconOnly
              variant="light"
              className="md:hidden"
              onPress={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className={`text-xl md:text-2xl font-bold ${dashboardTitleColor} truncate`}>
            {dashboardTitle}
          </h1>
          <div className="hidden md:flex items-center gap-4">
            <ElfsightWidget />
            <DigitalClock />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button isIconOnly variant="light" className="text-gray-400">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                src={user?.photoURL || undefined}
                name={user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile actions">
              <DropdownItem
                key="profile"
                startContent={<User className="h-4 w-4" />}
                onPress={() => navigate('/profile')}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                key="settings"
                startContent={<Settings className="h-4 w-4" />}
                onPress={() => navigate('/settings')}
              >
                Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<LogOut className="h-4 w-4" />}
                onPress={signOut}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;