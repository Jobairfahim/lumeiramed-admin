import { API_BASE_URL, getAuthHeaders } from "./auth";
import type { Placement } from "@/types";

export interface PlacementsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Placement[];
}

export interface PlacementResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Placement;
}

export interface CreatePlacementPayload {
  department: string;
  location: string;
  totalSeats: number;
  durationWeeks: string;
  deadline: string;
  startDate: string;
  description: string;
  requirements: string;
}

export interface UpdatePlacementPayload {
  department?: string;
  location?: string;
  totalSeats?: number;
  durationWeeks?: string;
  deadline?: string;
  startDate?: string;
  description?: string;
  requirements?: string;
}

// Hospital interfaces
export interface HospitalUser {
  _id: string;
  email: string;
}

export interface Hospital {
  isDeleted: boolean;
  _id: string;
  userId: HospitalUser;
  hospitalName: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HospitalsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Hospital[];
}

// Get all placements
export async function getPlacements(): Promise<PlacementsResponse> {
  const response = await fetch(`${API_BASE_URL}/placements`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as PlacementsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load placements.");
  }

  return result;
}

// Create placement
export async function createPlacement(payload: CreatePlacementPayload): Promise<PlacementResponse> {
  const response = await fetch(`${API_BASE_URL}/placements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as PlacementResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create placement");
  }

  return result;
}

// Update placement
export async function updatePlacement(id: string | number, payload: UpdatePlacementPayload): Promise<PlacementResponse> {
  const response = await fetch(`${API_BASE_URL}/placements/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as PlacementResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update placement");
  }

  return result;
}

// Delete placement
export async function deletePlacement(id: string | number): Promise<PlacementResponse> {
  const response = await fetch(`${API_BASE_URL}/placements/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as PlacementResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete placement");
  }

  return result;
}

// Get all hospitals
export async function getHospitals(): Promise<HospitalsResponse> {
  const response = await fetch(`${API_BASE_URL}/hospitals`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as HospitalsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load hospitals.");
  }

  return result;
}

// Dashboard interfaces
export interface RevenueBarChart {
  month: string;
  totalRevenue: number;
}

export interface RevenueLineChart {
  date: string;
  totalRevenue: number;
}

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Application {
  _id: string;
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  universityOrMedicalSchool: string;
  yearOfStudy: number;
  preferredStartDate: string;
  duration: string;
  preferredSpecialty: string;
  preferredCities: string;
  language: string;
  documents: string[];
  additionalInformation: string;
  stage: string;
  hospitalStatus: string;
  studentStatus: string;
  adminStatus: string;
  firstPayment: string;
  firstPaymentAmount: number;
  finalPayment: string;
  finalPaymentAmount: number;
  isVisibleToHospitals: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  student: Student;
}

export interface AdminOverviewData {
  totalApplications: number;
  hospitals: number;
  totalEmptySeats: number;
  totalRevenue: number;
  allApplications: Application[];
  revenueBarChart: RevenueBarChart[];
  revenueLineChart: RevenueLineChart[];
  growthRate: number;
}

export interface AdminOverviewResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AdminOverviewData;
}

// Get admin overview for dashboard
export async function getAdminOverview(): Promise<AdminOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/admin-overview`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as AdminOverviewResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load admin overview.");
  }

  return result;
}

// All applications interfaces
export interface StudentProfile {
  _id: string;
  fullName: string;
}

export interface StudentUser {
  _id: string;
  email: string;
  role: string;
}

export interface StudentApplication {
  _id: string;
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  universityOrMedicalSchool: string;
  yearOfStudy: number;
  preferredStartDate: string;
  duration: string;
  preferredSpecialty: string;
  preferredCities: string;
  language: string;
  documents: string[];
  additionalInformation: string;
  stage: string;
  hospitalStatus: string;
  studentStatus: string;
  adminStatus: string;
  firstPayment: string;
  firstPaymentAmount: number;
  finalPayment: string;
  finalPaymentAmount: number;
  isVisibleToHospitals: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  studentProfile: StudentProfile;
  studentUser: StudentUser;
}

export interface AllApplicationsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: StudentApplication[];
}

// Get all student placement enquiries
export async function getAllApplications(): Promise<AllApplicationsResponse> {
  const response = await fetch(`${API_BASE_URL}/student-placement-enquiries/admin`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as AllApplicationsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load applications.");
  }

  return result;
}

// Get single student placement enquiry by ID
export async function getApplicationById(id: string): Promise<{ success: boolean; message: string; statusCode: number; data: StudentApplication }> {
  const response = await fetch(`${API_BASE_URL}/student-placement-enquiries/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as { success: boolean; message: string; statusCode: number; data: StudentApplication };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load application.");
  }

  return result;
}

// Change student placement enquiry status
export async function changeApplicationStatus(id: string, status: string): Promise<{ success: boolean; message: string; statusCode: number }> {
  const response = await fetch(`${API_BASE_URL}/admin/change-student-placement-enquiry-status/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = (await response.json()) as { success: boolean; message: string; statusCode: number };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update application status.");
  }

  return result;
}

// Change student placement enquiry stage
export async function changeApplicationStage(id: string, stage: string): Promise<{ success: boolean; message: string; statusCode: number; data: StudentApplication }> {
  const response = await fetch(`${API_BASE_URL}/admin/change-student-placement-enquiry-stage/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stage }),
  });

  const result = (await response.json()) as { success: boolean; message: string; statusCode: number; data: StudentApplication };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update application stage.");
  }

  return result;
}

// Conversations interfaces
export interface Conversation {
  _id: string;
  userId: string;
  participantId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participantName?: string;
  participantEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Conversation[];
}

// Get user conversations
export async function getConversations(): Promise<ConversationsResponse> {
  const response = await fetch(`${API_BASE_URL}/conversations/user`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as ConversationsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load conversations.");
  }

  return result;
}

// Message interfaces
export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  senderName?: string;
  senderEmail?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Message[];
}

// Get messages for a specific conversation
export async function getConversationMessages(conversationId: string): Promise<MessagesResponse> {
  const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as MessagesResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load messages.");
  }

  return result;
}
