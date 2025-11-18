import axiosInstance from "../../utils/axios";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { apiRoutes } from "../../routes/apiRoutes";
import type {
  ServiceRequest,
  ServiceRequestPayload,
  ServiceRequestResponse,
} from "../../types/transactionTypes";

/**
 * 🔍 Fetch all Service Requests
 */
export const useFetchServiceRequests = (
  page: number,
  limit: number,
  selectedStatus: string | null = null,
) => {
  const fetchAllRequests = async (): Promise<ServiceRequestResponse> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const statusMap: Record<string, string> = {
      Completed: "COMPLETED",
      Pending: "PENDING",
      "Not Completed": "NOT_COMPLETED",
    };

    const statusParam =
      selectedStatus && statusMap[selectedStatus]
        ? statusMap[selectedStatus]
        : undefined;

    const res = await axiosInstance.get(apiRoutes.serviceRequest + "/filter", {
      params: {
        page: page - 1,
        limit,
        status: statusParam,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch service requests");
    }

    return {
      data: res.data.data,
      page: res.data.page,
      totalPages: res.data.totalPages,
      totalRecords: res.data.totalRecords,
    };
  };

  return useQuery({
    queryKey: ["serviceRequest", page, limit, selectedStatus],
    queryFn: fetchAllRequests,
    staleTime: 0,
    retry: 1,
  });
};

//............For engineers...........//

export const useFetchServiceRequestsForEngineers = (
  serviceEngineerId?: number,
) => {
  const fetchAllRequests = async (): Promise<ServiceRequest[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.get(apiRoutes.employeeServiceRequest, {
      params: {
        serviceEngineerId: serviceEngineerId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch service requests");
    }
    console.log(res.data);
    return res.data;
  };

  return useQuery({
    queryKey: ["serviceRequest", serviceEngineerId],
    queryFn: fetchAllRequests,
    enabled: !!serviceEngineerId,
    staleTime: 0,
    retry: 1,
  });
};

export const useFetchServiceRequestById = (id: number) => {
  const fetchServiceRequestByID = async (): Promise<ServiceRequest> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.get(`${apiRoutes.serviceRequest}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch service requests");
    }
    return res.data.data;
  };

  return useQuery({
    queryKey: ["serviceRequest", id],
    enabled: !!id,

    queryFn: fetchServiceRequestByID,
    staleTime: 0,
    retry: 1,
  });
};
/**
 * ➕ Create a new Service Request
 */
export const useCreateServiceRequest = () => {
  const queryClient = useQueryClient();

  const createRequest = async (requestData: ServiceRequestPayload) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.post(
      apiRoutes.serviceRequest,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(res.data?.message || "Failed to create Service Request");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast.success("Service Request created successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create service request",
        );
      }
    },
  });
};

// --- edit ----
export const useEditServiceRequest = () => {
  const queryClient = useQueryClient();

  const editServiceRequest = async ({
    updatedRequest,
    id,
  }: {
    updatedRequest: ServiceRequestPayload;
    id: number;
  }) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.put(
      `${apiRoutes.serviceRequest}/${id}`,
      updatedRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update Service Request");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: editServiceRequest,
    onSuccess: () => {
      toast.success("Service Request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      } else {
        toast.error("Something went wrong while updating the request");
      }
    },
  });
};

export const usePatchServiceRequest = () => {
  const queryClient = useQueryClient();

  const editServiceRequest = async ({
    engineerId,
    id,
  }: {
    engineerId: number;
    id: number;
  }) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axiosInstance.patch(
      `${apiRoutes.serviceRequest}/${id}`,
      { engineerId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update Service Request");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: editServiceRequest,
    onSuccess: () => {
      toast.success("Service Request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      } else {
        toast.error("Something went wrong while updating the request");
      }
    },
  });
};

// ------ delete ---------
export const useDeleteServiceRequest = () => {
  const queryClient = useQueryClient();

  const deleteRequest = async (id: number) => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(
      `${apiRoutes.serviceRequest}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete service request");
    }

    return res.data;
  };

  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      toast.success("Service request deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete service request",
        );
      } else {
        toast.error("Something went wrong while deleting the request");
      }
    },
  });
};
