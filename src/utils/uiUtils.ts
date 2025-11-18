import type { DropdownOption } from "@/components/common/DropDown";

export const genderOptions = [
  { id: 1, label: "Male" },
  { id: 2, label: "Female" },
  { id: 3, label: "Transgender" },
  { id: 4, label: "Rather not say" },
];

export const maritalStatus = [
  { id: 1, label: "Single" },
  { id: 2, label: "Married" },
  { id: 3, label: "Rather not say" },
];

export const maintenanceOptions: DropdownOption[] = [
  { id: 1, label: "General" },
  { id: 2, label: "Breakdown" },
  { id: 3, label: "Warranty" },
  { id: 4, label: "Non-Warranty" },
];

export const maintenanceSubtTypeOptions: DropdownOption[] = [
  { id: 1, label: "Self Service" },
  { id: 2, label: "Vendor Side" },
];

export const statusOptions: DropdownOption[] = [
  { id: 1, label: "Completed" },
  { id: 2, label: "Not Completed" },
];

export const fetchEmployeeSuggestions = async (query: string) => {
  const dummyEmployees = [
    { id: "EMP001", branch: "Gandhipuram" },
    { id: "EMP002", branch: "Peelamedu" },
    { id: "EMP003", branch: "RS Puram" },
    { id: "EMP004", branch: "Gandhipuram" },
    { id: "EMP005", branch: "Saibaba Colony" },
  ];

  // Format: {EMP004,Gandhipuram}
  return dummyEmployees
    .filter((emp) =>
      `${emp.id} ${emp.branch}`.toLowerCase().includes(query.toLowerCase()),
    )
    .map((emp) => ({
      id: emp.id,
      title: `${emp.id}`,
    }));
};
