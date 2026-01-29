import { FilePlus, FileText, Megaphone} from "lucide-react";
import { RiChatAiLine } from "react-icons/ri";
import { RiChatAiFill } from "react-icons/ri";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";

export const AIAGConfig: any = {
  sidebarTitle: "Saved Sessions",
  mainNav: [
    {
      title: "AI Chat",
      href: "/dashboard/ai-chat",
      icon: RiChatAiLine,
      fillIcon: RiChatAiFill,
    },
    {
      title: "New",
      href: "/dashboard/new",
      icon: FilePlus,
      fillIcon: FilePlus,
    },
    {
      title: "Existing",
      href: "/dashboard/existing",
      icon: FileText,
      fillIcon: FileText,
    },
    {
      title: "Campaign",
      href: "/dashboard/campaign",
      icon: Megaphone,
      fillIcon: Megaphone,
    },
    {
      title: "Admin",
      href: "/dashboard/admin",
      icon: MdOutlineAdminPanelSettings,
      fillIcon: MdAdminPanelSettings,
    },
  ],
};

export const ADMIN_EMAILS = [
  "khawarsultan.developer@gmail.com",
  "rizwaniscoder@gmail.com",
  "riz@humanbrand.ai",
  "john@humanbrand.ai",
  "aaron@humanbrand.ai",
];