export interface CommunityPermissionsApiResponse {
  success: boolean;
  message: string;
  data: CommunityPermissionsData;
}

export interface CommunityPermissionsData {
  onlyAdminsCanPost: boolean;
  allowMessageEditing: boolean;
  allowMediaSharing: boolean;
}

export interface UpdateCommunityPermissionsPayload {
  allowMediaSharing: boolean;
  allowMessageEditing: boolean;
  onlyAdminsCanPost: boolean;
}

