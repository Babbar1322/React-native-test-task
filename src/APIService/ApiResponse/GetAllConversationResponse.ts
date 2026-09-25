export interface GetAllConversationResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  all: All[];
  individual: Individual[];
  squad: any[];
  community: Community2[];
  counts: Counts;
}

export interface All {
  permissions?: Permissions;
  _id: string;
  squad?: Squad;
  community?: Community;
  isActive: boolean;
  isPinned: boolean;
  isMuted: IsMuted;
  backgroundSettings: BackgroundSettings;
  createdAt: string;
  updatedAt: string;
  __v: number;
  conversationType: string;
  participants?: Participant[];
  lastMessage?: LastMessage;
  unreadCount?: number;
}

export interface Permissions {
  allowMediaSharing: boolean;
  allowMessageEditing: boolean;
  onlyAdminsCanPost: boolean;
}

export interface Squad {
  _id: string;
  title: string;
  members: SquadMember[];
  media: string[];
}

export interface SquadMember {
  user: SquadUser;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface SquadUser {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Community {
  _id: string;
  name: string;
  members: Member[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface BackgroundSettings {
  backgroundImage: any;
  backgroundColor: any;
  staticBackgroundImage: string;
}

export interface LastMessage {
  _id: string;
  sender: any;
  communityConversation?: string;
  conversationType?: string;
  text: string;
  messageType: string;
  readBy: ReadBy[];
  isDeleted?: boolean;
  editedAt?: any;
  deletedFor?: any[];
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface ReadBy {
  user: string;
  readAt: string;
  _id: string;
}

export interface IsMuted {}

export interface Participant {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Individual {
  _id: string;
  participants: Participant2[];
  isActive: boolean;
  isPinned: boolean;
  backgroundSettings: BackgroundSettings2;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage: LastMessage2;
  isMuted: IsMuted2;
  unreadCount: number;
  conversationType: string;
}

export interface Participant2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface BackgroundSettings2 {
  backgroundImage: any;
  backgroundColor: any;
  staticBackgroundImage: string;
}

export interface LastMessage2 {
  _id: string;
  sender: string;
  text: string;
  messageType: string;
  readBy: ReadBy2[];
  createdAt: string;
  editedAt?: any;
}

export interface ReadBy2 {
  user: string;
  readAt: string;
  _id: string;
}

export interface IsMuted2 {}

export interface Community2 {
  permissions: Permissions2;
  _id: string;
  community: Community3;
  isActive: boolean;
  isPinned: boolean;
  backgroundSettings: BackgroundSettings3;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage: LastMessage3;
  isMuted: IsMuted3;
  conversationType: string;
}

export interface Permissions2 {
  allowMediaSharing: boolean;
  allowMessageEditing: boolean;
  onlyAdminsCanPost: boolean;
}

export interface Community3 {
  _id: string;
  name: string;
  members: Member2[];
}

export interface Member2 {
  user: User2;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface BackgroundSettings3 {
  backgroundImage: any;
  backgroundColor: any;
  staticBackgroundImage: string;
}

export interface LastMessage3 {
  _id: string;
  sender: Sender;
  communityConversation: string;
  conversationType: string;
  text: string;
  messageType: string;
  readBy: ReadBy3[];
  isDeleted: boolean;
  editedAt: any;
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

export interface ReadBy3 {
  user: string;
  readAt: string;
  _id: string;
}

export interface IsMuted3 {}

export interface Counts {
  total: number;
  individual: number;
  squad: number;
  community: number;
}
