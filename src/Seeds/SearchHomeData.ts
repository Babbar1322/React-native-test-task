import ICONS from "../Assets/Icons";

export type CategoryType = {
  id: string;
  name: string;
  icon: any;
};

const categoriesData: CategoryType[] = [
  { id: "1", name: "People", icon: ICONS.PeopleTagIcon },
  { id: "2", name: "Events", icon: ICONS.EventTagIcon },
  // { id: "3", name: "Night Clubs", icon: ICONS.NightClubTagIcon },
  // { id: "4", name: "Event Organizers", icon: ICONS.EventOrgTagICon },
  // { id: "5", name: "Bars", icon: ICONS.BarTagICon },
  // { id: "6", name: "DJ’s", icon: ICONS.DJTagICon },
];

export const categoriesDataForMap: CategoryType[] = [
  { id: "1", name: "People", icon: ICONS.PeopleTagIcon },
  { id: "2", name: "Events", icon: ICONS.EventTagIcon },
];

export { categoriesData };
