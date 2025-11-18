// File: src/pages/AuthPage.tsx

import { useEffect, useState } from "react";
import Input from "../components/common/Input";
import { useSignInMutation } from "../queries/signInQuery";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../routes/appRoutes";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { Loader } from "lucide-react";
import { Spinner } from "@/components/layout/Spinner";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess } = useSignInMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate(appRoutes.dashboardPage, { replace: true });
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return toast.error("Username and password are required");
    }

    mutate({ username, password });
  };

  return (
    <div className="flex min-h-screen w-full justify-center lg:h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-8 md:w-1/2 md:px-8 lg:py-0">
        {/* Mobile: Add top padding to center content better */}
        <div className="flex w-full max-w-sm flex-col gap-2 sm:max-w-md md:w-[400px]">
          <div className="mb-6 flex w-full flex-col text-center md:mb-3">
            <motion.div
              className="relative mb-6 flex max-w-full flex-col items-start justify-center py-4 md:mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="container flex w-max flex-col items-center">
                <motion.img
                  src="/icons/logo-icon-side-nav.svg"
                  alt="Logo"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="h-12 w-12 sm:h-16 sm:w-16"
                />
                <motion.p
                  className="orange-gradient absolute bottom-1.5 rounded px-1.5 py-1 text-[10px] font-normal text-white"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.4, type: "tween", stiffness: 200 }}
                >
                  MSM
                </motion.p>
              </div>
            </motion.div>
            <p className="text-start text-sm font-medium text-gray-500 sm:text-base">
              Please sign in!
            </p>
            <h2 className="head mt-1 text-start text-xl font-medium sm:text-2xl">
              Welcome to MSM
            </h2>
          </div>

          <div className="w-full">
            <form
              className="flex w-full flex-col gap-4 sm:gap-3"
              onSubmit={handleSubmit}
            >
              <Input
                type="str"
                name="email"
                placeholder="Enter your username or email"
                title="Email"
                inputValue={username}
                onChange={setUsername}
              />

              <div className="relative w-full self-stretch">
                <h3 className="mb-1 w-full justify-start text-xs leading-loose font-semibold text-slate-700 sm:mb-0.5">
                  Password
                </h3>
                <div className="parent-input-wrapper flex cursor-text items-center justify-between overflow-clip rounded-xl border-2 border-slate-300 bg-white px-3 py-3 transition-all autofill:bg-blue-500 focus-within:border-slate-500 sm:py-2.5">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 cursor-pointer text-slate-500 transition-transform hover:text-blue-600 focus:outline-none active:scale-95"
                  >
                    <img
                      src={
                        showPassword
                          ? "/icons/eye-icon.svg"
                          : "/icons/eye-off-icon.svg"
                      }
                      alt={showPassword ? "Hide Password" : "Show Password"}
                      className="h-6 w-6"
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-[16px] bg-blue-500 px-3.5 py-3.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-40 sm:mt-0 sm:py-3"
                disabled={isPending || !username || !password}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="bg-primary relative hidden w-1/2 items-center justify-center lg:flex">
        <div className="texts absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-[60px] leading-[60px] font-medium text-[#00b3fa] mix-blend-difference xl:text-[80px] xl:leading-[80px]">
          Reliable <br /> Fast <br /> Smart.
        </div>
        <img
          src="./images/sign-in-image.webp"
          alt="Login art"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
      </div>
    </div>
  );
};

export default AuthPage;
