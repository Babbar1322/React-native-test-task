const notificationsData = [
  {
    id: "1",
    type: "match",
    user: {
      name: "Jerome",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    message: "Congrats. It’s a match! Jerome thinks you’re hot.",
    time: "1h",
    isSeen: false,
  },
  {
    id: "2",
    type: "event",
    event: {
      name: "Speed Dating & Trivia Night",
      image: "https://example.com/event-image.jpg",
    },
    message: "The Speed Dating & Trivia Night party is happening tomorrow.",
    time: "14h",
    isSeen: false,
  },
  {
    id: "3",
    type: "comment",
    user: {
      name: "Cody Fisher",
      profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    message:
      "Cody Fisher commented on your post: That sounds amazing! Drop the location. I need this vibe in my life! 🤩🙌",
    time: "2d",
    isSeen: true,
  },
  {
    id: "4",
    type: "reply",
    user: {
      name: "Devon Lane",
      profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    message:
      "Devon Lane replied to your comment: You already know! The DJ’s killing it tonight — nonstop bangers. 🎊🔥",
    time: "2d",
    isSeen: true,
  },
  {
    id: "5",
    type: "like_comment",
    user: {
      name: "Devon Lane",
      profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    message:
      "Devon Lane liked your comment: Rooftop bars are undefeated! Hope the playlist matches the vibes. 🎶🔥",
    time: "2d",
    isSeen: true,
  },
  {
    id: "6",
    type: "like_post",
    user: {
      name: "Devon Lane",
      profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    message: "Devon Lane liked your post",
    post: {
      text: "Me: 'I’m staying in tonight.' Also me: gets FOMO and heads to the party at 11 PM. 🤦‍♂️😂",
      image: "https://example.com/post-image.jpg",
    },
    time: "2d",
    isSeen: true,
  },
  {
    id: "7",
    type: "match",
    user: {
      name: "Helen",
      profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    message: "Congrats. It’s a match! Helen likes you.",
    time: "2d",
    isSeen: true,
  },
  {
    id: "8",
    type: "match",
    user: {
      name: "Lida",
      profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    message: "Congrats. It’s a match! Lida thinks you’re charming.",
    time: "2d",
    isSeen: true,
  },
  {
    id: "9",
    type: "event",
    event: {
      name: "Sunset Jazz & Wine Night",
      image: "https://example.com/event-image2.jpg",
    },
    message: "The Sunset Jazz & Wine Night party is happening tomorrow.",
    time: "4d",
    isSeen: true,
  },
];

export default notificationsData;
