import React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import { TopNav } from "./TopNav";
import BottomNav from "./BottomNav";

const MainLayout: React.FC = () => {
  return (
    <div className="Main-entry-point flex h-screen w-screen flex-row overflow-hidden">
      <SideNav />
      <section className="flex h-full w-full flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNav />
        <BottomNav />
        {/* Content */}
        <main className="align-center main-content flex-1 overflow-y-auto bg-zinc-50 bg-gradient-to-b from-white/0 to-blue-500/50 p-3 pb-24 md:pb-0 lg:p-4">
          {/*This is where the nested routes will be rendered which will be given my router dom from app.tsx  */}
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default MainLayout;
