export interface CreateUserRequest {
  email: string;
  fullName: string;
  password?: string;
  role: 'ADMIN' | 'USER' | 'OWNER';
  specialty?: string;
  phoneNumber?: string;
}

export interface UserResponse {
  uuid: string;
  email: string;
  fullName: string;
  role: string;
  specialty?: string;
  avatarUrl?: string;
  createdAt: string;
}
