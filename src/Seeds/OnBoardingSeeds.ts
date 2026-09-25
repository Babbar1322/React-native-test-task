import IMAGES from "../Assets/Images";

export type SlideType = {
  id: string;
  image: any;
  title: string;
  subtitle: string;
};

const OnBoardingSlides: SlideType[] = [
  {
    id: "1",
    image: IMAGES.slide1,
    title: "Find Events, Meet People",
    subtitle:
      "Discover local events and meet like-minded people who share your vibe.",
  },
  {
    id: "2",
    image: IMAGES.slide2,
    title: "Your Social Circle, Expanded",
    subtitle:
      "Connect with matches, build friendships, and create unforgettable memories.",
  },
];

export default OnBoardingSlides;
