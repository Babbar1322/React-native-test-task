import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlockedUser } from "../../APIService/ApiResponse/GetBlockedUserListApiResponse";

interface BlockedUsersState {
  blockedUsers: BlockedUser[];
}

const initialState: BlockedUsersState = {
  blockedUsers: [],
};

const blockedUsersSlice = createSlice({
  name: "blockedUsers",
  initialState: initialState,
  reducers: {
    blockUser: (state, action: PayloadAction<BlockedUser>) => {
      state.blockedUsers.push(action.payload);
    },
    unblockUser: (state, action: PayloadAction<string>) => {
      state.blockedUsers = state.blockedUsers.filter(
        (user) => user._id !== action.payload
      );
    },
    setBlockedUsers: (state, action: PayloadAction<BlockedUser[]>) => {
      state.blockedUsers = action.payload;
    },
  },
});

export const { blockUser, unblockUser, setBlockedUsers } =
  blockedUsersSlice.actions;
export default blockedUsersSlice.reducer;
