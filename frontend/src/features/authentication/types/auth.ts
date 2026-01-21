export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  adminId: string;
  email: string;
  fullName: string;
}

export interface AdminUser {
  adminId: string;
  email: string;
  fullName: string;
}
