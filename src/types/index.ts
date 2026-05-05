export type AdminPage =
  | "login"
  | "dashboard"
  | "applications"
  | "application-detail"
  | "matching-placement"
  | "hospital"
  | "hospital-placements"
  | "all-placements"
  | "messages"
  | "settings";

export type StageStatus =
  | "AwaitingPayment"
  | "MatchingRequired"
  | "AwaitingResponse";

export type PaymentStatus = "Pending" | "Paid";

export interface Application {
  id: number;
  studentName: string;
  university: string;
  department: string;
  duration: string;
  stage: StageStatus;
  firstPayment: PaymentStatus;
  finalPayment: PaymentStatus;
}

export interface Hospital {
  id: number;
  name: string;
  email: string;
  address: string;
  seats: string;
}

export interface Placement {
  id: number | string;
  _id?: string;
  department: string;
  location: string;
  seats: string;
  duration: string;
  deadline: string;
  startDate: string;
}

export interface Message {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
}

export interface Contact {
  id: number;
  name: string;
  preview: string;
  avatar?: string;
}
