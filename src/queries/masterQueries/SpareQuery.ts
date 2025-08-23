import axiosInstance from "../../utils/axios";
import axios from "axios";
import type { SpareDetails, SpareResponse } from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";
/**
 * -------------------------------------------
 * Department Service Hooks - CRUD Operations
 * -------------------------------------------
 */

/**
 * 🔍 Fetch all spares
 */
export const useFetchSpares = () => {
  const fetchAllSpares = async (): Promise<SpareDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.machineSparesSearch, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          spareName: "",
        }
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch spares");
      }

      return res.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch spares");
      } else {
        toast.error("Something went wrong while fetching spares");
      }
      throw new Error("Spare fetch failed");
    }
  };

  return useQuery({
    queryKey: ["spares"],
    queryFn: fetchAllSpares,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchSparesOptions = () => {
  const fetchAllSpares = async (): Promise<DropdownOption[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.machineSparesSearch, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          spareName: "",
        }
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch spares");
      }

      return res.data.data.map((spare: SpareDetails) => ({
        id: spare.id,
        label: spare.spareName,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch spares");
      } else {
        toast.error("Something went wrong while fetching spares");
      }
      throw new Error("Spare fetch failed");
    }
  };

  return useQuery({
    queryKey: ["spares"],
    queryFn: fetchAllSpares,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchSparesPaginated = () => {
  const fetchAllSpares = async (): Promise<SpareResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.machineSparesSearch, {

        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch spares");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch spares");
      } else {
        toast.error("Something went wrong while fetching spares");
      }
      throw new Error("Spare fetch failed");
    }
  };

  return useQuery({
    queryKey: ["spares"],
    queryFn: fetchAllSpares,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

/**
 * ➕ Create a new spare
 */
export const useCreateSpare = () => {
  const queryClient = useQueryClient();

  const createSpare = async (newSpare: SpareDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");
      const res = await axiosInstance.post(apiRoutes.machineSpares, newSpare, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (![200, 201].includes(res.status)) {
        throw new Error(res.data?.message || "Failed to create Spare");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create Spare");
      } else {
        toast.error("Something went wrong while creating Spare");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createSpare,
    onSuccess: () => {
      toast.success("Spare created successfully");
      queryClient.invalidateQueries({ queryKey: ["spares"] });
    },
  });
};

/**
 * ✏️ Edit an existing spare
 */
export const useEditSpare = () => {
  const queryClient = useQueryClient();

  const editSpare = async (updatedSpare: SpareDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { id } = updatedSpare;

    const res = await axiosInstance.put(
      `${apiRoutes.machineSpares}/${id}`,
      {
        ...updatedSpare,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update spare");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: editSpare,
    onSuccess: () => {
      toast.success("Spare updated successfully");
      queryClient.invalidateQueries({ queryKey: ["spares"] });
    },
  });
};


/**
 * ❌ Delete a spare
 */
export const useDeleteSpare = () => {
  const queryClient = useQueryClient();

  const deleteSpare = async (id: number) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(`${apiRoutes.machineSpares}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete spare");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteSpare,
    onSuccess: () => {
      toast.success("Spare deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["spares"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};


/**
 * 📥 Import spares from Excel
 */
export const useImportSpares = () => {
  const queryClient = useQueryClient();

  const importSpares = async (file: File) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post(apiRoutes.machineSpares + "/import", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to import spares");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to import spares",
        );
      } else {
        toast.error("Something went wrong while importing Products");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: importSpares,
    onSuccess: () => {
      toast.success("Spares imported successfully");
      queryClient.invalidateQueries({ queryKey: ["spares"] });
    },
  });
};

/**
 * 📥 Download Sample Template
 */
export const useDownloadTemplate = () => {
  const downloadTemplate = async (): Promise<Blob> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.machineSpares + "/template", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Ensure the response is treated as a binary blob
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to download template");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to download template",
        );
      } else {
        toast.error("Something went wrong while downloading template");
      }
      throw error;
    }
  };

  return useQuery({
    queryKey: ["template"],
    queryFn: downloadTemplate,
    enabled: false, 
    retry: 1,
  });
};