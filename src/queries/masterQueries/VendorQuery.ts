import axiosInstance from "../../utils/axios";
import axios from "axios";
import type { VendorDetails, VendorResponse } from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";
/**
 * -------------------------------------------
 * Branch Service Hooks - CRUD Operations
 * -------------------------------------------
 * This file contains React Query hooks to:
 *  - Fetch all branches
 *  - Create a new branch
 *  - Edit an existing branch
 *  - Delete a branch
 *
 * Handles authentication, API errors, and notifications
 */

/**
 * 🔍 Fetch all vendors
 */
export const useFetchVendors = () => {
  const fetchAllVendors = async (): Promise<VendorDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.vendorsSearch, {
        //All api routes are inside this file
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          vendorName: "",
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch vendors");
      }

      return res.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch vendors");
      } else {
        toast.error("Something went wrong while fetching vendors");
      }
      throw new Error("Vendor fetch failed"); //Force throw the error so the react query handles it
    }
  };

  return useQuery({
    queryKey: ["vendors"], //cache key
    queryFn: fetchAllVendors,
    staleTime: 1000 * 60 * 0, //expoiy time
    retry: 1,
  });
};

export const useFetchVendorOptions = () => {
  const fetchVendor = async (): Promise<DropdownOption[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.vendorsSearch, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          vendorName: "",
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Vendor options");
      }

      return res.data.data.map((vendor: VendorDetails) => ({
        id: vendor.id,
        label: vendor.vendorName,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch vendors");
      } else {
        toast.error("Something went wrong while fetching vendor options");
      }
      throw new Error("Vendor options fetch failed");
    }
  };

  return useQuery({
    queryKey: ["vendorOptions"], // lowercase for consistency
    queryFn: fetchVendor,
    retry: 1,
  });
};

//paginated vendors along with optional search function
export const useFetchVendorsPaginated = (
) => {
  const fetchAllVendors = async (): Promise<VendorResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.vendorsSearch, {
        params: {
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch vendors");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch vendors");
      } else {
        toast.error("Something went wrong while fetching vendors");
      }
      throw new Error("Vendor fetch failed");
    }
  };

  return useQuery({
    queryKey: ["vendors"],
    queryFn: fetchAllVendors,
    staleTime: 60 * 10,
    retry: 1,
  });
};

/**
 * ➕ Create a new vendor
 */
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  const createVendor = async (newVendor: VendorDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.post(apiRoutes.vendors, newVendor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create vendor");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create vendor");
      } else {
        toast.error("Something went wrong while creating vendor");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      toast.success("Vendor created successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};

/**
 * ✏️ Edit an existing vendor
 */
export const useEditVendor = () => {
  const queryClient = useQueryClient();

  const editVendor = async (updatedVendor: VendorDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { ...payload } = updatedVendor;

    const res = await axiosInstance.put(
      `${apiRoutes.vendors}/${updatedVendor.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update branch");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: editVendor,
    onSuccess: () => {
      toast.success("Vendor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    },
  });
};

/**
 * ❌ Delete a vendor
 */
export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  const deleteVendor = async (vendor: VendorDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(
      `${apiRoutes.vendors}/${vendor.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete vendor");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      toast.success("Vendor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};
