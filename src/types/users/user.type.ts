export interface User {
  uuid: string;
  email: string;
  fullName: string;
  role: string;
  specialty?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}
