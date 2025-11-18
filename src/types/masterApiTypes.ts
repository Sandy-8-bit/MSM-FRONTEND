// Master types
export interface VendorDetails {
  id: number; 
  vendorName: string;
  contactPerson: string;
  contactNumber: string;
  emailAddress: string;
  gstNumber: string;
  addressLine1:string;
  addressLine2:string;
  city:string;
  pinCode:number;
  state:string;
  remarks:string;
}

export interface VendorResponse {
  data: VendorDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ClientDetails {
  id: number;
  clientName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pinCode: number;
  state: string;
  gstNumber: string;
  remarks:string;
}


export interface ClientResponse {
  data: ClientDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ProductDetails {
  id: number;
  machineType: string;
  brand: string;
  modelNumber: string;
  description: string;
  remarks:string;
}

export interface ProductResponse {
  data: ProductDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface SpareDetails {
  id: number;
  spareName: string;
  partNumber: string;
  description: string;
  remarks:string;
}

export interface SpareResponse {
  data: SpareDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ProblemDetails {
  id: number;
  problemType: string;
  description: string;
  remarks:string;
}

export interface ProblemResponse {
  data: ProblemDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}
export interface ServiceEngineerResponse {
  data: ServiceEngineerDetails[];
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ServiceEngineerDetails {
  id: number;
  engineerName: string;
  engineerMobile: number;
  remarks:string;
  clientId: number;
  clientName: string;
}

//-------------old remove this later ------------

export interface BloodDetails {
  id: number;
  name: string;
  remarks: string;
}





export interface LoanDetails {
  id: number;
  name: string;
  maxEligibilityAmount: number;
  loanRepaymentPeriod: number;
  employeeWorkedMonths: number;
  remarks: string;
}



