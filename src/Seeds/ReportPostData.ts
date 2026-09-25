// ReportOptions.ts
export type ReportOption = {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  reason: string;
};

export const dummyReportOptions: ReportOption[] = [
  {
    id: "1",
    title: "Inappropriate content",
    description:
      "This post contains nudity, sexually explicit material, graphic violence, hate speech, or any other content that violates community guidelines.",
    selected: false,
    reason: "inappropriate",
  },
  {
    id: "2",
    title: "Spam or Scam",
    description:
      "The post or account appears to be promotional spam, deceptive content, or a potential scam intended to take advantage of users.",
    selected: false,
    reason: "spam",
  },
  {
    id: "3",
    title: "Harassment or Bullying",
    description:
      "This post includes threats, targeted harassment, or harmful comments directed at an individual or group, creating an unsafe environment.",
    selected: false,
    reason: "harassment",
  },
  {
    id: "4",
    title: "False Information",
    description:
      "The post spreads misleading or incorrect information that could cause harm, confusion, or misrepresentation.",
    selected: false,
    reason: "false_information",
  },
  {
    id: "5",
    title: "Impersonation",
    description:
      "The user behind this post is pretending to be someone else, using fake identities or stolen content to mislead others.",
    selected: false,
    reason: "impersonation",
  },
];
