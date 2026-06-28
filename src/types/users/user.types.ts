export type UserDetail = {
  uuid: string;
  fullName: string;
  email: string;
  role: string;
  specialty?: string;
  phoneNumber?: string;
  tenantId: number;
  createdAt: string;
};

export type UpdateUserPayload = {
  uuid: string;
  fullName?: string;
  phoneNumber?: string;
  specialty?: string;
};
