export interface ReferralCode {
  _id: string;
  codeCreatedBy: CodeCreatedBy;
  used: boolean;
  referredUser?: ReferredUser;
  code: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface CodeCreatedBy {
  _id: string;
  userName: string;
  photos: string[];
}

export interface ReferredUser {
  _id: string;
  userName: string;
  photos: string[];
}
