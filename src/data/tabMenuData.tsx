import { BiLineChart } from "react-icons/bi";
import { FaAlignCenter } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { ReactNode } from "react";

// Define the type for TabMenu
interface TabMenuItem {
  title: string;
  link: string;
  param: string;
  icon: ReactNode;
}

// Define the TabMenu array with the correct type
export const TabMenu: TabMenuItem[] = [
  {
    title: "Items",
    link: "?activeTab=items",
    param: "items",
    icon: <FaAlignCenter />,
  },
  {
    title: "Offers",
    link: "?activeTab=offers",
    param: "offers",
    icon: <MdOutlineLocalOffer />,
  },
  {
    title: "Activity",
    link: "?activeTab=activity",
    param: "activity",
    icon: <BiLineChart />,
  },
];

export const ModalTabMenu: string[] = ["Overview", "Activity", "Offers"];
