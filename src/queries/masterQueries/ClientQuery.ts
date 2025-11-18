import axiosInstance from "../../utils/axios";
import axios from "axios";
import type { ClientDetails, ClientResponse } from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";

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
export const useFetchClients = () => {
  const fetchAllClients = async (): Promise<ClientDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.clientsSearch, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
          params: {
          clientName: "",
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Clients");
      }

      return res.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch Clients");
      } else {
        toast.error("Something went wrong while fetching Clients");
      }
      throw new Error("Client fetch failed");
    }
  };

  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchAllClients,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

//paginated clients
export const useFetchClientsPaginated = () => {
  const fetchAllClients = async (): Promise<ClientResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.clientsSearch, {
        params: {

        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch clients");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch clients");
      } else {
        toast.error("Something went wrong while fetching clients");
      }
      throw new Error("Client fetch failed");
    }
  };

  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchAllClients,
    staleTime: 60*10,
    retry: 1,
  });
};

/**
 * 📋 Dropdown Options
 */
export const useFetchClientOptions = () => {
  const fetchOptions = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.clientsSearch, {
      headers: { Authorization: `Bearer ${token}` },
                params: {
          clientName: "",
        },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch clients");
    }

    return res.data.data.map((client: ClientDetails) => ({
      id: client.id,
      label: client.clientName,
    }));
  };

  return useQuery({
    queryKey: ["clientOptions"],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

/**
 * ➕ Create a new Client
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  const createClient = async (newClient: ClientDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.post(apiRoutes.clients, newClient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create Client");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create Client");
      } else {
        toast.error("Something went wrong while creating Client");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      toast.success("Client created successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

/**
 * ✏️ Edit an existing Client
 */
export const useEditClient = () => {
  const queryClient = useQueryClient();

  const editClient = async (updatedClient: ClientDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { id: clientId, ...payload } = updatedClient;

    const res = await axiosInstance.put(
      `${apiRoutes.clients}/${clientId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update Client");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: editClient,
    onSuccess: () => {
      toast.success("Client updated successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    },
  });
};

/**
 * ❌ Delete a Client
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  const deleteClient = async (client: ClientDetails) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(
      `${apiRoutes.clients}/${client.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200 && res.status !== 204) {
      throw new Error(res.data?.message || "Failed to delete Client");
    }
    console.log(res.data);
    return res.data;
  };

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success("Client deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};
