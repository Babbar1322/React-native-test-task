import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import IMAGES from "../../Assets/Images";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../../Components/CustomText";
import CustomIcon from "../../Components/CustomIcon";

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const onStartPlay = async () => {
    try {
      await audioRecorderPlayer.startPlayer(audioUrl);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentPosition(e.currentPosition);
        setDuration(e.duration || 0);
        if (e.currentPosition >= e.duration) {
          setIsPlaying(false);
          setCurrentPosition(0);
          audioRecorderPlayer.stopPlayer();
        }
      });
      setIsPlaying(true);
    } catch (error) {
      console.log("Playback error:", error);
    }
  };

  const onPausePlay = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } catch (error) {
      console.log("Pause error:", error);
    }
  };

  const onSeek = async (event) => {
    const { locationX } = event.nativeEvent;
    const percentage = locationX / barWidth;
    const seekTime = duration * percentage;
    await audioRecorderPlayer.seekToPlayer(seekTime);
    setCurrentPosition(seekTime);
  };

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [audioUrl]);

  return (
    <View style={{ paddingVertical: verticalScale(10) }}>
      <View style={styles.audioContainer}>
        <TouchableOpacity
          onPress={() => (isPlaying ? onPausePlay() : onStartPlay())}
        >
          <CustomIcon
            Icon={isPlaying ? ICONS.PauseIcon : ICONS.PlayIcon}
            height={20}
            width={20}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Pressable
            style={styles.progressBar}
            onPress={onSeek}
            onLayout={(e: LayoutChangeEvent) =>
              setBarWidth(e.nativeEvent.layout.width)
            }
          >
            <View
              style={{
                ...styles.progressFill,
                width: `${(currentPosition / duration) * 100 || 0}%`,
              }}
            />
          </Pressable>

          <View style={styles.timerRow}>
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              {formatTime(currentPosition)}
            </CustomText>
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              {formatTime(duration)}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

const InteractionItem = ({ icon, count, onPress }) => (
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

const InteractionFooter = ({
  likesCount,
  commentsCount,
  repostCount,
  onLikePress,
  onCommentPress,
  onRepostPress,
  onSharePress,
}) => (
  <View style={styles.footer}>
    <InteractionItem
      icon={ICONS.PostComment}
      count={commentsCount}
      onPress={onCommentPress}
    />
    <InteractionItem
      icon={ICONS.PostLike}
      count={likesCount}
      onPress={onLikePress}
    />
    <InteractionItem
      icon={ICONS.PostRepost}
      count={repostCount}
      onPress={onRepostPress}
    />
    <TouchableOpacity onPress={onSharePress} style={styles.shareButton}>
      <CustomIcon Icon={ICONS.PostShare} height={20} width={20} />
    </TouchableOpacity>
  </View>
);

const PostScreen = () => {
  const audioUrl =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingBottom: verticalScale(20),
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(5),
          paddingHorizontal: horizontalScale(16),
        }}
      >
        <CustomText fontFamily="medium" fontSize={12} color={COLORS.greyLight}>
          Review
        </CustomText>
        <CustomIcon Icon={ICONS.DropIcon} height={12} width={12} />
      </View>

      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <Image
              source={IMAGES.BaccvsSpecial9}
              style={{ height: 32, width: 32, borderRadius: 16 }}
            />
            <CustomText fontFamily="bold" fontSize={14} color={COLORS.white}>
              LUTFAN PERMADI{` `}
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
              >
                1h
              </CustomText>
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.DotMenu} height={20} width={20} />
        </View>

        <CustomText fontFamily="medium" fontSize={12} color={COLORS.greyLight}>
          Karaoke?? Say less 🎤 I'll be there, and I'm expecting a duet. What's
          your go-to song?
        </CustomText>

        <InteractionFooter
          commentsCount={300}
          likesCount={100}
          repostCount={647}
          onCommentPress={() => console.log("Comment pressed")}
          onLikePress={() => console.log("Like pressed")}
          onRepostPress={() => console.log("Repost pressed")}
          onSharePress={() => console.log("Share pressed")}
        />
      </View>

      <View style={styles.bottomLine} />

      <View style={styles.commentContainer}>
        <View style={styles.postHeader}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <Image
              source={IMAGES.slide1}
              style={{ height: 32, width: 32, borderRadius: 16 }}
            />
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
              Warsa Sirait{` `}
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
              >
                1h
              </CustomText>
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.DotMenu} height={20} width={20} />
        </View>

        <AudioPlayer audioUrl={audioUrl} />

        <InteractionFooter
          commentsCount={300}
          likesCount={100}
          repostCount={647}
          onCommentPress={() => console.log("Comment pressed")}
          onLikePress={() => console.log("Like pressed")}
          onRepostPress={() => console.log("Repost pressed")}
          onSharePress={() => console.log("Share pressed")}
        />
      </View>

      <View style={styles.bottomLine} />
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {},
  postContainer: {
    gap: verticalScale(15),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(5),
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderColor: COLORS.voilet,
    marginTop: verticalScale(20),
    width: "100%",
  },
  commentContainer: {
    paddingTop: verticalScale(20),
    gap: verticalScale(10),
    padding: horizontalScale(16),
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    gap: horizontalScale(2),
  },
  shareButton: {},
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.inputColor,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.white,
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 2,
  },
});
