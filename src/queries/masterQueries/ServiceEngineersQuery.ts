import axiosInstance from "../../utils/axios";
import axios from "axios";
import type {
  
  ServiceEngineerDetails
} from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";

import type {ServiceEngineerResponse} from "../../types/masterApiTypes";
/**
 * -------------------------------------------
 * Client Service Hooks - CRUD Operations
 * -------------------------------------------
 * This file contains React Query hooks to:
 *  - Fetch all Clients
 *  - Create a new Client
 *  - Edit an existing Client
 *  - Delete a Client
 *
 * Handles authentication, API errors, and notifications
 */

/**
 * 🔍 Fetch all Clients
 */


export const useFetchServiceEngineers = () => {
  const fetchAllServiceEngineers = async (): Promise<ServiceEngineerResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.usersSearch, {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch service engineers");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch service engineers");
      } else {
        toast.error("Something went wrong while fetching service engineers");
      }
      throw new Error("Service engineer fetch failed");
    }
  };

  return useQuery({
    queryKey: ["serviceEngineers"],
    queryFn: fetchAllServiceEngineers,
    staleTime: 10*60,
    retry: 1,
  });
};

export const useFetchServiceEngineerOptions = () => {
  const fetchAllServiceEngineers = async (): Promise<DropdownOption[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.usersSearch, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          engineerName: "",
        }
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch service engineers");
      }

      return res.data.data.map((engineer: ServiceEngineerDetails) => ({
        id: engineer.id,
        label: engineer.engineerName,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch service engineers");
      } else {
        toast.error("Something went wrong while fetching service engineers");
      }
      throw new Error("Service engineer fetch failed");
    }
  };

  return useQuery({
    queryKey: ["serviceEngineersOptions"],
    queryFn: fetchAllServiceEngineers,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

/**
 * ➕ Create a new Problem
 */
export const useCreateServiceEngineer = () => {
  const queryClient = useQueryClient();

  const createServiceEngineer = async (newServiceEngineer: ServiceEngineerDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.post(apiRoutes.users, newServiceEngineer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create Service Engineer");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create Service Engineer",
        );
      } else {
        toast.error("Something went wrong while creating Service Engineer");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createServiceEngineer,
    onSuccess: () => {
      toast.success("Service Engineer created successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceEngineers"] });
    },
  });
};

/**
 * ✏️ Edit an existing Service Engineer
 */
export const useEditServiceEngineer = () => {
  const queryClient = useQueryClient();

  const editServiceEngineer = async (updatedServiceEngineer: ServiceEngineerDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { id: engineerId, ...payload } = updatedServiceEngineer;
    
    const res = await axiosInstance.put(
      `${apiRoutes.users}/${engineerId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update Problem");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: editServiceEngineer,
    onSuccess: () => {
      toast.success("Service Engineer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceEngineers"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    },
  });
};

/**
 * ❌ Delete a Service Engineer
 */
export const useDeleteServiceEngineer = () => {
  const queryClient = useQueryClient();

  const deleteServiceEngineer = async (engineer: ServiceEngineerDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(
      `${apiRoutes.users}/${engineer.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete Service Engineer");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteServiceEngineer,
    onSuccess: () => {
      toast.success("Service Engineer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceEngineers"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};
