export interface GetMySquadsApiResponse {
  squads: Squad[];
  selectedSquadId: string;
}

export interface Squad {
  _id: string;
  title: string;
  creator: Creator;
  about: string;
  members: Member[];
  maxMembers: number;
  status: string;
  media: string[];
  squadInterest: string[];
  matchedSquads: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  conversation: string;
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
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
