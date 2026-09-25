import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subscription } from "../../APIService/ApiResponse/SubscriptionApiResponse";

interface SubscriptionState {
  subscriptionData: Subscription | null;
}

const initialState: SubscriptionState = {
  subscriptionData: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionData: (
      state,
      action: PayloadAction<Subscription | null>,
    ) => {
      state.subscriptionData = action.payload;
    },
  },
});

export const { setSubscriptionData } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
