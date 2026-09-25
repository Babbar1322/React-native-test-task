import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data, GetFollowingUserResponse } from "../../APIService/ApiResponse/GetFollowingUserResponse";

interface FollowingState {
  followingUsers: Data[];
  success: boolean;
  message: string;
}

const initialState: FollowingState = {
  followingUsers: [],
  success: false,
  message: "",
};

const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    setFollowingUsers: (
      state,
      action: PayloadAction<GetFollowingUserResponse>
    ) => {
      state.followingUsers = action.payload.data;
      state.success = action.payload.success;
      state.message = action.payload.message;
    },
    clearFollowingUsers: (state) => {
      state.followingUsers = [];
      state.success = false;
      state.message = "";
    },
  },
});

export const { setFollowingUsers, clearFollowingUsers } =
  followingSlice.actions;
export default followingSlice.reducer;
