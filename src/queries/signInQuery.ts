import { useMutation } from "@tanstack/react-query";
import type {
  signInRequestType,
  SignInResponseType,
} from "../types/authApiTypes";
import axios from "axios";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import { SignInSchema } from "../utils/validationSchema";
import { ZodError } from "zod";
import { apiRoutes } from "../routes/apiRoutes";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";

const signInRequest = async (
  data: signInRequestType,
): Promise<SignInResponseType> => {
  try {
    const parsed = SignInSchema.parse(data);
    const response = await axiosInstance.post(apiRoutes.signin, parsed);

    if (response.status === 200) {
      Cookies.set("token", response.data.token, {
        expires: 1,
        secure: import.meta.env.VITE_MODE === "production",
        sameSite: "strict",
        path: "/",
      });

      toast.success("Sign-in successful!");
      return response.data;
    } else {
      throw new Error(response.data?.message || "Login failed");
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const firstError = error.errors?.[0]?.message ?? "Invalid input";
      toast.error(firstError);
    } else if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } else {
      toast.error("Something went wrong during sign-in");
    }
    throw error;
  }
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: signInRequest,
    onSuccess: (res) => {
      useAuthStore.getState().setAuthData({
        token: res.token,
        username: res.username,
        role: res.role,
        engineer: res.engineer,
      });
    },
  });
};
