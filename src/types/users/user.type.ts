export interface User {
  uuid: string;
  email: string;
  fullName: string;
  role: string;
  specialty?: string;
  phoneNumber?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}
