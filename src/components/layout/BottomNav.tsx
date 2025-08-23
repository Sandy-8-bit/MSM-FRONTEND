import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/useAuthStore";
import { appRoutes } from "@/routes/appRoutes";

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  activeIcon: string;
  roles: string[];
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    route: appRoutes.dashboardPage,
    icon: "/icons/sideNavIcons/dashboard-icon.svg",
    activeIcon: "/icons/sideNavIcons/dashboard-icon-active-icon.svg",
    roles: ["ADMIN", "SERVICE"],
  },
  {
    label: "Master",
    route: appRoutes.masterRoutes.masterPage,
    icon: "/icons/sideNavIcons/master-icon.svg",
    activeIcon: "/icons/sideNavIcons/master-icon-active-icon.svg",
    roles: ["ADMIN"],
  },
  {
    label: "Transaction",
    route: appRoutes.transactionRoutes.transcationPage,
    icon: "/icons/sideNavIcons/loan-icon.svg",
    activeIcon: "/icons/sideNavIcons/loan-icon-active-icon.svg",
    roles: ["ADMIN"],
  },
  {
    label: "Users",
    route: appRoutes.userRoutes.userPage || "/users",
    icon: "/icons/sideNavIcons/users-icon.svg",
    activeIcon: "/icons/sideNavIcons/users-icon-active-icon.svg",
    roles: ["ADMIN"],
  },
  {
    label: "Services",
    route: appRoutes.ServiceRoutes.servicePage || "/Service",
    icon: "/icons/sideNavIcons/service-icon.svg",
    activeIcon: "/icons/sideNavIcons/service-icon-active-icon.svg",
    roles: ["ADMIN", "SERVICE"],
  },
  {
    label: "Reports",
    route: appRoutes.reportRoutes.reportPage || "/reports",
    icon: "/icons/sideNavIcons/reports-icon.svg",
    activeIcon: "/icons/sideNavIcons/reports-icon-active-icon.svg",
    roles: ["ADMIN"],
  },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuthStore();

  const isActive = (route: string) =>
    location.pathname === route || location.pathname.startsWith(`${route}/`);

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex justify-center border-t bg-white/80 px-2 py-2 pb-6 shadow-md backdrop-blur-md lg:hidden">
      <div className="flex w-full max-w-[390px] flex-row justify-center gap-5 px-3">
        {navItems
          .filter((item) => item.roles.includes(role!))
          .map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center text-xs text-slate-500"
            >
              <div className="rounded-md p-1.5 transition-all duration-300">
                <img
                  src={isActive(item.route) ? item.activeIcon : item.icon}
                  alt={item.label}
                  className="h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5"
                />
              </div>
              <span
                className={`mt-0.5 font-semibold ${
                  isActive(item.route) ? "text-blue-500" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
      </div>
    </nav>
  );
};

export default BottomNav;
