
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  promoCode: PromoCode;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  receiptImage?: string;
}

export type ViewType = 'users' | 'payments' | 'dashboard';
