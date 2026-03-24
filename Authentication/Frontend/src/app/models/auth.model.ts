export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
}

export interface User {
  id: string | number;
  name: string;
  username?: string;
  email: string;
  role?: 'Admin' | 'User';
  createdAt?: string;
}
