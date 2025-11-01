
export enum PlanType {
  ONE_MONTH = "1 Month",
  THREE_MONTHS = "3 Months",
  SIX_MONTHS = "6 Months",
  TWELVE_MONTHS = "12 Months",
}

export interface Client {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  plan_type: PlanType;
  plan_price: number;
  start_date: string; // ISO string
  end_date: string; // ISO string
  payment_notes: string;
  is_active: boolean;
}

export interface Owner {
  owner_name: string;
  owner_email: string;
  owner_phone: string;
}
   