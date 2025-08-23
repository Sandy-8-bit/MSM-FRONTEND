import axiosInstance from "../../utils/axios";
import axios from "axios";
import type {
  ProblemDetails
  
} from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";

import type {ProblemResponse} from "../../types/masterApiTypes";
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


export const useFetchProblem = () => {
  const fetchAllProblem = async (): Promise<ProblemResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.problemDetailsSearch, {
        params: {

        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch problems");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch problems");
      } else {
        toast.error("Something went wrong while fetching problems");
      }
      throw new Error("Problem fetch failed");
    }
  };

  return useQuery({
    queryKey: ["problem"],
    queryFn: fetchAllProblem,
    staleTime: 10*60,
    retry: 1,
  });
};

export const useFetchProblemOptions = () => {
  const fetchAllProblem = async (): Promise<DropdownOption[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.problemDetailsSearch, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          problemType: "",
        }
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Problems");
      }

      return res.data.data.map((machine: ProblemDetails) => ({
        id: machine.id,
        label: machine.problemType,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch Problems");
      } else {
        toast.error("Something went wrong while fetching Problems");
      }
      throw new Error("Problems fetch failed");
    }
  };

  return useQuery({
    queryKey: ["problem"],
    queryFn: fetchAllProblem,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

/**
 * ➕ Create a new Problem
 */
export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  const createProblem = async (newProblem : ProblemDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.post(apiRoutes.problemDetails, newProblem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create Machine");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create Problem",
        );
      } else {
        toast.error("Something went wrong while creating Problem");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      toast.success("Problem created successfully");
      queryClient.invalidateQueries({ queryKey: ["problem"] });
    },
  });
};

/**
 * ✏️ Edit an existing Problem
 */
export const useEditProblem = () => {
  const queryClient = useQueryClient();

  const editProblem = async (updatedProblem: ProblemDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { id: problemId, ...payload } = updatedProblem;

    const res = await axiosInstance.put(
      `${apiRoutes.problemDetails}/${problemId}`,
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
    mutationFn: editProblem,
    onSuccess: () => {
      toast.success("Problem updated successfully");
      queryClient.invalidateQueries({ queryKey: ["problem"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    },
  });
};

/**
 * ❌ Delete a Problem
 */
export const useDeleteProblem = () => {
  const queryClient = useQueryClient();

  const deleteProblem = async (problem: ProblemDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(
      `${apiRoutes.problemDetails}/${problem.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete Problem");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteProblem,
    onSuccess: () => {
      toast.success("Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["problem"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};
