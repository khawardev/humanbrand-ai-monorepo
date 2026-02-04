import { FilePlus, FileText, Megaphone, LifeBuoy} from "lucide-react";
import { RiChatAiLine } from "react-icons/ri";
import { RiChatAiFill } from "react-icons/ri";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";

export const AIAGConfig: any = {
  sidebarTitle: "Saved Sessions",
  mainNav: [
    // {
    //   title: "Prompt Kit",
    //   href: "/dashboard/prompt-kit",
    //   icon: RiChatAiLine,
    //   fillIcon: RiChatAiFill,
    // },
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
      title: "Support",
      href: "/dashboard/support",
      icon: LifeBuoy,
      fillIcon: LifeBuoy,
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
  "riz@humanbrand.ai",
  "john@humanbrand.ai",
  "aaron@humanbrand.ai",
];

export const ADMIN_SUPPORT_EMAILS = [
  "khawar@humanbrand.ai",
  "riz@humanbrand.ai",
];
