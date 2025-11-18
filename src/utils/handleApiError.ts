import axios from "axios";
import { toast } from "react-toastify";

/**
 * Global error handler for API failures.
 *
 * @param error The raw error thrown (usually from Axios)
 * @param context A human-readable name for the API (e.g. "Resignation", "Contact Profile")
 */
export function handleApiError(error: unknown, context = "Something"): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Unknown error";

    switch (status) {
      case 400:
        toast.error(`${context} request is invalid.`);
        break;
      case 401:
        toast.error("Unauthorized. Please login again.");
        break;
      case 403:
        toast.error(
          `You don't have permission for this ${context.toLowerCase()}.`,
        );
        break;
      case 404:
        toast.error(`${context} not found.`);
        break;
      case 500:
        toast.error(`Server error. Cannot ${context.toLowerCase()}.`);
        break;
      default:
        toast.error(`${context} failed: ${message}`);
    }

    // 🔁 rethrow for react-query to capture
    throw new Error(`[${context}] ${message}`);
  } else {
    toast.error(`Unknown error in ${context}`);
    throw new Error(`[${context}] Unexpected error`);
  }
}
