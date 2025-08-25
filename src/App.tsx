import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { Spinner } from "./components/layout/Spinner";
import { appRoutes } from "./routes/appRoutes";
import { ErrorPageContent } from "./pages/ErrorPage";
import ServiceEntryNew from "./pages/Transaction/serviceEntry/ServiceEntryNew";
import ServicePages from "./pages/ServicePages/ServicePages";
import CustomerReport from "./pages/ReportPages/CustomerReport";
import MachineModelReports from "./pages/ReportPages/MachineModelReports";
import SpareReports from "./pages/ReportPages/SpareReports";
import TechnicianReport from "./pages/ReportPages/TechnicianReport";
import UserCreate from "./pages/Users/UserCreate";


// 🌐 Global Pages
const SignInPage = lazy(() => import("./pages/SignInPage"));
const DashBoardPage = lazy(() => import("./pages/DashBoardPage"));

// 🧾 Report Pages
const Report = lazy(() => import("./pages/ReportPages/ReportPage"));

// 👥 User Management
const UsersPage = lazy(() => import("./pages/Users/UsersPage"));

// 🔐 Master Pages
const MasterPage = lazy(() => import("./pages/MasterPages/MasterPage"));
const ClientsPage = lazy(() => import("./pages/MasterPages/Client/ClientPage"));
const ProductsPage = lazy(
  () => import("./pages/MasterPages/Product/ProductPage"),
);
const VendorsPage = lazy(() => import("./pages/MasterPages/Vendor/VendorPage"));
const SparesPage = lazy(() => import("./pages/MasterPages/Spares/SparesPage"));
const ProblemPage = lazy(
  () => import("./pages/MasterPages/Problem/ProblemPage"),
);
const ServiceEngineerPage = lazy(
  () => import("./pages/MasterPages/ServiceEngineers/ServiceEngineersPage"),
);

// 🔁 Transaction Pages
const TransactionPage = lazy(
  () => import("./pages/Transaction/TransactionPage"),
);
const MachineEntry = lazy(
  () => import("./pages/Transaction/machineEntry/MachineEntries"),
);
const ServiceRequest = lazy(
  () => import("./pages/Transaction/serviceRequest/ServiceRequest"),
);
const ServiceEntryPage = lazy(
  () => import("./pages/Transaction/serviceEntry/ServiceEntry"),
);
const RequestEntry = lazy(
  () => import("./pages/Transaction/serviceEntry/ServiceEntryForm"),
);

// 📷 QR Pages
const QRScanner = lazy(() => import("./pages/QR/ScanQr"));

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Routes>
        {/*-------------------------------- 🌐 Auth Routes */}
        <Route path={appRoutes.signInPage} element={<SignInPage />} />
        <Route
          path="/"
          element={<Navigate to={appRoutes.dashboardPage} replace />}
        />

        {/*-------------------------------- ❌ Catch-all 404 Route */}
        <Route
          path="*"
          element={
            <ErrorPageContent
              onRefresh={() => window.location.reload()}
              error={new Error("Page Not found")}
            />
          }
        />

        {/*-------------------------------- 🛡️ Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/*-------------------------------- 📊 Dashboard */}
            <Route path={appRoutes.dashboardPage} element={<DashBoardPage />} />
            <Route path={appRoutes.dashboard} element={<DashBoardPage />} />

            {/*-------------------------------- 🧾 Reports */}
            <Route
              path={appRoutes.reportRoutes.reportPage}
              element={<Report />}
            />

            {/*-------------------------------- 👥 Users */}
            <Route
              path={appRoutes.userRoutes.userPage}
              element={<UsersPage />}
            />

            {/*-------------------------------- 🧱 Master Config Pages */}
            <Route
              path={appRoutes.masterRoutes.masterPage}
              element={<MasterPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.clients}
              element={<ClientsPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.products}
              element={<ProductsPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.vendors}
              element={<VendorsPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.machineSpares}
              element={<SparesPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.problemDetails}
              element={<ProblemPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.users}
              element={<ServiceEngineerPage />}
            />

            {/*-------------------------------- 🔁 Transaction Pages */}
            <Route
              path={appRoutes.transactionRoutes.transcationPage}
              element={<TransactionPage />}
            />
            <Route
              path={appRoutes.transactionRoutes.children.machineEntry}
              element={<MachineEntry />}
            />
            <Route
              path={appRoutes.transactionRoutes.children.serviceRequest}
              element={<ServiceRequest />}
            />
            <Route
              path={appRoutes.transactionRoutes.children.serviceEntry}
              element={<ServiceEntryPage />}
            />
            <Route
              path={appRoutes.transactionRoutes.children.serviceEntryCreate}
              element={<RequestEntry />}
            />
            {/* <Route
              path={appRoutes.transactionRoutes.children.serviceEntryView}
              element={<ServiceEntryDisplay />}
            /> */}

            <Route 
            path={appRoutes.transactionRoutes.children.serviceEntryNew}
            element={<ServiceEntryNew/>}
            />
            
            <Route
            path={appRoutes.ServiceRoutes.servicePage}
            element={<ServicePages/>}
            />

            <Route 
            path={appRoutes.reportRoutes.children.customerWise}
            element={<CustomerReport/>}
            />
                        <Route 
            path={appRoutes.reportRoutes.children.machineModelWise}
            element={<MachineModelReports/>}
            />
                        <Route 
            path={appRoutes.reportRoutes.children.sparesWise}
            element={<SpareReports/>}
            />
                        <Route 
            path={appRoutes.reportRoutes.children.technicianWise}
            element={<TechnicianReport/>}
            />

            <Route 
            path={appRoutes.userRoutes.children.createUser}
            element={<UserCreate/>}
            />
            {/*-------------------------------- 📷 QR Scanner */}
            <Route path={appRoutes.scanPage} element={<QRScanner />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
