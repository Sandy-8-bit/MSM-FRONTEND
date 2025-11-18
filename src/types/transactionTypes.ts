export interface MachineDetails {
  id: number;
  slNo: string;
  serialNumber: string;
  referenceNumber: string;
  installationDate: string;
  installedByEngineerName: string;
  machinePhotos: string[];
  clientName: string;
  machineType: string;
  brand: string;
  modelNumber: string;
  productId: number;
  remarks: string;
}

export interface MachineResponse {
  data: MachineDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

// export interface ServiceRequest {
//   referenceNumber: string;
//   requestDate: string;
//   complaintDetailsId: number;
//   otherComplaintDetails?: string;
//   clientId: number;
//   machineEntryId: number;
// }

export interface ServiceRequest {
  id: number;
  referenceNumber: string;
  requestDate: string;
  complaintDetails: string;
  otherComplaintDetails?: string;
  engineerName: string;
  clientName: string;
  machineType: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  status?: string;
  machineEntryId?: number;
}

export interface ServiceRequestResponse {
  data: ServiceRequest[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ServiceRequestPayload {
  referenceNumber: string;
  requestDate: string;
  clientId: number;
  machineEntryId: number;
  complaintDetailsId?: number;
  otherComplaintDetails?: string;
  serviceEngineerId?: number;
  remarks?: string;
}

// --- service entry ----
export interface SparePartPayload {
  spareId: number;
  quantity: number;
  complaintSparePhotoUrl?: string; // For string URLs (e.g., after file upload)
  sparePhotoUrl?: string;
}

export interface ServiceEntryPayload {
  refNumber: string;
  serviceDate: string; // Format: DD-MM-YYYY
  maintenanceType: string;
  maintenanceSubType: string;
  serviceRequestId: number;
  vendorId: number;
  engineerId: number;
  engineerDiagnostics: string;
  serviceStatus: string;
  remarks: string;
  complaintSparePhotoUrl: string;
  spareParts: SparePartPayload[];
}
export interface SparePartData {
  spareName: string;
  partNumber: string;
  quantity: number;
  complaintSparePhotoUrl?: string | null;
  sparePhotoUrl?: string | null;
}

export interface ServiceEntryData {
  id: number;
  refNumber: string;
  serviceDate: string;
  clientName: string;
  maintenanceType: string;
  maintenanceSubType: string;
  serviceRequestRef: string;
  vendorName: string;
  engineerName: string;
  engineerMobile: string;
  machineDetails: string;
  engineerDiagnostics: string;
  serviceStatus: string;
  remarks: string;
  spareParts: SparePartData[];
}

export interface ServiceEntryResponse {
  data: ServiceEntryData[];
  page: number;
  totalPages: number;
  totalRecords: number;
}
