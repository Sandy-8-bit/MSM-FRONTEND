export const apiRoutes = {
  signin: "/api/auth/login",
  signup: "/api/auth/register",
  // ------------------ Master API Routes search ------------------
  vendorsSearch: "/api/admin/vendors",
  clientsSearch: "/api/admin/clients/search",
  productsSearch: "/api/admin/products/search",
  usersSearch: "/api/admin/service-engineers/search",
  machineSparesSearch: "/api/admin/spares/search",
  problemDetailsSearch: "/api/admin/problem-types/search",
  // ------------------ Master API Routes ------------------

  vendors: "/api/admin/vendors",
  clients: "/api/admin/clients",
  products: "/api/admin/products",
  users: "/api/admin/service-engineers",
  machineSpares: "/api/admin/spares",
  problemDetails: "/api/admin/problem-types",

  // ------------------ Transaction API Routes ------------------
  machineEntry: "/api/admin/machine",
  machineEntryBrandSearch: "/api/admin/machine/search/brand",
  machineEntrySearch: "/api/admin/machine/search/client-name",
  machineQr: "/api/admin/machine/bulk-qr-pdf",
  serviceRequest: "/api/transaction/service-request",
  serviceEntry: "/api/transaction/service-entry",

  // ------------------ Dashboard API Routes ------------------
  dashboard: "/api/admin/dashboard",
  // ------------------ Reports Routes ------------------
  customerWise: "/api/admin/reports/client-wise/pdf",
  machineModelWise: "/api/admin/reports/machine-model-wise",
  technicianWise: "/api/admin/reports/technician-wise",
  sparesWise: "/api/admin/reports/spares-wise",
  // ------------------ Service engineer alone allowed Routes ------------------
  employeeServiceRequest: "/api/employee/service-request",
};
