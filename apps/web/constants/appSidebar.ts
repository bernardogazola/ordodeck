import { LayoutDashboardIcon, SquareKanbanIcon } from "lucide-react";
import ROUTES from "@/constants/routes";
const APP_SIDEBAR = {
  navMain: [
    {
      title: "Geral",
      items: [
        {
          title: "Dashboard",
          url: ROUTES.DASHBOARD,
          icon: LayoutDashboardIcon,
        },
        {
          title: "Quadros",
          url: ROUTES.BOARDS,
          icon: SquareKanbanIcon,
        },
      ],
    },
  ],
};

export default APP_SIDEBAR;
