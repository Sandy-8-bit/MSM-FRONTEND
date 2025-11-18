import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import type { UserDetails, UserTabel } from "@/types/userTypes";
import axiosInstance from "@/utils/axios";
import { apiRoutes } from "@/routes/apiRoutes";

export const useCreateServiceEntry = () => {
  const queryClient = useQueryClient();

  const createEntry = async (formData: UserDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.post(apiRoutes.signup, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(res.data?.message || "Failed to create Service Entry");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["userTabel"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create User");
      } else {
        toast.error("Unexpected error occurred!");
      }
    },
  });
};

export const useFetchUsers = () => {
  const fetchAllUsers = async (): Promise<UserTabel> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.userTabel, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch userTabel");
      }

  return res.data.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch userTabel",
        );
      } else {
        toast.error("Something went wrong while fetching userTabel");
      }
      throw new Error("Problem fetch failed");
    }
  };

  return useQuery({
    queryKey: ["userTabel"],
    queryFn: fetchAllUsers,
    staleTime: 10 * 60,
    retry: 1,
  });
};
