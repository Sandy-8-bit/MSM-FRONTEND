import axiosInstance from "../../utils/axios";
import axios from "axios";
import type {
  ProductDetails,
  ProductResponse,
} from "../../types/masterApiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import Cookies from "js-cookie";
import type { DropdownOption } from "@/components/common/DropDown";

/**
 * 🔍 Fetch all Products
 */
export const useFetchProducts = () => {
  const fetchAllProducts = async (): Promise<ProductDetails[]> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.productsSearch, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          machineType: "",
        }
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Products");
      }

      return res.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch Products",
        );
      } else {
        toast.error("Something went wrong while fetching Products");
      }
      throw new Error("Product fetch failed");
    }
  };

  return useQuery({
    queryKey: ["Products"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

/**
 * 🔍 Fetch Product Type
 */
export const useFetchProductsType = () => {
  const fetchOptions = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.productsSearch, {
      headers: { Authorization: `Bearer ${token}` },
              params: {
          machineType: "",
        }
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: client.machineType,
    }));
  };

  return useQuery({
    queryKey: ["productOptions"],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchBrandsOptions = () => {
  const fetchBrand = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.productsSearch, {
      headers: { Authorization: `Bearer ${token}` },
              params: {
          machineType: "",
        }
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: client.brand,
    }));
  };

  return useQuery({
    queryKey: ["Products"],
    queryFn: fetchBrand,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchModelsOptions = () => {
  const fetchModel = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.productsSearch, {
      headers: { Authorization: `Bearer ${token}` },
              params: {
          machineType: "",
        }
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: client.modelNumber,
    }));
  };

  return useQuery({
    queryKey: ["Products"],
    queryFn: fetchModel,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

export const useFetchAllDetailsOptions = () => {
  const fetchAllDetail = async (): Promise<DropdownOption[]> => {
    const token = Cookies.get("token");
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.productsSearch, {
      headers: { Authorization: `Bearer ${token}` },
              params: {
          machineType: "",
        }
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch products options");
    }

    return res.data.data.map((client: ProductDetails) => ({
      id: client.id,
      label: `${client.modelNumber}, ${client.machineType}, ${client.brand}`,
    }));
  };

  return useQuery({
    queryKey: ["Products"],
    queryFn: fetchAllDetail,
    staleTime: 1000 * 60 * 0,
    retry: 1,
  });
};

// Paginated response
export const useFetchProductsPaginated = () => {
  const fetchAllProducts = async (): Promise<ProductResponse> => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.productsSearch, {
        headers: { Authorization: `Bearer ${token}` },
       
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch Products");
      }

      return {
        data: res.data.data,
        page: res.data.page,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to fetch Products",
        );
      } else {
        toast.error("Something went wrong while fetching Products");
      }
      throw new Error("Product fetch failed");
    }
  };

  return useQuery({
    queryKey: ["Products"],
    queryFn: fetchAllProducts,
    staleTime: 10*60,
    retry: 1,
  });
};

/**
 * ➕ Create a new Product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const createProduct = async (newProduct: ProductDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.post(apiRoutes.products, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create Product");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create Product",
        );
      } else {
        toast.error("Something went wrong while creating Product");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
};

/**
 * ✏️ Edit an existing Product
 */
export const useEditProduct = () => {
  const queryClient = useQueryClient();

  const editProduct = async (updatedProduct: ProductDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const { id, ...payload } = updatedProduct;

      const res = await axiosInstance.put(
        `${apiRoutes.products}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to update Product");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update Product",
        );
      } else {
        toast.error("Something went wrong while updating Product");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
};

/**
 * ❌ Delete a Product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const deleteProduct = async (product: ProductDetails) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.delete(
        `${apiRoutes.products}/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to delete Product");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete Product",
        );
      } else {
        toast.error("Something went wrong while deleting Product");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
};

/**
 * 📥 Import Products from Excel
 */
export const useImportProduct = () => {
  const queryClient = useQueryClient();

  const importProduct = async (file: File) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post(apiRoutes.products + "/import", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to import Products");
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to import Products",
        );
      } else {
        toast.error("Something went wrong while importing Products");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: importProduct,
    onSuccess: () => {
      toast.success("Products imported successfully");
      queryClient.invalidateQueries({ queryKey: ["Products"] });
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

      const res = await axiosInstance.get(apiRoutes.products + "/template", {
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
    enabled: false, // Disabled by default, will be triggered manually
    retry: 1,
  });
};
type ProductDropdownParams = {
  level: "brands" | "models";
  type: string;
  brand?: string;
  model?: string;
};
const getProductDropdownOptions = async ({
  level,
  type,
  brand,
}: ProductDropdownParams): Promise<DropdownOption[]> => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized");

  const endpoint = `/api/admin/products/${level}`;
  const params: Record<string, string> = { type };
  if (brand) params.brand = brand;

  const res = await axiosInstance.get(endpoint, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    throw new Error(res.data?.message || `Failed to fetch ${level}`);
  }

  const rawData = res.data.data;

  if (level === "models") {
    return (rawData as { productId: string; modelNumber: number }[]).map(
      (item) => ({
        id: Number(item.productId),
        label: item.modelNumber.toString(),
      }),
    );
  } else {
    return (rawData as string[]).map((item, idx) => ({
      id: idx + 1,
      label: item,
    }));
  }
};

export const useFetchProductDropdownOptions = (
  params: ProductDropdownParams,
) => {
  const { level, type, brand } = params;

  console.log("Dropdown Query Triggered:", params);

  return useQuery({
    queryKey: ["ProductDropdown", level, type, brand],
    queryFn: () => getProductDropdownOptions(params),
    staleTime: 0,
    retry: 1,
    enabled: !!type && !!level && (level !== "models" || !!brand),
  });
};