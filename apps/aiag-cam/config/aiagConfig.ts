import { Megaphone, LifeBuoy, Sparkles, LayoutDashboard, PlusCircle } from "lucide-react";
import { RiChatAiLine, RiChatAiFill } from "react-icons/ri";
import { MdOutlineAdminPanelSettings, MdAdminPanelSettings } from "react-icons/md";
import { SiLoom } from "react-icons/si";
import { LuBadgePlus } from "react-icons/lu";
import { BiCollection } from "react-icons/bi";

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
      icon: LuBadgePlus,
      fillIcon: LuBadgePlus,
    },
    {
      title: "Existing",
      href: "/dashboard/existing",
      icon: BiCollection,
      fillIcon: BiCollection,
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
      title: "Instructions",
      href: "/dashboard/instructions",
      icon: SiLoom,
      fillIcon: SiLoom,
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
