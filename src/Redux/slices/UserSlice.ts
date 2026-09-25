import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetCurrentUserData } from '../../APIService/ApiResponse/getAPIResponse';
import { FollowListApiResponse, getCurrectUserPostsApiResponse } from "../../APIService/ApiResponseTypes";

interface UserState {
  userData: GetCurrentUserData | null;
  isLoading: boolean;
  error: string | null;
  postData?: getCurrectUserPostsApiResponse | null;
  userFollowersList: FollowListApiResponse[] | null;
}

const initialState: UserState = {
  userData: null,
  isLoading: false,
  error: null,
  postData: null,
  userFollowersList: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<GetCurrentUserData>) => {
      state.userData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
    setUserPostData: (
      state,
      action: PayloadAction<getCurrectUserPostsApiResponse>
    ) => {
      state.postData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserFollowersList: (
      state,
      action: PayloadAction<FollowListApiResponse[]>
    ) => {
      state.userFollowersList = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setUserData,
  setUserLoading,
  setUserError,
  clearUserData,
  setUserPostData,
} = userSlice.actions;
export default userSlice.reducer;