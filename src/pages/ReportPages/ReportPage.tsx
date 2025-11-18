import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/routes/appRoutes";
import PageHeader from "@/components/masterPage.components/PageHeader";
import ConfigCard from "@/components/common/ConfigCard"; // Make sure path is correct

const ReportsDashboard = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const navigate = useNavigate();

  const masterReports = [
    {
      id: "customer",
      title: "Customer Wise",
      description:
        "Detailed reports organized by customer accounts and services",
      imgUrl: "/icons/Master/Clients.svg", // ✅ Replace with actual image paths
      route: appRoutes.reportRoutes.children.customerWise,
    },
    // {
    //   id: 'machine',
    //   title: 'Machine Model Wise',
    //   description: 'Reports categorized by machine models and types',
    //   imgUrl: '/icons/machine.png',
    //   route: appRoutes.reportRoutes.children.machineModelWise,
    // },
    // {
    //   id: 'technician',
    //   title: 'Technician Wise',
    //   description: 'Performance and activity reports by technician',
    //   imgUrl: '/icons/technician.png',
    //   route: appRoutes.reportRoutes.children.technicianWise,
    // },
    // {
    //   id: 'spares',
    //   title: 'Spare Parts Wise',
    //   description: 'Inventory and usage reports for spare parts',
    //   imgUrl: '/icons/spares.png',
    //   route: appRoutes.reportRoutes.children.sparesWise,
    // },
  ];

  const handleCardClick = (report: (typeof masterReports)[0]) => {
    setSelectedReport(report.id);
    navigate(report.route);
  };

  return (
    <div className="min-h-screen rounded-lg">
      {/* Page Header */}
      {/* <div className="mb-8 px-6">
        <PageHeader title="Reports" />
        <p className="text-md text-gray-600">
          Generate and view comprehensive business reports
        </p>
      </div> */}

      {/* Master Reports Section */}
      {/* <h2 className="px-6 text-xl font-semibold text-gray-800">
        Master Reports
      </h2> */}

      <div className="">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {masterReports.map((report) => (
            <ConfigCard
              key={report.id}
              img={report.imgUrl}
              btnText="View"
              title={report.title}
              desc={report.description}
              onAction={() => handleCardClick(report)}
            />
          ))}
        </div>
      </div>

      {/* Selected Report Info */}
      {selectedReport && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Selected:{" "}
              {masterReports.find((r) => r.id === selectedReport)?.title}
            </h3>
          </div>
          <p className="mb-4 text-gray-600">
            You have selected the{" "}
            <strong>
              {masterReports
                .find((r) => r.id === selectedReport)
                ?.title.toLowerCase()}
            </strong>{" "}
            report. You are now being redirected to the detailed view.
          </p>
          <button
            onClick={() => setSelectedReport(null)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;
