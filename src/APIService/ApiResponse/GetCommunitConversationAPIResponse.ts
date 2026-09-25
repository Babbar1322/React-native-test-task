export interface GetCommunityConversationAPIResponse {
  message: Message[];
  pagination: Pagination;
  communityConversation: string;
}

export interface Message {
  editedAt: any;
  _id: string;
  sender: Sender;
  communityConversation: string;
  conversationType: string;
  text: string;
  messageType: string;
  readBy: ReadBy[];
  isDeleted: boolean;
  deletedFor: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Sender {
  _id: string;
  userName: string;
  photos: string[];
}

export interface ReadBy {
  user: string;
  readAt: string;
  _id: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
