import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import modalReducer from "./slices/modalSlice";
import blockUSerReducer from "./slices/blockedUsersSlice";
import professionalReducer from "./slices/ProfessionalSlice";
import homeDataReducer from "./slices/HomeDataSlice";
import locationReducer from "./slices/locationSlice";
import locationSharingReducer from "./slices/locationSharingSlice";
import userReducer from "./slices/UserSlice";
import subscriptionReducer from "./slices/SubscriptionsSlice";
import followingReducer from "./slices/GetFollowingUserSlice";
import conversationReducer from "./slices/GetAllConversationsSlice";
import paymentMethodReducer from "./slices/paymentMethodSlice";
import subscriptionReducerForPurchases from "./slices/subscriptionData";

export const store = configureStore({
  reducer: {
    modals: modalReducer,
    blockUsers: blockUSerReducer,
    professional: professionalReducer,
    homeData: homeDataReducer,
    location: locationReducer,
    locationSharing: locationSharingReducer,
    user: userReducer,
    subscriptions: subscriptionReducer,
    following: followingReducer,
    conversation: conversationReducer,
    paymentMethods: paymentMethodReducer,
    subscription: subscriptionReducerForPurchases,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
