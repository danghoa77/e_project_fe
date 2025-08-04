// src/types/index.ts
export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  isDefault?: boolean;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}
