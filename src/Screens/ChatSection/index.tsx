import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import io, { Socket as SocketType } from "socket.io-client";
import { fetchData, patchData, postData } from "../../APIService/api";
import { Data } from "../../APIService/ApiResponse/GetAllConversationResponse";
import { GetCommunityConversationAPIResponse } from "../../APIService/ApiResponse/GetCommunitConversationAPIResponse";
import {
  getConversationApiResponse,
  getSquadConversationApiResponse,
  IndividualChatApiResponse,
} from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";

import ManageChats from "../../Components/BottomSheets/ManageChats";
import MuteNotification from "../../Components/BottomSheets/MuteNotification";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import BlockAlertModal from "../../Components/Modals/BlockAlertModal";
import DeleteChatAlertModal from "../../Components/Modals/DeleteChatAlertModal";
import LeaveGroupAlertModal from "../../Components/Modals/LeaveGroupAlertModal";
import { blockUser } from "../../Redux/slices/blockedUsersSlice";
import {
  deleteConversation,
  setConversations,
  togglePinConversation,
} from "../../Redux/slices/GetAllConversationsSlice";
import {
  setIsBlockAlertModalVisible,
  setIsDeleteChatAlertModalVisible,
  setIsLeaveGroupModalVisible,
} from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { ChatSectionProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import STORAGE_KEYS from "../../Utilities/Constants";
import {
  getFullImageUrl,
  getStaticBackgroundImage,
} from "../../Utilities/Helpers";
import { horizontalScale } from "../../Utilities/Metrics";
import { getLocalStorageData } from "../../Utilities/Storage";
import styles from "./styles";

const ChatSection: FC<ChatSectionProps> = ({ navigation, route }) => {
  const manageChatRef = useRef<RBSheetRef>(null);
  const muteNotificationRef = useRef<RBSheetRef>(null);
  const dispatch = useAppDispatch();
  const {
    participantData,
    convertSationType,
    conversationId, // For API calls (community ID for communities, conversation ID for others)
    actualConversationId, // For socket events (always the conversation ID)
    isAdmin,
    permissions, // Community permissions passed from Messages screen
    initialMessage, // Initial message from match screen
  } = route.params;

  console.log(
    participantData,
    convertSationType,
    conversationId,
    actualConversationId,
    isAdmin,
    permissions,
    initialMessage,
  );

  const { userData } = useAppSelector((state) => state.user);
  const { conversations } = useAppSelector((state) => state.conversation);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState<string>(""); // For community chats
  const [isOnline, setIsOnline] = useState(false);
  const [unblockMessage, setUnblockMessage] = useState("");
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<SocketType | null>(null);

  const myId = userData?._id;

  // Determine conversation type
  const isIndividual = convertSationType === "individual";
  const isSquad = convertSationType === "squad";
  const isCommunity = convertSationType === "community";
  const isGroup = isSquad || isCommunity;

  // Use actualConversationId for socket events, conversationId for API calls
  const socketConversationId = actualConversationId || conversationId;

  // Send initial message from match screen if provided
  useEffect(() => {
    if (initialMessage && socket && isIndividual) {
      // Set the message in the input field
      setMessage(initialMessage);

      // Auto-send the message after a short delay to ensure socket is ready
      const timer = setTimeout(async () => {
        if (!initialMessage.trim() || !socket) return;

        try {
          const body = {
            recipientId: participantData[0]._id,
            text: initialMessage.trim(),
            messageType: "text",
          };

          const response = await postData<IndividualChatApiResponse>(
            ENDPOINTS.individualChat,
            body,
          );

          if (
            response?.data?.success &&
            response?.data?.data?.populatedMessage
          ) {
            const newMsg = response.data.data.populatedMessage;

            socket.emit("send_message", {
              conversationId: socketConversationId,
              message: {
                _id: newMsg._id,
                text: newMsg.text,
                sender: newMsg.sender,
                createdAt: newMsg.createdAt,
              },
              sender: myId,
            });

            const formattedMessage = {
              id: newMsg._id,
              sender: newMsg.sender._id,
              userName: newMsg.sender.userName,
              message: newMsg.text,
              timestamp: newMsg.createdAt,
              isGroup: false,
              read: false,
            };

            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMsg._id);
              if (!exists) {
                const updated = [...prev, formattedMessage];
                saveMessages(updated);
                return updated;
              }
              return prev;
            });

            // Clear the message input after sending
            setMessage("");
          }
        } catch (error) {
          console.error("Error sending initial message:", error);
        }
      }, 1000); // 1 second delay to ensure socket connection is ready

      return () => clearTimeout(timer);
    }
  }, [initialMessage, socket, isIndividual]); // Only run when these dependencies change

  // Get conversation data from Redux
  // For communities, actualConversationId is the conversation ID
  // For others, conversationId is the conversation ID
  const currentConversation = conversations?.all?.find(
    (conv) => conv._id === (actualConversationId || conversationId),
  );

  // Get background settings from Redux state (always use Redux as source of truth)
  const chatBackground = currentConversation?.backgroundSettings || null;

  // For individual chats, get the other participant
  const selectedUser =
    isIndividual && participantData?.length > 0 ? participantData[0] : null;

  // For community chats, get community data
  const community = isCommunity ? currentConversation?.community : null;

  // For community chats, conversationId is actually the community ID
  const communityId = isCommunity ? conversationId : null;

  const squad = isSquad ? currentConversation?.squad : null;
  const squadId = isCommunity ? conversationId : null;

  console.log(squad, squadId);

  // Initialize Socket.IO
  useEffect(() => {
    const handleToken = async () => {
      const storedToken = await getLocalStorageData(STORAGE_KEYS.token);
      if (storedToken) {
        setToken(storedToken);
      }
    };
    handleToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const socketInstance = io("https://api.baccvs.com", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: `Bearer ${token}`,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !myId || !conversationId) return;

    // ============================================
    // SOCKET CONNECTION & GENERAL EVENTS
    // ============================================
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      // Emit user_connected
      socket.emit("user_connected", myId);

      // Join conversation based on type
      if (isSquad) {
        socket.emit("join_squad_conversations", myId);
      } else if (isCommunity) {
        socket.emit("join_community_conversations", myId);
      } else {
        socket.send(`conversation:${socketConversationId}`);
      }
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
    });

    // Generic error handler
    socket.on("error", (error) => {
      console.log("Socket error:", error);
      Toast.show({
        type: "error",
        text1: error.message || "An error occurred",
      });
    });

    // User status updates (individual chats only)
    socket.on("user_status_changed", ({ userId, status }) => {
      if (userId === selectedUser) {
        setIsOnline(status === "online");
      }
    });

    // ============================================
    // INDIVIDUAL CHAT EVENTS
    // ============================================
    socket.on(
      "receive_message",
      ({ conversationId: receivedConversationId, message }) => {
        if (
          receivedConversationId === socketConversationId &&
          message.sender !== myId
        ) {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === message._id);
            if (exists) return prev;
            const updated = [
              ...prev,
              {
                id: message._id || Date.now().toString(),
                sender: message.sender?._id || message.sender,
                userName: message.sender?.userName || "Unknown",
                message: message.text,
                timestamp: message.createdAt || new Date(),
                attachment: message.mediaUrl || null,
                isGroup: false,
                read: false,
              },
            ];
            saveMessages(updated);
            setTimeout(scrollToBottom, 100);
            return updated;
          });
        }
      },
    );

    socket.on(
      "new_message_notification",
      ({ conversationId: notifiedConversationId, sender, message }) => {
        if (
          notifiedConversationId === socketConversationId &&
          sender !== myId
        ) {
          Toast.show({
            type: "customToast",
            text1: `New message from ${selectedUser?.userName || "User"}`,
            text2: message,
          });
          console.log(`New message notification from ${sender}`);
        }
      },
    );

    socket.on(
      "user_typing",
      ({ conversationId: typingConversationId, userId, isTyping: typing }) => {
        if (typingConversationId === socketConversationId && userId !== myId) {
          setIsTyping(typing);
        }
      },
    );

    socket.on(
      "messages_read",
      ({ conversationId: readConversationId, userId }) => {
        if (readConversationId === socketConversationId && userId !== myId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === myId && !msg.read ? { ...msg, read: true } : msg,
            ),
          );
        }
      },
    );

    // ============================================
    // SQUAD CHAT EVENTS
    // ============================================
    socket.on("receive_squad_message", ({ squadConversationId, message }) => {
      if (
        squadConversationId === socketConversationId &&
        message.sender !== myId
      ) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === message._id);
          if (exists) return prev;
          const updated = [
            ...prev,
            {
              id: message._id || Date.now().toString(),
              sender: message.sender?._id || message.sender,
              userName: message.sender?.userName || "Unknown",
              message: message.text,
              timestamp: message.createdAt || new Date(),
              attachment: message.mediaUrl || null,
              isGroup: true,
              read: false,
            },
          ];
          saveMessages(updated);
          setTimeout(scrollToBottom, 100);
          return updated;
        });
      }
    });

    socket.on(
      "new_squad_message_notification",
      ({ squadConversationId, sender, message }) => {
        if (squadConversationId === socketConversationId && sender !== myId) {
          Toast.show({
            type: "customToast",
            text1: `New squad message from ${sender}`,
            text2: message,
          });
        }
      },
    );

    socket.on(
      "user_squad_typing",
      ({ squadConversationId, userId, isTyping: typing }) => {
        if (squadConversationId === socketConversationId && userId !== myId) {
          setIsTyping(typing);
        }
      },
    );

    socket.on("squad_messages_read", ({ squadConversationId, userId }) => {
      if (squadConversationId === socketConversationId && userId !== myId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === myId && !msg.read ? { ...msg, read: true } : msg,
          ),
        );
      }
    });

    // ============================================
    // COMMUNITY CHAT EVENTS
    // ============================================
    socket.on(
      "community_message_received",
      ({ communityConversation, message }) => {
        // Backend sends "communityConversation" not "communityConversationId"
        if (
          communityConversation === socketConversationId &&
          message.sender?._id !== myId
        ) {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === message._id);
            if (exists) return prev;
            const updated = [
              ...prev,
              {
                id: message._id || Date.now().toString(),
                sender: message.sender?._id || message.sender,
                userName: message.sender?.userName || "Unknown",
                message: message.text,
                timestamp: message.createdAt || new Date(),
                attachment: message.mediaUrl || null,
                isGroup: true,
                isCommunity: true,
                read: false,
              },
            ];
            saveMessages(updated);
            setTimeout(scrollToBottom, 100);
            return updated;
          });
        }
      },
    );

    socket.on(
      "new_community_message_notification",
      ({ communityConversationId, sender, message }) => {
        if (
          communityConversationId === socketConversationId &&
          sender !== myId
        ) {
          Toast.show({
            type: "customToast",
            text1: `New community message from ${sender}`,
            text2: message,
          });
        }
      },
    );

    socket.on(
      "user_community_typing",
      ({ communityConversationId, userId, isTyping: typing }) => {
        if (
          communityConversationId === socketConversationId &&
          userId !== myId
        ) {
          setIsTyping(typing);

          // Find the user's name from community members
          if (typing && community?.members) {
            const typingUser = community.members.find(
              (member) => member.user._id === userId,
            );
            if (typingUser) {
              setTypingUserName(typingUser.user.userName);
            }
          } else {
            setTypingUserName("");
          }
        }
      },
    );

    socket.on(
      "community_messages_read",
      ({ communityId: receivedCommunityId, userId }) => {
        // Backend sends communityId, we need to check if it matches our communityId
        if (receivedCommunityId === communityId && userId !== myId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === myId && !msg.read ? { ...msg, read: true } : msg,
            ),
          );
        }
      },
    );

    // Cleanup all socket listeners
    return () => {
      // General events
      socket.off("connect");
      socket.off("connect_error");
      socket.off("error");
      socket.off("user_status_changed");

      // Individual chat events
      socket.off("receive_message");
      socket.off("new_message_notification");
      socket.off("user_typing");
      socket.off("messages_read");

      // Squad chat events
      socket.off("receive_squad_message");
      socket.off("new_squad_message_notification");
      socket.off("user_squad_typing");
      socket.off("squad_messages_read");

      // Community chat events
      socket.off("community_message_received");
      socket.off("new_community_message_notification");
      socket.off("user_community_typing");
      socket.off("community_messages_read");
    };
  }, [
    socket,
    myId,
    conversationId,
    socketConversationId,
    selectedUser,
    isGroup,
    isSquad,
    isCommunity,
  ]);

  // Fetch messages
  const fetchConversationMessage = async () => {
    try {
      const response = await fetchData<getConversationApiResponse>(
        `${ENDPOINTS.getConversationMessages}/${conversationId}/messages`,
      );

      if (response?.data?.success) {
        const formattedMessages = response?.data.data.messages.map((msg) => ({
          id: msg._id,
          sender: msg.sender._id,
          userName: msg.sender.userName,
          message: msg.text,
          timestamp: msg.createdAt,
          isGroup: false,
          read: msg.readBy?.some((read: any) => read.user === myId),
        }));

        setMessages(formattedMessages);
        saveMessages(formattedMessages);
        setTimeout(scrollToBottom, 100);

        // Mark messages as read
        socket?.emit("mark_read", {
          conversationId: socketConversationId,
          userId: myId,
        });
      } else {
        // Try loading from cache if API fails
        await loadMessagesFromCache();
      }
    } catch (error) {
      console.log(
        "Failed to fetch conversation messages, loading from cache:",
        error,
      );
      // Load cached messages as fallback
      await loadMessagesFromCache();
    }
  };

  const fetchSquadConversationMessage = async () => {
    try {
      const response = await fetchData<getSquadConversationApiResponse[]>(
        `${ENDPOINTS.getSquadConversation}/${conversationId}/messages`,
      );

      if (response?.data?.success) {
        const formattedMessages = response?.data?.data?.map((msg) => ({
          id: msg._id,
          sender: msg.sender?._id,
          userName: msg.sender?.userName || "Unknown",
          message: msg.text,
          timestamp: msg.createdAt,
          isGroup: true,
          isSquad: true,
          read: msg.readBy?.some((read: any) => read.user === myId),
        }));

        setMessages(formattedMessages);
        saveMessages(formattedMessages);
        setTimeout(scrollToBottom, 100);

        // Mark squad messages as read
        socket?.emit("mark_squad_read", {
          squadConversationId: socketConversationId,
          userId: myId,
        });
      } else {
        // Try loading from cache if API fails
        await loadMessagesFromCache();
      }
    } catch (error) {
      console.log(
        "Failed to fetch squad conversation messages, loading from cache:",
        error,
      );
      // Load cached messages as fallback
      await loadMessagesFromCache();
    }
  };

  const fetchCommunityConversationMessage = async () => {
    try {
      // Use the same endpoint as individual conversations for now
      const response = await fetchData<GetCommunityConversationAPIResponse>(
        `${ENDPOINTS.getCommunityConversationMessages}/${conversationId}/messages`,
      );

      if (response?.data?.success) {
        const formattedMessages = response?.data.data.message.map((msg) => ({
          id: msg._id,
          sender: msg.sender._id,
          userName: msg.sender.userName,
          message: msg.text,
          timestamp: msg.createdAt,
          isGroup: true,
          isCommunity: true,
          read: msg.readBy?.some((read: any) => read.user === myId),
        }));

        setMessages(formattedMessages);
        saveMessages(formattedMessages);
        setTimeout(scrollToBottom, 100);

        // Mark community messages as read
        socket?.emit("mark_community_read", {
          communityId: communityId, // Backend expects communityId, not communityConversationId
          userId: myId,
        });
      } else {
        // Try loading from cache if API fails
        await loadMessagesFromCache();
      }
    } catch (error) {
      console.log(
        "Failed to fetch community conversation messages, loading from cache:",
        error,
      );
      // Load cached messages as fallback
      await loadMessagesFromCache();
    }
  };

  const loadMessagesFromCache = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem(
        `chat_${conversationId}`,
      );
      if (cachedMessages) {
        const parsedMessages = JSON.parse(cachedMessages);
        setMessages(parsedMessages);
        console.log("Loaded messages from cache");
      }
    } catch (error) {
      console.log("Failed to load messages from cache:", error);
    }
  };

  // Refresh conversation list when screen comes into focus
  // This updates the last message and unread badge in the Messages list
  const refreshConversationList = useCallback(async () => {
    try {
      const response = await fetchData<Data>(
        `${ENDPOINTS.getConversationsByType}?type=all`,
      );
      if (response?.data?.success) {
        dispatch(setConversations(response.data.data));
        console.log("Refreshed conversation list from ChatSection");
      }
    } catch (error) {
      console.log("Failed to refresh conversation list:", error);
    }
  }, [dispatch]);

  // Use focus effect to refresh conversations when returning to Messages screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Call this when screen loses focus (i.e., when going back to Messages)
        refreshConversationList();
      };
    }, [refreshConversationList]),
  );

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!message.trim() || !socket) return;

    try {
      if (isSquad) {
        // Squad message
        socket.emit("send_squad_message", {
          squadId: participantData[0]?._id,
          squadConversationId: socketConversationId,
          message: {
            text: message.trim(),
            sender: myId,
            createdAt: new Date(),
            _id: Date.now().toString(), // Temporary ID
          },
          sender: myId,
        });

        // Add to local state immediately for optimistic update
        const formattedMessage = {
          id: Date.now().toString(),
          sender: myId,
          userName: userData?.userName || "Me",
          message: message.trim(),
          timestamp: new Date(),
          attachment: null,
          isGroup: true,
          isSquad: true,
          read: false,
        };

        setMessages((prev) => {
          const updated = [...prev, formattedMessage];
          saveMessages(updated);
          return updated;
        });
      } else if (isCommunity) {
        // Community message - using 'community_message' as per backend spec
        const payload = {
          communityId: communityId, // Community ID
          senderId: myId, // Backend expects "senderId" not "sender"
          text: message.trim(), // Text directly, not nested in message object
          messageType: "text", // Backend requires messageType
        };

        console.log("Emitting community_message with payload:", payload);
        socket.emit("community_message", payload);

        // Add to local state immediately for optimistic update
        const formattedMessage = {
          id: Date.now().toString(),
          sender: myId,
          userName: userData?.userName || "Me",
          message: message.trim(),
          timestamp: new Date(),
          attachment: null,
          isGroup: true,
          isCommunity: true,
          read: false,
        };

        setMessages((prev) => {
          const updated = [...prev, formattedMessage];
          saveMessages(updated);
          return updated;
        });
      } else {
        // Individual message
        const body = {
          recipientId: participantData[0]._id,
          text: message.trim(),
          messageType: "text",
        };

        const response = await postData<IndividualChatApiResponse>(
          ENDPOINTS.individualChat,
          body,
        );

        if (response?.data?.success && response?.data?.data?.populatedMessage) {
          const newMsg = response.data.data.populatedMessage;

          socket.emit("send_message", {
            conversationId: socketConversationId,
            message: {
              _id: newMsg._id,
              text: newMsg.text,
              sender: newMsg.sender,
              createdAt: newMsg.createdAt,
            },
            sender: myId,
          });

          const formattedMessage = {
            id: newMsg._id,
            sender: newMsg.sender._id,
            userName: newMsg.sender.userName,
            message: newMsg.text,
            timestamp: newMsg.createdAt,
            isGroup: false,
            read: false,
          };

          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === newMsg._id);
            if (exists) return prev;
            const updated = [...prev, formattedMessage];
            saveMessages(updated);
            return updated;
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to send message",
          });
        }
      }

      setMessage("");

      // Emit typing stopped
      if (isSquad) {
        socket.emit("squad_typing", {
          squadConversationId: socketConversationId,
          userId: myId,
          isTyping: false,
        });
      } else if (isCommunity) {
        socket.emit("community_typing", {
          communityId: communityId, // Backend expects communityId
          userId: myId,
          isTyping: false,
        });
      } else {
        socket.emit("typing", {
          conversationId: socketConversationId,
          userId: myId,
          isTyping: false,
        });
      }

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.log("Failed to send message:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };

  // Handle typing
  const handleTyping = (text: string) => {
    setMessage(text);
    if (!socket) return;

    if (text.length > 0) {
      if (isSquad) {
        socket.emit("squad_typing", {
          squadConversationId: socketConversationId,
          userId: myId,
          isTyping: true,
        });
      } else if (isCommunity) {
        socket.emit("community_typing", {
          communityId: communityId, // Backend expects communityId
          userId: myId,
          isTyping: true,
        });
      } else {
        socket.emit("typing", {
          conversationId: socketConversationId,
          userId: myId,
          isTyping: true,
        });
      }
    } else {
      if (isSquad) {
        socket.emit("squad_typing", {
          squadConversationId: socketConversationId,
          userId: myId,
          isTyping: false,
        });
      } else if (isCommunity) {
        socket.emit("community_typing", {
          communityId: communityId, // Backend expects communityId
          userId: myId,
          isTyping: false,
        });
      } else {
        socket.emit("typing", {
          conversationId: socketConversationId,
          userId: myId,
          isTyping: false,
        });
      }
    }
  };

  const deleteCommunity = () => {
    dispatch(setIsDeleteChatAlertModalVisible(false));
    Toast.show({
      type: "customToast",
      text1: "Group deleted",
    });
    navigation.goBack();
  };

  const openLeaveCommunityModal = () => {
    manageChatRef.current?.close();
    setTimeout(() => {
      dispatch(setIsLeaveGroupModalVisible(true));
    }, 500);
  };

  const LeaveCommunity = async () => {
    try {
      const endpoint = `${ENDPOINTS.leaveCommunity}/${conversationId}`;

      const response = await patchData(endpoint);

      if (response.data.success) {
        // Remove conversation from Redux state
        dispatch(deleteConversation(actualConversationId || ""));

        Toast.show({
          type: "customToast",
          text1:
            response.data.message ||
            `${isCommunity ? "Community" : "Group"} left successfully`,
          props: { type: "success" },
        });
        dispatch(setIsLeaveGroupModalVisible(false));

        navigation.goBack();
      } else {
        Toast.show({
          type: "customToast",
          text1: response.data.message || "Failed to leave",
          props: { type: "error" },
        });
        // Reopen modal on error
        dispatch(setIsLeaveGroupModalVisible(true));
      }
    } catch (error: any) {
      console.error("Error leaving community:", error);
      Toast.show({
        type: "customToast",
        text1: error?.response?.data?.message || "Failed to leave",
        props: { type: "error" },
      });
      // Reopen modal on error
      dispatch(setIsLeaveGroupModalVisible(true));
    }
  };

  const BlockUser = async () => {
    if (selectedUser) {
      try {
        const response = await postData(
          `${ENDPOINTS.BlockUser}/${selectedUser._id}`,
        );
        if (response.data.success) {
          dispatch(
            blockUser({ _id: selectedUser._id, email: selectedUser.userName }),
          );

          Toast.show({
            type: "customToast",
            text1: response.data.message,
            props: { type: "success" },
          });
        }
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    }
    dispatch(setIsBlockAlertModalVisible(false));
  };

  const deleteChat = async () => {
    try {
      const deleteChat = await postData(
        `${ENDPOINTS.deleteConversation}/${participantData[0]._id}`,
      );

      if (deleteChat.data.success) {
        // Update Redux state to remove conversation
        dispatch(deleteConversation(actualConversationId || ""));

        Toast.show({
          type: "customToast",
          text1: deleteChat.data.message || "Chat deleted successfully",
          props: { type: "success" },
        });

        dispatch(setIsDeleteChatAlertModalVisible(false));
        navigation.goBack();
      }
    } catch (e) {
      console.error("Failed to delete chat", e);
      Toast.show({
        type: "customToast",
        text1: "Failed to delete chat",
        props: { type: "error" },
      });
      dispatch(setIsDeleteChatAlertModalVisible(false));
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const saveMessages = async (msgs: any[]) => {
    try {
      await AsyncStorage.setItem(
        `chat_${conversationId}`,
        JSON.stringify(msgs),
      );
    } catch (e) {
      console.error("Failed to save messages", e);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    if (isSquad) {
      fetchSquadConversationMessage();
    } else if (isCommunity) {
      fetchCommunityConversationMessage();
    } else {
      fetchConversationMessage();
    }
  }, [conversationId, isSquad, isCommunity]);

  const getMessageTimeStatus = (timestamp: string) => {
    const messageDate = moment(timestamp);
    const today = moment().startOf("day");
    if (messageDate.isSame(today, "day")) return "Today";
    else if (messageDate.isSame(today.clone().subtract(1, "day"), "day"))
      return "Yesterday";
    return messageDate.format("MMMD");
  };

  const renderItem = ({ item, index }: any) => {
    const prevItem: any = index > 0 ? messages[index - 1] : null;
    const showDateSeparator =
      index === 0 ||
      !moment(item?.timestamp).isSame(moment(prevItem?.timestamp), "day");

    const isMyMessage = item.sender === myId;
    const showSenderName = isCommunity && !isMyMessage && item.userName;

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <CustomText style={styles.dateSeparatorText}>
              {getMessageTimeStatus(item?.timestamp)}
            </CustomText>
          </View>
        )}
        {item?.message && (
          <View
            style={[
              styles.messageContainer,
              isMyMessage ? styles.myMessage : styles.otherMessage,
            ]}
          >
            {showSenderName && (
              <CustomText style={styles.senderName}>{item.userName}</CustomText>
            )}
            <CustomText style={styles.messageText}>{item.message}</CustomText>
          </View>
        )}
      </>
    );
  };

  const renderHeader = () => {
    // Get display name and avatar
    let displayName = "";
    let avatarUri = "";

    if (isCommunity && community) {
      displayName = community.name;
    } else if (isSquad && squad) {
      displayName = squad.title || "Squad";
    } else if (isIndividual && selectedUser) {
      displayName = selectedUser.userName;
      avatarUri = selectedUser.photos?.[0] || "";
    }

    return (
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(10),
          }}
        >
          <CustomIcon
            Icon={ICONS.backArrow}
            width={20}
            height={20}
            onPress={() => navigation.goBack()}
          />

          {isGroup ? (
            // Group/Community avatar grid
            <View style={styles.headerAvatarGrid}>
              {isCommunity && community?.members && (
                <>
                  {community.members.slice(0, 4).map((member) => (
                    <ImageBackground
                      key={member._id}
                      source={{
                        uri: getFullImageUrl(member.user.photos?.[0]),
                      }}
                      style={styles.headerGridImage}
                    />
                  ))}
                  <View style={styles.headerCenterLogo}>
                    <CustomIcon Icon={ICONS.AppLogo} height={10} width={10} />
                  </View>
                </>
              )}
              {/* // Squad fallback */}

              {isSquad && squad?.members && (
                <>
                  {squad.members.slice(0, 4).map((member) => (
                    <ImageBackground
                      key={member._id}
                      source={{
                        uri: getFullImageUrl(member.user.photos?.[0]),
                      }}
                      style={styles.headerGridImage}
                    />
                  ))}
                  <View style={styles.headerCenterLogo}>
                    <CustomIcon Icon={ICONS.AppLogo} height={10} width={10} />
                  </View>
                </>
              )}
            </View>
          ) : (
            // Individual avatar - clickable
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (selectedUser?._id) {
                  navigation.navigate("userProfile", {
                    userId: selectedUser._id,
                    isDatingButtons: false,
                    isGroup: false,
                  });
                }
              }}
            >
              <ImageBackground
                source={{
                  uri: getFullImageUrl(avatarUri),
                }}
                borderRadius={16}
                style={{ height: 32, width: 32 }}
              >
                {isOnline && (
                  <View style={styles.onlineDotContainer}>
                    <View style={styles.onlineDot} />
                  </View>
                )}
              </ImageBackground>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isGroup}
            onPress={() => {
              if (isIndividual && selectedUser?._id) {
                navigation.navigate("userProfile", {
                  userId: selectedUser._id,
                  isDatingButtons: false,
                  isGroup: false,
                });
              }
            }}
          >
            <CustomText fontSize={16} fontFamily="medium">
              {displayName}
            </CustomText>
          </TouchableOpacity>
        </View>
        <CustomIcon
          Icon={ICONS.DotMenu}
          height={20}
          width={20}
          onPress={() => {
            manageChatRef.current?.open();
          }}
        />
      </View>
    );
  };

  return (
    <>
      {chatBackground?.backgroundColor ? (
        <View
          style={[
            styles.backgroundContainer,
            { backgroundColor: chatBackground.backgroundColor },
          ]}
        >
          <SafeAreaView style={styles.safeAreaContent}>
            {renderHeader()}

            {unblockMessage !== "" && (
              <TouchableOpacity
                style={styles.unblockBanner}
                onPress={() => {
                  console.log("Unblock tapped");
                  setUnblockMessage("");
                }}
              >
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.white}
                >
                  {unblockMessage}
                </CustomText>
              </TouchableOpacity>
            )}

            {messages.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.noMessagesText}>Start a conversation!</Text>
              </View>
            )}

            {isTyping && (
              <Text style={styles.typingIndicator}>
                {isCommunity && typingUserName
                  ? `${typingUserName} is typing...`
                  : "typing..."}
              </Text>
            )}
          </SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View style={styles.messagescontainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  value={message}
                  onChangeText={handleTyping}
                  placeholder="Write a message"
                  placeholderTextColor={COLORS.greyMedium}
                  style={styles.inputs}
                  multiline
                />
                <CustomIcon
                  Icon={ICONS.SendButton}
                  height={36}
                  width={36}
                  onPress={handleSendMessage}
                />
              </View>
              {/* <CustomIcon Icon={ICONS.MicButtonIcon} height={36} width={36} /> */}
            </View>
          </KeyboardAvoidingView>
        </View>
      ) : (
        <ImageBackground
          source={
            chatBackground?.staticBackgroundImage
              ? getStaticBackgroundImage(chatBackground.staticBackgroundImage)
              : chatBackground?.backgroundImage
              ? { uri: getFullImageUrl(chatBackground.backgroundImage) }
              : IMAGES.chatBackground
          }
          style={styles.backgroundContainer}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeAreaContent}>
            {renderHeader()}

            {unblockMessage !== "" && (
              <TouchableOpacity
                style={styles.unblockBanner}
                onPress={() => {
                  console.log("Unblock tapped");
                  setUnblockMessage("");
                }}
              >
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.white}
                >
                  {unblockMessage}
                </CustomText>
              </TouchableOpacity>
            )}

            {messages.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.noMessagesText}>Start a conversation!</Text>
              </View>
            )}

            {isTyping && (
              <Text style={styles.typingIndicator}>
                {isCommunity && typingUserName
                  ? `${typingUserName} is typing...`
                  : "typing..."}
              </Text>
            )}
          </SafeAreaView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View style={styles.messagescontainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  value={message}
                  onChangeText={handleTyping}
                  placeholder="Write a message"
                  placeholderTextColor={COLORS.greyMedium}
                  style={styles.inputs}
                  multiline
                />
                {/* {message.trim() && ( */}
                <TouchableOpacity
                  disabled={!message.trim()}
                  onPress={handleSendMessage}
                >
                  <CustomIcon Icon={ICONS.SendButton} height={36} width={36} />
                </TouchableOpacity>
                {/* )} */}
              </View>
              {/* <CustomIcon Icon={ICONS.MicButtonIcon} height={36} width={36} /> */}
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      )}

      <ManageChats
        ref={manageChatRef}
        name={
          isCommunity && community
            ? community.name
            : isSquad && participantData?.length > 0
            ? participantData[0]?.userName || "Squad"
            : selectedUser?.userName || "User"
        }
        isAdmin={isAdmin}
        isPinned={currentConversation?.isPinned || false}
        onMuteChat={async () => {
          manageChatRef.current?.close();
          setTimeout(() => {
            muteNotificationRef.current?.open();
          }, 300);
        }}
        onChatNotification={() => {}}
        onChatBackground={() => {
          manageChatRef.current?.close();
          navigation.navigate("chatBackground", {
            conversationId: conversationId || "",
            conversationType: convertSationType,
            actualConversationId: actualConversationId || "",
          });
        }}
        onPinChat={async () => {
          try {
            const url = isCommunity
              ? ENDPOINTS.pinCommunityConversation
              : ENDPOINTS.pinConversation;

            const response = await postData(
              `${url}/${actualConversationId}/pin`,
            );
            if (response.data.success) {
              // Update Redux state to reflect pin status
              dispatch(togglePinConversation(actualConversationId || ""));

              Toast.show({
                type: "customToast",
                text1: response.data.message,
                props: { type: "success" },
              });
              manageChatRef.current?.close();
            } else {
              Toast.show({
                type: "customToast",
                text1: response.data.message || "Failed to pin chat",
                props: { type: "error" },
              });
            }
          } catch (error: any) {
            console.error("Error pinning chat:", error);
            Toast.show({
              type: "customToast",
              text1: error?.response?.data?.message || "Failed to pin chat",
              props: { type: "error" },
            });
          }
        }}
        onBlockPerson={() => {
          manageChatRef.current?.close();
          setTimeout(() => {
            dispatch(setIsBlockAlertModalVisible(true));
          }, 500);
        }}
        onReportPerson={() => {
          manageChatRef.current?.close();
          navigation.navigate("reportScreen", {
            id: selectedUser?._id || "",
            title:
              isCommunity && community
                ? community.name
                : isSquad && participantData?.length > 0
                ? participantData[0]?.userName || "Squad"
                : selectedUser?.userName || "User",
          });
        }}
        onChatDelete={() => {
          manageChatRef.current?.close();
          setTimeout(() => {
            dispatch(setIsDeleteChatAlertModalVisible(true));
          }, 500);
        }}
        onEditCommunity={() => {
          manageChatRef.current?.close();
          navigation.navigate("createNewCommunity", {
            isEdit: true,
            communityId: conversationId || "",
          });
        }}
        onPermissions={() => {
          manageChatRef.current?.close();
          navigation.navigate("groupMessagesPermissions", {
            communityId: actualConversationId || "",
            permissions: permissions, // Pass permissions to avoid fetching
          });
        }}
        onPrivacy={() => {
          manageChatRef.current?.close();
          navigation.navigate("groupMessagesPrivacy", {
            communityId: conversationId || "",
          });
        }}
        onLeaveCommunity={openLeaveCommunityModal}
        onReportCommunity={() => {
          manageChatRef.current?.close();
          navigation.navigate("reportScreen", {
            id: conversationId || "",
            title: community?.name || "Community",
          });
        }}
        onDeleteCommunity={() => {
          manageChatRef.current?.close();
          setTimeout(() => {
            dispatch(setIsDeleteChatAlertModalVisible(true));
          }, 500);
        }}
        isGroup={isGroup}
      />

      <MuteNotification
        ref={muteNotificationRef}
        onDone={async (value) => {
          try {
            const response = await postData(
              `${ENDPOINTS.toggleMuteConversation}/${conversationId}`,
              {
                muteType: value,
              },
            );
            if (response.data.success) {
              Toast.show({
                type: "customToast",
                text1: response.data.message,
                props: { type: "success" },
              });
              muteNotificationRef.current?.close();
            }
          } catch (error) {
            console.error("Error muting chat:", error);
          }
        }}
      />

      <DeleteChatAlertModal
        onCancel={async () => {
          dispatch(setIsDeleteChatAlertModalVisible(false));
        }}
        onConfirm={isGroup ? deleteCommunity : deleteChat}
        selectedUser={selectedUser}
        isGroup={isGroup}
      />

      <BlockAlertModal
        onCancel={() => dispatch(setIsBlockAlertModalVisible(false))}
        onConfirm={BlockUser}
      />

      <LeaveGroupAlertModal
        onCancel={() => dispatch(setIsLeaveGroupModalVisible(false))}
        onConfirm={LeaveCommunity}
        groupName={
          isCommunity && community
            ? community.name
            : isSquad && participantData?.length > 0
            ? participantData[0]?.userName || "Squad"
            : "this group"
        }
        isCommunity={isCommunity}
      />
    </>
  );
};

export default ChatSection;
