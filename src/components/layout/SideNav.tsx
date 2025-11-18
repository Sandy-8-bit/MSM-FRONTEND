import { appRoutes } from "../../routes/appRoutes";
import { motion } from "framer-motion"; // fixed: 'motion/react' is incorrect
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
// import InstallButton from "@/hooks/InstallPwaButton";

const SideNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuthStore();

  const activeRoute = location.pathname;

  const isRouteActive = (baseRoute: string) => {
    return activeRoute === baseRoute || activeRoute.startsWith(`${baseRoute}/`);
  };

  const navigateToRoute = (route: string) => {
    navigate(route);
  };

  return (
    <div className="floating-container relative hidden h-screen border-r-2 border-slate-300 transition-all duration-300 lg:flex">
      <motion.section
        className="flex h-screen flex-col items-center justify-start gap-3 overflow-clip transition-all duration-300 select-none"
        animate={{ x: 0, opacity: 1 }}
      >
        {/* ---------- LOGO ----------- */}
        <motion.div
          className="relative flex max-w-full flex-col items-center justify-center overflow-clip px-4 py-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.img
            src="/icons/logo-icon-side-nav.svg"
            alt="Logo"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.p
            className="orange-gradient absolute bottom-1.5 rounded px-1.5 py-1 text-[10px] font-normal text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.4, type: "tween", stiffness: 200 }}
          >
            MSM
          </motion.p>
        </motion.div>

        {/* ---------- NAVIGATION ITEMS ----------- */}
        <motion.div
          className="main-navigation-items flex h-full flex-col justify-between px-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col gap-3 overflow-y-auto">
            <NavigationButton
              labelName="Dashboard"
              isActive={isRouteActive(appRoutes.dashboardPage)}
              iconSrc="/icons/sideNavIcons/dashboard-icon.svg"
              activeIconSrc="/icons/sideNavIcons/dashboard-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.dashboardPage)}
              isVisible={
                role === "SERVICE" || role === "ADMIN"
                // import.meta.env.VITE_MODE === "development"
              }
            />

            <NavigationButton
              labelName="Master"
              isActive={isRouteActive(appRoutes.masterRoutes.masterPage)}
              iconSrc="/icons/sideNavIcons/master-icon.svg"
              activeIconSrc="/icons/sideNavIcons/master-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.masterRoutes.masterPage)}
              isVisible={role === "ADMIN"}
            />

            <NavigationButton
              labelName="Transaction"
              isActive={isRouteActive(
                appRoutes.transactionRoutes.transcationPage,
              )}
              iconSrc="/icons/sideNavIcons/loan-icon.svg"
              activeIconSrc="/icons/sideNavIcons/loan-icon-active.svg"
              onClick={() =>
                navigateToRoute(appRoutes.transactionRoutes.transcationPage)
              }
              isVisible={role === "ADMIN"}
            />

            <NavigationButton
              labelName="Users"
              isActive={isRouteActive(
                appRoutes.userRoutes?.userPage || "/users",
              )}
              iconSrc="/icons/sideNavIcons/users-icon.svg"
              activeIconSrc="/icons/sideNavIcons/users-icon-active.svg"
              onClick={() =>
                navigateToRoute(appRoutes.userRoutes?.userPage || "/users")
              }
              isVisible={role === "ADMIN"}
            />

            <NavigationButton
              labelName="Services"
              isActive={isRouteActive(
                appRoutes.ServiceRoutes?.servicePage || "/Service",
              )}
              iconSrc="/icons/sideNavIcons/service-icon.svg"
              activeIconSrc="/icons/sideNavIcons/service-icon-active.svg"
              onClick={() =>
                navigateToRoute(
                  appRoutes.ServiceRoutes?.servicePage || "/Service",
                )
              }
              isVisible={role === "SERVICE" || role === "ADMIN"}
            />
            <NavigationButton
              labelName="Reports"
              isActive={isRouteActive(
                appRoutes.reportRoutes?.reportPage || "/reports",
              )}
              iconSrc="/icons/sideNavIcons/reports-icon.svg"
              activeIconSrc="/icons/sideNavIcons/reports-icon-active.svg"
              onClick={() =>
                navigateToRoute(
                  appRoutes.reportRoutes?.reportPage || "/reports",
                )
              }
              isVisible={role === "ADMIN"}
            />

            {/* --install pwa button */}
            {/* <InstallButton /> */}
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default SideNav;

interface NavigationButtonProps {
  labelName: string;
  isActive: boolean;
  iconSrc: string;
  activeIconSrc?: string;
  onClick?: () => void;
  isVisible: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  labelName,
  isActive,
  iconSrc,
  activeIconSrc,
  isVisible,
  onClick,
}) => {
  return (
    <div
      style={{ display: isVisible ? "flex" : "none" }}
      className="Navigation-button-container flex scale-90 flex-col items-center justify-center"
      onClick={onClick}
    >
      <div
        className={`Navigation-button-container ${isActive ? "bg-blue-500 p-3" : "bg-white p-1.5 hover:bg-slate-100"} cursor-pointer rounded-[10px] transition-all duration-50 ease-in-out select-none active:bg-blue-600`}
      >
        <img src={isActive ? activeIconSrc : iconSrc} alt={labelName} />
      </div>
      <h4
        className={`scale-95 text-sm ${isActive ? "font-medium text-slate-700" : "font-medium text-slate-500"}`}
      >
        {labelName}
      </h4>
    </div>
  );
};
