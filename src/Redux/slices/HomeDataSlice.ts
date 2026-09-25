import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { HomeApiResponse } from '../../APIService/ApiResponseTypes';

// Define a type for the slice state
interface HomeSliceState {
  homeData: HomeApiResponse | null;
  refreshHomeData?: number;
}

// Define the initial state using that type
const initialState: HomeSliceState = {
  homeData: null,
  refreshHomeData: 0,
};

const HomeDataSlice = createSlice({
  name: 'HomeUser',
  initialState,
  reducers: {
    setHomeData: (state, action: PayloadAction<HomeApiResponse>) => {
      state.homeData = action.payload;
    },
    // Add a new action to update the comment count for a specific post
    updateCommentCount: (
      state,
      action: PayloadAction<{ postId: string | String; increment: number }>,
    ) => {
      const { postId, increment } = action.payload;

      // Make sure homeData exists
      if (!state.homeData || !state.homeData.posts) return;

      // Find the post and update its comment count
      const postIndex = state.homeData.posts.findIndex(
        (post) => post._id === postId || post._id === postId,
      );

      if (postIndex !== -1) {
        // Update the comment count
        const currentCount = state.homeData.posts[postIndex].commentsCount || 0;
        state.homeData.posts[postIndex].commentsCount =
          currentCount + increment;
        console.log(
          `Updated comment count for post ${postId}: ${currentCount} -> ${
            currentCount + increment
          }`,
        );
      }
    },
    // Add a new action to update the like count and liked status for a specific post
    updateLikeStatus: (
      state,
      action: PayloadAction<{
        postId: string | String;
        increment: number;
        isLiked: boolean;
      }>,
    ) => {
      const { postId, increment, isLiked } = action.payload;

      // Make sure homeData exists
      if (!state.homeData || !state.homeData.posts) return;

      // Find the post and update its like count and liked status
      const postIndex = state.homeData.posts.findIndex(
        (post) => post._id === postId || post._id === postId,
      );

      if (postIndex !== -1) {
        // Prevent double updates by checking if the state is already correct
        const currentLiked = state.homeData.posts[postIndex].isLikedByUser;
        if (currentLiked === isLiked) {
          console.log(
            `Redux: Post ${postId} already has isLiked=${isLiked}, skipping update`,
          );
          return;
        }

        // Update the like count
        const currentCount = state.homeData.posts[postIndex].likesCount || 0;
        state.homeData.posts[postIndex].likesCount = currentCount + increment;

        // Update the liked status
        state.homeData.posts[postIndex].isLikedByUser = isLiked;

        console.log(
          `Redux: Updated post ${postId}: ${currentCount} -> ${
            currentCount + increment
          }, isLiked: ${currentLiked} -> ${isLiked}`,
        );
      }

      // Also check in reposts if this post exists
      if (state.homeData.reposts) {
        const repostIndex = state.homeData.reposts.findIndex(
          (repost) => repost._id === postId || repost._id === postId,
        );

        if (repostIndex !== -1) {
          // Prevent double updates by checking if the state is already correct
          const currentLiked =
            state.homeData.reposts[repostIndex].isLikedByUser;
          if (currentLiked === isLiked) {
            console.log(
              `Redux: Repost ${postId} already has isLiked=${isLiked}, skipping update`,
            );
            return;
          }

          // Update the like count
          const currentCount =
            state.homeData.reposts[repostIndex].likesCount || 0;
          state.homeData.reposts[repostIndex].likesCount =
            currentCount + increment;

          // Update the liked status
          state.homeData.reposts[repostIndex].isLikedByUser = isLiked;

          console.log(
            `Redux: Updated repost ${postId}: ${currentCount} -> ${
              currentCount + increment
            }, isLiked: ${currentLiked} -> ${isLiked}`,
          );
        }
      }
    },

    // Add action to sync comment data between screens
    syncCommentData: (
      state,
      action: PayloadAction<{
        postId: string;
        comments: any[];
        totalCount: number;
      }>,
    ) => {
      const { postId, comments, totalCount } = action.payload;

      // Make sure homeData exists
      if (!state.homeData || !state.homeData.posts) return;

      // Find the post and update its comment data
      const postIndex = state.homeData.posts.findIndex(
        (post) => post._id === postId || post._id === postId,
      );

      if (postIndex !== -1) {
        // Update the comment count
        state.homeData.posts[postIndex].commentsCount = totalCount;

        // Store comment data for syncing with PostDetail
        (state.homeData.posts[postIndex] as any).commentData = {
          comments,
          lastUpdated: Date.now(),
        };

        console.log(
          `Redux: Synced comment data for post ${postId}: ${totalCount} comments`,
        );
      }

      // Also check in reposts if this post exists
      if (state.homeData.reposts) {
        const repostIndex = state.homeData.reposts.findIndex(
          (repost) => repost._id === postId || repost._id === postId,
        );

        if (repostIndex !== -1) {
          // Update the comment count
          state.homeData.reposts[repostIndex].commentsCount = totalCount;

          // Store comment data for syncing with PostDetail
          (state.homeData.reposts[repostIndex] as any).commentData = {
            comments,
            lastUpdated: Date.now(),
          };

          console.log(
            `Redux: Synced comment data for repost ${postId}: ${totalCount} comments`,
          );
        }
      }
    },

    setRefreshHomeData: (state) => {
      state.refreshHomeData = Math.floor(Math.random() * 501);
    },
  },
});

export const {
  setHomeData,
  updateCommentCount,
  updateLikeStatus,
  syncCommentData,
  setRefreshHomeData,
} = HomeDataSlice.actions;
export default HomeDataSlice.reducer;
