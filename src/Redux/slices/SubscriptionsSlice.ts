import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetSubscriptionsAPIResponse } from "../../APIService/ApiResponseTypes";

interface SubscriptionsState {
  plans: GetSubscriptionsAPIResponse[];
}

const initialState: SubscriptionsState = {
  plans: [],
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<GetSubscriptionsAPIResponse[]>) => {
      state.plans = action.payload;
    },
  },
});

export const { setPlans } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
