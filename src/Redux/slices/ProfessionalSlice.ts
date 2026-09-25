import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfessionalProfile {
  id: string;
  name: string;
  professionType: "DJ" | "Promoter" | "NightClub";
  profileImage: string;
  price: string;
  musicStyles?: string[];
  eventTypes?: string[];
  venueStyles?: string[];
  pricingList: any;
  about: string;
  phone: string;
  siret: string;
  location: string;
}

interface ProfessionalState {
  profiles: ProfessionalProfile[];
}

const initialState: ProfessionalState = {
  profiles: [],
};

const ProfessionalSlice = createSlice({
  name: "professional",
  initialState,
  reducers: {
    addProfessionalProfile: (
      state,
      action: PayloadAction<ProfessionalProfile>
    ) => {
      state.profiles.push(action.payload);
    },
    removeProfessionalProfile: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter(
        (profile) => profile.id !== action.payload
      );
    },
    updateProfessionalProfile: (
      state,
      action: PayloadAction<ProfessionalProfile>
    ) => {
      const index = state.profiles.findIndex(
        (profile) => profile.id === action.payload.id
      );
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
    },
  },
});

export const {
  addProfessionalProfile,
  removeProfessionalProfile,
  updateProfessionalProfile,
} = ProfessionalSlice.actions;
export default ProfessionalSlice.reducer;
