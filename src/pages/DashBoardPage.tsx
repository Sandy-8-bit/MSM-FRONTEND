import {
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { ServiceRequestSkeleton } from "@/components/common/skeletons";
import ButtonSm from "@/components/common/Buttons";
import { useAuthStore } from "@/store/useAuthStore";
import { useFetchServiceRequestsForEngineers } from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useNavigate } from "react-router-dom";
import { useFetchDashboardCounts } from "../queries/dashboardQuery";
import { appRoutes } from "@/routes/appRoutes";
import { DateInput } from "@/components/common/Input";
import { getTodayDate } from "@/utils/commonUtils";
import { useState } from "react";

const DashBoardPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const {
    data: count,
    isLoading: countLoading,
    isError: countError,
  } = useFetchDashboardCounts();

  const { role, engineer } = useAuthStore();

  const { data, isLoading, isError } = useFetchServiceRequestsForEngineers(
    engineer?.id,
  );

  // Only show skeleton when both are loading initially
  if (countLoading) {
    return <ServiceRequestSkeleton />;
  }

  const stats = [
    {
      title: "Total Machine",
      value: count?.totalMachines ?? "0",
      textColor: "text-amber-500",
      borderColor: "border-amber-500",
      icon: Wrench,
      iconBg: "bg-amber-50",
      navigateUrl: appRoutes.transactionRoutes.children.machineEntry,
    },
    {
      title: "Breakdown Machine",
      value: count?.breakdownMachines ?? "0",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      navigateUrl: appRoutes.transactionRoutes.children.serviceRequest,
    },
    {
      title: "Service Completed",
      value: count?.serviceCompleted ?? "0",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      icon: CheckCircle,
      iconBg: "bg-blue-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceRequest +
        "?status=Completed",
    },
    {
      title: "Service Pending",
      value: count?.servicePending ?? "0",
      textColor: "text-gray-500",
      borderColor: "border-gray-500",
      icon: AlertTriangle,
      iconBg: "bg-gray-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceRequest + "?status=Pending",
    },
    {
      title: "Assigned Engineers",
      value: count?.assignedEngineers ?? "0",
      textColor: "text-green-500",
      borderColor: "border-green-500",
      icon: UserCheck,
      iconBg: "bg-green-50",
      navigateUrl: "",
    },
    {
      title: "Available Engineers",
      value: count?.availableEngineers ?? "0",
      textColor: "text-purple-500",
      borderColor: "border-purple-500",
      icon: Users,
      iconBg: "bg-purple-50",
      navigateUrl: "",
    },
  ];

  const serviceStats = [
    {
      title: "Total Service Calls",
      value: count?.servicePending ?? "0",
      textColor: "text-indigo-500",
      borderColor: "border-indigo-500",
      icon: Wrench,
      iconBg: "bg-indigo-50",
      navigateUrl: "",
    },
    {
      title: "Service Completed",
      value: count?.serviceCompleted ?? "0",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      icon: CheckCircle,
      iconBg: "bg-blue-50",
      navigateUrl: "",
    },
    {
      title: "Service Pending",
      value: count?.servicePending ?? "0",
      textColor: "text-gray-500",
      borderColor: "border-gray-500",
      icon: AlertTriangle,
      iconBg: "bg-gray-50",
      navigateUrl: "",
    },
  ];

  return (
    <div className="mx-auto max-w-[1390px] self-center rounded-[24px] bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        {/* Show stats only if role is admin */}
        {role === "ADMIN" && (
          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {stats.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => item.navigateUrl && navigate(item.navigateUrl)}
                  className={`group nd:p-4 relative flex transform cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-3 transition-all duration-300 hover:scale-[1.02] active:scale-105 lg:p-6`}
                >
                  <div className="flex flex-col items-start justify-start gap-3">
                    <h3 className="text-lg leading-tight font-medium text-gray-700">
                      {item.title}
                    </h3>
                    <h4
                      className={`text-xl font-medium ${item.textColor} transition-all duration-300 ease-in-out group-hover:scale-105`}
                    >
                      {countLoading || countError ? "..." : item.value}
                    </h4>
                  </div>
                  <div
                    className={`origin-top-right scale-75 rounded-xl p-3 md:flex md:scale-100 ${item.iconBg} ${item.borderColor} border-2 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <IconComponent className={`h-6 w-6 ${item.textColor}`} />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {role === "SERVICE" && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceStats.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => item.navigateUrl && navigate(item.navigateUrl)}
                  className="group relative flex transform cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-6 transition-all duration-300 hover:scale-[1.02] active:scale-105"
                >
                  <div className="flex flex-col items-start justify-start gap-3">
                    <h3 className="text-lg leading-tight font-medium text-gray-700">
                      {item.title}
                    </h3>
                    <h4
                      className={`text-xl font-medium ${item.textColor} transition-all duration-300 ease-in-out group-hover:scale-105`}
                    >
                      {countLoading ? "..." : item.value}
                    </h4>
                  </div>
                  <div
                    className={`hidden rounded-xl p-3 md:flex ${item.iconBg} ${item.borderColor} border-2 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <IconComponent className={`h-6 w-6 ${item.textColor}`} />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {role === "SERVICE" && (
          <section>
            <div className="flex flex-col gap-3 rounded-lg bg-white p-5 shadow-md">
              {/* Service Requests Section */}
              <div className="flex w-full flex-row items-center justify-between">
                <div className="flex w-fit flex-col gap-0">
                  <h1 className="mb-2 w-fit text-xl font-bold text-gray-900 md:text-3xl">
                    Service Requests
                  </h1>
                </div>

                <div className="flex w-full items-center justify-end gap-3">
                  <div className="flex max-w-[350px] justify-end">
                    <DateInput
                      title=""
                      value={selectedDate}
                      onChange={setSelectedDate}
                      name="serviceDate"
                    />
                  </div>
                </div>
              </div>

              {/* Service request rendering with proper loading and error handling */}
              <div className="flex flex-col gap-6">
                {isLoading ? (
                  <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-700">
                    Loading service requests...
                  </div>
                ) : isError ||
                  !data ||
                  (Array.isArray(data) && data.length === 0) ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-yellow-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.444a1 1 0 00-.364 1.118l1.287 3.947c.3.921-.755 1.688-1.538 1.118l-3.36-2.444a1 1 0 00-1.175 0l-3.36 2.444c-.783.57-1.838-.197-1.538-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.075 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700">
                      No work today!
                    </h3>
                    <p className="text-sm text-gray-500">
                      You don't have any assigned service requests today. Enjoy
                      your free time 😊
                    </p>
                  </div>
                ) : (
                  data.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border border-slate-300 bg-white p-3 transition-all duration-300"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-center justify-between">
                          {/* Request Details */}
                          <div className="flex flex-col gap-1">
                            <header className="mb-3 flex items-center gap-3">
                              <h1 className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-500">
                                {request.referenceNumber}
                              </h1>
                              <span className="font-medium text-gray-600">
                                {request.clientName}
                              </span>
                            </header>
                            <section className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Machine:</span>{" "}
                                {request.machineType}
                              </span>
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Brand:</span>{" "}
                                {request.brand} {request.modelNumber}
                              </span>
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Serial No:</span>{" "}
                                {request.serialNumber}
                              </span>
                            </section>
                          </div>
                          <footer className="flex h-min flex-col gap-3 md:flex-row">
                            <ButtonSm
                              className="font-medium text-white"
                              text="View"
                              state="default"
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/transactions/service-entry/create/${request.id}?mode=create`,
                                )
                              }
                            />
                          </footer>
                        </div>

                        {/* Complaint details */}
                        {request.complaintDetails && (
                          <section className="mt-3 rounded-lg border-l-4 border-orange-400 bg-slate-100 p-3">
                            <p className="text-sm font-medium text-gray-700">
                              <span className="font-semibold text-orange-600">
                                Complaint:
                              </span>{" "}
                              {request.complaintDetails}
                            </p>
                          </section>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DashBoardPage;
