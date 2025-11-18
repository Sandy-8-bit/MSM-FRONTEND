import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axios";
import { apiRoutes } from "@/routes/apiRoutes";

interface ReportParams {
  clientName?: string;
  model?: string;
  serviceDate?: string;
  technician?: string;
  complaint?: string;
  status?: string;
}

export const useGenerateReportPDF = () => {
  const queryClient = useQueryClient();

  const generatePDF = async ({
    params,
    isViewOnly,
  }: {
    params: ReportParams;
    isViewOnly: boolean;
  }) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized to perform this action.");

      const res = await axiosInstance.get(apiRoutes.customerWise, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      if (isViewOnly) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ServiceReport.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to generate report",
        );
      } else {
        toast.error("Something went wrong while generating the report");
      }
      throw error;
    }
  };

  return useMutation({
    mutationFn: generatePDF,
    onSuccess: () => {
      toast.success("PDF Report Generated");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
