import { VscFileSubmodule } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
export const primaryNav = [
  {
    name: "Comparator",
    link: "/comparator",
    icon: <VscFileSubmodule size={25}/>,
  },
  {
    name: "Logout",
    link: "/logout",
    icon: <CiLogout size={25}/>,
  },
];

export const ComparatorNav = [
  {
    cardName: "Add all Files",
    link: "/comparator/add-files",
    description: "Add all files",
    icon: <AddToDriveIcon sx={{ fontSize: 50 }} color="primary"/>,
  },
  {
    cardName: "Weigh File",
    link: "/comparator/compare-report",
    description: "Compare files",
    icon: <AddToDriveIcon sx={{ fontSize: 50 }} color="primary"/>,
  },
  {
    cardName: "Delete File",
    link: "/comparator/delete-report",
    description: "Delete files",
    icon: <AddToDriveIcon sx={{ fontSize: 50 }} color="primary"/>,
  },
];
