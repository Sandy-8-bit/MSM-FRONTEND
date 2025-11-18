import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import type { ServiceEntryResponse } from "@/types/transactionTypes";
import axiosInstance from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import { apiRoutes } from "@/routes/apiRoutes";

export const useCreateServiceEntry = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createEntry = async (formData: FormData) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.post(apiRoutes.serviceEntry, formData, {
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
      navigate(-1);
      toast.success("Service Entry created successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceEntry"] });
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create service entry",
        );
      } else {
        toast.error("Unexpected error occurred!");
      }
    },
  });
};

export const useFetchEntry = (page: number, limit: number) => {
  const fetchAllEntry = async (): Promise<ServiceEntryResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.serviceEntry, {
        params: {
          page: page - 1,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch machine");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch machine");
      } else {
        toast.error("Something went wrong while fetching machine");
      }
      throw new Error("Machine fetch failed");
    }
  };

  return useQuery({
    queryKey: ["serviceEntry", page, limit],
    queryFn: fetchAllEntry,
    staleTime: 0,
    retry: 1,
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  const deleteEntry = async (id: number) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(`${apiRoutes.serviceEntry}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 204) {
      throw new Error(res.data?.message || "Failed to delete service Entry");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      toast.success("Service Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceEntry"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete service Entry",
        );
      } else {
        toast.error("Something went wrong while deleting the Entry");
      }
    },
  });
};
