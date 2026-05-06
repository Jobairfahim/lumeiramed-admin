import { API_BASE_URL, getAuthHeaders, getCurrentUserId } from "./auth";
import type { Placement } from "@/types";
import type { ConversationSummary } from "./types";

// API response interface (raw from server)
export interface ApiPlacement {
  _id?: string;
  id?: string | number;
  department: string;
  location: string;
  totalSeats?: number;
  seats?: string | number;
  durationWeeks?: string;
  duration?: string;
  deadline: string;
  startDate: string;
  description?: string;
  requirements?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

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

  const result = await response.json() as {
    success: boolean;
    message: string;
    statusCode: number;
    data: ApiPlacement[];
  };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load placements.");
  }

  // Transform API data to match frontend interface
  const transformedData: Placement[] = result.data.map(placement => ({
    id: placement.id || placement._id || "",
    _id: placement._id,
    department: placement.department,
    location: placement.location,
    seats: placement.totalSeats?.toString() || placement.seats?.toString() || "0",
    duration: placement.durationWeeks ? `${placement.durationWeeks} Weeks` : placement.duration || "",
    deadline: placement.deadline,
    startDate: placement.startDate,
  }));

  return {
    success: result.success,
    message: result.message,
    statusCode: result.statusCode,
    data: transformedData,
  };
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

  const result = await response.json() as {
    success: boolean;
    message: string;
    statusCode: number;
    data: ApiPlacement;
  };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create placement");
  }

  // Transform API data to match frontend interface
  const transformedData: Placement = {
    id: result.data.id || result.data._id || "",
    _id: result.data._id,
    department: result.data.department,
    location: result.data.location,
    seats: result.data.totalSeats?.toString() || result.data.seats?.toString() || "0",
    duration: result.data.durationWeeks ? `${result.data.durationWeeks} Weeks` : result.data.duration || "",
    deadline: result.data.deadline,
    startDate: result.data.startDate,
  };

  return {
    success: result.success,
    message: result.message,
    statusCode: result.statusCode,
    data: transformedData,
  };
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

  const result = await response.json() as {
    success: boolean;
    message: string;
    statusCode: number;
    data: ApiPlacement;
  };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update placement");
  }

  // Transform API data to match frontend interface
  const transformedData: Placement = {
    id: result.data.id || result.data._id || "",
    _id: result.data._id,
    department: result.data.department,
    location: result.data.location,
    seats: result.data.totalSeats?.toString() || result.data.seats?.toString() || "0",
    duration: result.data.durationWeeks ? `${result.data.durationWeeks} Weeks` : result.data.duration || "",
    deadline: result.data.deadline,
    startDate: result.data.startDate,
  };

  return {
    success: result.success,
    message: result.message,
    statusCode: result.statusCode,
    data: transformedData,
  };
}

// Delete placement
export async function deletePlacement(id: string | number): Promise<PlacementResponse> {
  const response = await fetch(`${API_BASE_URL}/placements/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = await response.json() as {
    success: boolean;
    message: string;
    statusCode: number;
    data: ApiPlacement;
  };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete placement");
  }

  // Transform API data to match frontend interface
  const transformedData: Placement = {
    id: result.data.id || result.data._id || "",
    _id: result.data._id,
    department: result.data.department,
    location: result.data.location,
    seats: result.data.totalSeats?.toString() || result.data.seats?.toString() || "0",
    duration: result.data.durationWeeks ? `${result.data.durationWeeks} Weeks` : result.data.duration || "",
    deadline: result.data.deadline,
    startDate: result.data.startDate,
  };

  return {
    success: result.success,
    message: result.message,
    statusCode: result.statusCode,
    data: transformedData,
  };
}

export interface CreateHospitalPayload {
  email: string;
  password: string;
  description: string;
  hospitalName: string;
  address: string;
  phone: string;
  website: string;
}

export interface CreateHospitalResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Hospital;
}

// Create hospital
export async function createHospital(payload: CreateHospitalPayload): Promise<CreateHospitalResponse> {
  const response = await fetch(`${API_BASE_URL}/users/hospital`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as CreateHospitalResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create hospital");
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
  id?: string;
  fullName: string;
  userId?: string | { _id?: string; id?: string; email?: string };
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

// Get student profile
export async function getStudentProfile(): Promise<{ success: boolean; message: string; data: StudentProfile }> {
  const userId = getCurrentUserId();
  
  if (!userId) {
    return {
      success: false,
      message: "User not authenticated",
      data: { _id: "", fullName: "" }
    };
  }

  return {
    success: true,
    message: "Profile retrieved successfully",
    data: {
      _id: userId,
      id: userId,
      fullName: "User",
      userId: userId
    }
  };
}

// Get user conversations
export async function getUserConversations(): Promise<{ success: boolean; message: string; error?: string; data: ConversationSummary[] }> {
  const response = await fetch(`${API_BASE_URL}/conversations/user`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const result = (await response.json()) as { success: boolean; message: string; data: ConversationSummary[] };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load conversations.");
  }

  return result;
}
