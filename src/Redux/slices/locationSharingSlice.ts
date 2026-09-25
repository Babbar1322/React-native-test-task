import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationSharingState {
  isLocationSharingEnabled: boolean;
  hasAskedForPermission: boolean;
}

const initialState: LocationSharingState = {
  isLocationSharingEnabled: false,
  hasAskedForPermission: false,
};

const locationSharingSlice = createSlice({
  name: "locationSharing",
  initialState,
  reducers: {
    enableLocationSharing: (state) => {
      state.isLocationSharingEnabled = true;
      state.hasAskedForPermission = true;
    },
    disableLocationSharing: (state) => {
      state.isLocationSharingEnabled = false;
      state.hasAskedForPermission = true;
    },
    setLocationSharingPermissionAsked: (state) => {
      state.hasAskedForPermission = true;
    },
    setLocationSharingState: (
      state,
      action: PayloadAction<{ isLocationSharingEnabled: boolean }>
    ) => {
      state.isLocationSharingEnabled = action.payload.isLocationSharingEnabled;
    },
  },
});

export const {
  enableLocationSharing,
  disableLocationSharing,
  setLocationSharingPermissionAsked,
  setLocationSharingState,
} = locationSharingSlice.actions;
export default locationSharingSlice.reducer;
