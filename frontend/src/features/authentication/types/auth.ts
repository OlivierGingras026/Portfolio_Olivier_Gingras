export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  refreshToken: string;
  adminId: string;
  email: string;
  fullName: string;
  expiresIn: number;
}

export interface AdminUser {
  adminId: string;
  email: string;
  fullName: string;
}
