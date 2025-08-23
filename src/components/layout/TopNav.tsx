import { motion } from "framer-motion";
import React from "react";

import NotificationCenter from "../common/NotificationCenter";
import { useAuthStore } from "@/store/useAuthStore";
import ProfileMenu from "../common/ProfileMenu";

export const TopNav: React.FC = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatted = date.toLocaleDateString("en-GB", options);

  const { username } = useAuthStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-zinc-200 bg-white px-3 py-3 shadow-sm lg:px-4"
    >
      <div className="flex items-center justify-between">
        {/* Welcome Section */}
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold text-zinc-800"
          >
            Welcome, {username}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-zinc-500"
          >
            {formatted}
          </motion.p>
        </div>

        {/* Right Section (Notifications & Profile) */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex scale-90 items-center gap-5"
        >
          <NotificationCenter notifications={3} />

          {/* Profile Image */}
          <ProfileMenu />
        </motion.div>
      </div>
    </motion.header>
  );
};
