import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

// Define a type for the slice state
interface ModalSlice {
  isMainMenuVisible: boolean;
  isGalleryModalVisible: boolean;
  isTagPeopleModalVisible: boolean;
  isConfirmPopUp: boolean;
  isAddMembersModalVisible: boolean;
  isCreateGroupConfirmModalVisible: boolean;
  isLeaveGroupModalVisible: boolean;
  isManageFollowerModalVisible: boolean;
  isIdentityModalVisible: boolean;
  isLocationModalVisible: boolean;
  isCommunityWarningModalVisible: boolean;
  isBlockAlertModalVisible: boolean;
  isNewChatSectionModalVisible: boolean;
  isDeleteChatAlertModalVisible: boolean;
  isEventFiltersModalVisible: boolean;
  isDeleteTicketVisible: boolean;
  isEventAddPeopleVisible: boolean;
  isProfessionalModalVisible: boolean;
  isAddMembersVisible: boolean;
  isAddlocationModal: boolean;
  isFiltersModalVisible: boolean;
  isAddLineupModalVisible: boolean;
}

// Define the initial state using that type
const initialState: ModalSlice = {
  isMainMenuVisible: false,
  isGalleryModalVisible: false,
  isTagPeopleModalVisible: false,
  isConfirmPopUp: false,
  isAddMembersModalVisible: false,
  isCreateGroupConfirmModalVisible: false,
  isLeaveGroupModalVisible: false,
  isManageFollowerModalVisible: false,
  isIdentityModalVisible: false,
  isLocationModalVisible: false,
  isCommunityWarningModalVisible: false,
  isBlockAlertModalVisible: false,
  isNewChatSectionModalVisible: false,
  isDeleteChatAlertModalVisible: false,
  isEventFiltersModalVisible: false,
  isDeleteTicketVisible: false,
  isEventAddPeopleVisible: false,
  isProfessionalModalVisible: false,
  isAddMembersVisible: false,
  isAddlocationModal: false,
  isFiltersModalVisible: false,
  isAddLineupModalVisible: false,
};

export const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setIsMainMenuVisible: (state, action: PayloadAction<boolean>) => {
      state.isMainMenuVisible = action.payload;
    },
    setIsGalleryModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isGalleryModalVisible = action.payload;
    },
    setIsTagPeopleModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isTagPeopleModalVisible = action.payload;
    },
    setIsConfirmModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isConfirmPopUp = action.payload;
    },
    setIsAddMembersModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isAddMembersModalVisible = action.payload;
    },
    setIsCreateGroupConfirmModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isCreateGroupConfirmModalVisible = action.payload;
    },
    setIsLeaveGroupModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isLeaveGroupModalVisible = action.payload;
    },
    setIsManageFollowerModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isManageFollowerModalVisible = action.payload;
    },
    setIsIdentityModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isIdentityModalVisible = action.payload;
    },
    setIsLocationModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isLocationModalVisible = action.payload;
    },
    setIsCommunityWarningModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isCommunityWarningModalVisible = action.payload;
    },
    setIsBlockAlertModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isBlockAlertModalVisible = action.payload;
    },
    setIsNewChatSectionModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isNewChatSectionModalVisible = action.payload;
    },
    setIsDeleteChatAlertModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isDeleteChatAlertModalVisible = action.payload;
    },
    setIsEventFiltersModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isEventFiltersModalVisible = action.payload;
    },
    setIsDeleteTicketVisible: (state, action: PayloadAction<boolean>) => {
      state.isDeleteTicketVisible = action.payload;
    },
    setIsEventAddPeopleVisible: (state, action: PayloadAction<boolean>) => {
      state.isEventAddPeopleVisible = action.payload;
    },
    setIsProfessionalModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isProfessionalModalVisible = action.payload;
    },
    setIsAddMembersVisible: (state, action: PayloadAction<boolean>) => {
      state.isAddMembersVisible = action.payload;
    },
    setIsAddlocationModal: (state, action: PayloadAction<boolean>) => {
      state.isAddlocationModal = action.payload;
    },
    setIsFiltersModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isFiltersModalVisible = action.payload;
    },
    setIsAddLineupModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isAddLineupModalVisible = action.payload;
    },
  },
});

export const {
  setIsMainMenuVisible,
  setIsGalleryModalVisible,
  setIsTagPeopleModalVisible,
  setIsConfirmModalVisible,
  setIsAddMembersModalVisible,
  setIsCreateGroupConfirmModalVisible,
  setIsLeaveGroupModalVisible,
  setIsManageFollowerModalVisible,
  setIsIdentityModalVisible,
  setIsLocationModalVisible,
  setIsCommunityWarningModalVisible,
  setIsBlockAlertModalVisible,
  setIsNewChatSectionModalVisible,
  setIsDeleteChatAlertModalVisible,
  setIsEventFiltersModalVisible,
  setIsDeleteTicketVisible,
  setIsEventAddPeopleVisible,
  setIsProfessionalModalVisible,
  setIsAddMembersVisible,
  setIsAddlocationModal,
  setIsFiltersModalVisible,
  setIsAddLineupModalVisible,
} = modalSlice.actions;

export default modalSlice.reducer;
