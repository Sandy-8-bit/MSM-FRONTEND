import { apiRoutes } from "@/routes/apiRoutes";
import type { DashboardStats } from "@/types/types";
import axiosInstance from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

/**
 * 🔍 Fetch all DashBoard
 */

export const useFetchDashboardCounts = () => {
  const DashBoardPage = async (): Promise<DashboardStats> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.dashboard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch dashboardCounts");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch dashboardCounts",
        );
      } else {
        toast.error("Something went wrong while fetching dashboardCounts");
      }
      throw new Error("dashboardCounts fetch failed");
    }
  };

  return useQuery({
    queryKey: ["dashboardCounts"],
    queryFn: DashBoardPage,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};
