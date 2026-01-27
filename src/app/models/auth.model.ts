export interface User {
  userId: number;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  message: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
