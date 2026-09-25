import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { fetchData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

const InteractionItem = ({
  icon,
  count,
  onPress,
}: {
  icon: any;
  count: number;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={styles.interactionItem}
  >
    <CustomIcon Icon={icon} height={20} width={20} />
    <CustomText fontFamily="medium" fontSize={12} color={COLORS.greyMedium}>
      {count}
    </CustomText>
  </TouchableOpacity>
);

export type PostCardWithIdProps = {
  id: string;
  isFromRepost?: boolean;
  onPress?: () => void;
};

const PostCardWithId: FC<PostCardWithIdProps> = ({
  id,
  isFromRepost,
  onPress,
}) => {
  const [postData, setPostData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch post data by ID
  useEffect(() => {
    const fetchPostById = async () => {
      try {
        setLoading(true);
        const response = await fetchData(`${ENDPOINTS.CreatePost}/${id}`);

        if (response.data.success) {
          console.log(
            "PostCardWithId: Post data fetched successfully:",
            response.data.data
          );

          setPostData(response.data.data);
        } else {
          const errorMsg = response.data.message || "Failed to fetch post";
          setError(errorMsg);
          console.error("PostCardWithId: Failed to fetch post:", {
            message: response.data.message,
            status: response.status,
            data: response.data,
          });
        }
      } catch (error) {
        const errorMsg = "Failed to load post";
        setError(errorMsg);
        console.error("PostCardWithId: Error fetching post:", {
          error,
          id,
          endpoint: `${ENDPOINTS.CreatePost}${id}`,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostById();
    }
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.darkPink} />
      </View>
    );
  }

  // Show error state
  if (error || !postData) {
    return (
      <View style={styles.container}>
        <CustomText color={COLORS.primaryPink}>
          {error || "Post not found"}
        </CustomText>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        !isFromRepost && onPress ? onPress() : null;
      }}
      activeOpacity={isFromRepost ? 1 : 0.8}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: getFullImageUrl(postData?.user?.photos?.[0]),
            }}
            style={styles.profilePic}
            resizeMode="cover"
          />
          <CustomText fontFamily="bold" fontSize={14}>
            {postData?.user?.userName}
          </CustomText>
          <View style={styles.onlineDot} />
          <CustomText fontSize={12}>
            {new Date(postData?.createdAt).toLocaleDateString() || ""}
          </CustomText>
        </View>
        {!isFromRepost && (
          <TouchableOpacity onPress={() => {}} style={styles.menuButton}>
            <CustomIcon Icon={ICONS.DotMenu} />
          </TouchableOpacity>
        )}
      </View>

      <CustomText fontFamily="medium" fontSize={12} color={COLORS.greyLight}>
        {postData?.content || postData?.description || ""}
      </CustomText>
      {postData?.photos?.length > 0 &&
        postData?.photos.map((photo: string, index: number) => (
          <Image
            key={index}
            source={{ uri: getFullImageUrl(photo) }}
            style={styles.postImage}
          />
        ))}

      {!isFromRepost && (
        <View style={styles.footer}>
          <InteractionItem
            icon={ICONS.PostComment}
            count={postData?.commentsCount || 0}
            onPress={() => {}}
          />
          <InteractionItem
            icon={ICONS.PostLike}
            count={postData?.likesCount || 0}
            onPress={() => {}}
          />
          <InteractionItem
            icon={ICONS.PostRepost}
            count={postData?.repostsCount || 0}
            onPress={() => {}}
          />
          <TouchableOpacity 
            onPress={async () => {
              try {
                const shareUrl = `https://baccvs.com/post/${id}`;
                await Share.share({
                  message: `Check out this post on Baccvs: ${shareUrl}`,
                  url: shareUrl,
                });
              } catch (error) {
                console.error("Error sharing post:", error);
              }
            }} 
            style={styles.shareButton}
          >
            <CustomIcon Icon={ICONS.PostShare} height={20} width={20} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PostCardWithId;

const styles = StyleSheet.create({
  container: {
    padding: verticalScale(20),
    width: wp(100),
    gap: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  profilePic: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  onlineDot: {
    height: 3,
    width: 3,
    borderRadius: 100,
    backgroundColor: COLORS.greyMedium,
  },
  menuButton: {
    paddingHorizontal: horizontalScale(10),
  },
  postImage: {
    height: hp(26),
    borderRadius: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
});
