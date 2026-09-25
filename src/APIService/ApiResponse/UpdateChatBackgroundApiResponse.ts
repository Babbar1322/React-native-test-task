export interface UpdateChatBackgroundApiResponse {
  success: boolean;
  message: string;
  backgroundSettings: BackgroundSettings;
}

export interface BackgroundSettings {
  backgroundImage: any;
  backgroundColor: string;
}
