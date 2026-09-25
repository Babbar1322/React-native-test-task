import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data, Permissions } from "../../APIService/ApiResponse/GetAllConversationResponse";

interface ConversationState {
  conversations: Data | null;
}

// ✅ Initial state
const initialState: ConversationState = {
  conversations: null,
};

// ✅ Slice
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Data>) => {
      state.conversations = action.payload;
    },
    clearConversations: (state) => {
      state.conversations = null;
    },
    updateUnreadCount: (
      state,
      action: PayloadAction<{ id: string; count: number }>
    ) => {
      const { id, count } = action.payload;
      if (state.conversations) {
        const allConversations = state.conversations.all.map((conv) =>
          conv._id === id ? { ...conv, unreadCount: count } : conv
        );
        state.conversations = { ...state.conversations, all: allConversations };
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.conversations) {
        const updatedAll = state.conversations.all.map((conv) =>
          conv._id === id ? { ...conv, unreadCount: 0 } : conv
        );
        state.conversations = { ...state.conversations, all: updatedAll };
      }
    },
    updateBackgroundSettings: (
      state,
      action: PayloadAction<{ id: string; backgroundSettings: any }>
    ) => {
      const { id, backgroundSettings } = action.payload;
      if (state.conversations) {
        const updatedAll = state.conversations.all.map((conv) =>
          conv._id === id ? { ...conv, backgroundSettings } : conv
        );
        state.conversations = { ...state.conversations, all: updatedAll };
      }
    },
    updatePermissions: (
      state,
      action: PayloadAction<{ id: string; permissions: Permissions }>
    ) => {
      const { id, permissions } = action.payload;
      if (state.conversations) {
        const updatedAll = state.conversations.all.map((conv) =>
          conv._id === id ? { ...conv, permissions } : conv
        );
        state.conversations = { ...state.conversations, all: updatedAll };
      }
    },
    togglePinConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.conversations) {
        const updatedAll = state.conversations.all.map((conv) =>
          conv._id === id ? { ...conv, isPinned: !conv.isPinned } : conv
        );

        // Update individual, squad, and community arrays as well
        const updatedIndividual = state.conversations.individual.map((conv) =>
          conv._id === id ? { ...conv, isPinned: !conv.isPinned } : conv
        );
        const updatedSquad = state.conversations.squad.map((conv: any) =>
          conv._id === id ? { ...conv, isPinned: !conv.isPinned } : conv
        );
        const updatedCommunity = state.conversations.community.map((conv: any) =>
          conv._id === id ? { ...conv, isPinned: !conv.isPinned } : conv
        );

        state.conversations = {
          ...state.conversations,
          all: updatedAll,
          individual: updatedIndividual,
          squad: updatedSquad,
          community: updatedCommunity,
        };
      }
    },
    deleteConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.conversations) {
        const updatedAll = state.conversations.all.filter((conv) => conv._id !== id);
        const updatedIndividual = state.conversations.individual.filter((conv) => conv._id !== id);
        const updatedSquad = state.conversations.squad.filter((conv: any) => conv._id !== id);
        const updatedCommunity = state.conversations.community.filter((conv: any) => conv._id !== id);

        state.conversations = {
          ...state.conversations,
          all: updatedAll,
          individual: updatedIndividual,
          squad: updatedSquad,
          community: updatedCommunity,
        };
      }
    },
  },
});

export const {
  setConversations,
  clearConversations,
  updateUnreadCount,
  markAsRead,
  updateBackgroundSettings,
  updatePermissions,
  togglePinConversation,
  deleteConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
