export interface  UserDetails {
    username: string;
    password: string;
    role: string;
    serviceEngineerId: number;
}
// Single user
export interface UserTabel {
  id: number | null;
  serviceEngineerId: number;
  clientId: number | null;
  username: string;
  email: string;
  mobile: string;
  role: "ADMIN" | "SERVICE" | "CLIENT"; // restrict to allowed roles
}


