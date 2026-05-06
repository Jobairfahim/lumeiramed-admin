// Conversation and messaging types

export interface ConversationMessage {
  _id?: string;
  id?: string;
  conversationId: string;
  senderId: string | { _id?: string; id?: string; email?: string };
  content: string;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: string;
  isRead?: boolean;
  senderName?: string;
  senderEmail?: string;
}

export interface ConversationParticipant {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  profileImage?: string;
}

export interface ConversationSummary {
  _id?: string;
  id?: string;
  conversationId?: string;
  title?: string;
  name?: string;
  participants?: ConversationParticipant[];
  lastMessage?: {
    content?: string;
    createdAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentProfile {
  _id: string;
  id?: string;
  userId?: string | { _id?: string; id?: string; email?: string };
  fullName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}
