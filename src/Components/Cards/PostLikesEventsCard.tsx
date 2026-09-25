import React, { useState, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import PostCard from "./PostCard";
import {
  OtherUserPostsApiResponse,
  OtherUsersEventsApiResponse,
} from "../../APIService/ApiResponseTypes";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import DatingEventCard from "./DatingEventCard";

interface InterestCardProps {
  navigation: any;
  isGroup: boolean;
  posts: OtherUserPostsApiResponse[];
  userProfilePic?: string;
  events?: OtherUsersEventsApiResponse[];
}

const PostLikesEventsCard = ({
  navigation,
  isGroup,
  posts,
  userProfilePic,
  events,
}: InterestCardProps) => {
  const [activeTab, setActiveTab] = useState("Post");
  const [selectedPostForRepost, setSelectedPostForRepost] = useState<
    string | null
  >(null);

  const renderPosts = useCallback(() => {
    return (
      <>
        {!isGroup && (
          <FlatList
            data={posts} // Use dynamic posts prop
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                <PostCard
                  id={item._id}
                  userName={item.user.userName}
                  userProfilePic={`${getFullImageUrl(item.photos[0])}` || ""}
                  createdAt={item.createdAt}
                  description={item.content}
                  content={item.content}
                  videos={[]}
                  photos={item.photos}
                  likesCount={0}
                  commentsCount={0}
                  repostCount={0}
                  isLikedByUser={false}
                  isRepost={false}
                  originalPost={null}
                  onPress={() =>
                    navigation.navigate("postDetailStack", {
                      screen: "postDetail",
                      params: { postId: item._id },
                    })
                  }
                  onMenuPress={() => setSelectedPostForRepost(item._id)}
                  onLikePress={() =>
                    console.log(`Like pressed for post ${item._id}`)
                  }
                  onCommentPress={() =>
                    console.log(`Comment pressed for post ${item._id}`)
                  }
                  onSharePress={() =>
                    console.log(`Share pressed for post ${item._id}`)
                  }
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <CustomText
                fontSize={14}
                fontFamily="regular"
                color={COLORS.greyMedium}
                style={{ textAlign: "center", marginTop: verticalScale(20) }}
              >
                No posts available
              </CustomText>
            }
          />
        )}
      </>
    );
  }, [navigation, isGroup, posts]);

  // ------------------------ RENDER TAB BUTTON ---------------------------
  const renderButton = (title: string) => (
    <TouchableOpacity
      key={title}
      style={[styles.tabButton, activeTab === title && styles.activeTabButton]}
      onPress={() => setActiveTab(title)}
    >
      <CustomText
        fontSize={16}
        fontFamily="bold"
        color={activeTab === title ? COLORS.white : COLORS.greyMedium}
      >
        {title}
      </CustomText>
    </TouchableOpacity>
  );

  // ------------------------ COMPONENT RETURN ---------------------------
  return (
    <View style={styles.container}>
      <View style={styles.row}>{["Post", "Events"].map(renderButton)}</View>
      {activeTab === "Post" && renderPosts()}

      {activeTab === "Events" && <DatingEventCard events={events || []} />}

      {activeTab === "Likes" && (
        <CustomText
          fontSize={14}
          fontFamily="regular"
          color={COLORS.greyMedium}
          style={{ textAlign: "center", marginTop: verticalScale(20) }}
        >
          Liked posts will appear here
        </CustomText>
      )}
    </View>
  );
};

export default PostLikesEventsCard;

// ------------------------ STYLES ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: horizontalScale(20),
  },
  tabButton: {
    paddingVertical: verticalScale(15),
    width: horizontalScale(100),
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.darkPink,
  },
});
