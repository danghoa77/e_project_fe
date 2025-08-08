// src/types/index.ts
export type UserRole = 'admin' | 'customer';

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  addresses?: Address[];
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  isDefault?: boolean;
}

export interface LoginResponse {
  user: UserType;
  access_token: string;
}
