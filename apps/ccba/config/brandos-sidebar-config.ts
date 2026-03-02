import { PiHandshakeDuotone } from "react-icons/pi";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { RiLoopRightLine } from "react-icons/ri";
import { LuBrain, LuFingerprint, LuShare } from "react-icons/lu";
import { AiOutlinePieChart } from "react-icons/ai";
import { TbMobiledata } from "react-icons/tb";

export const BrandOSConfig: any = {
    mainNav: [
        {
            title: "Start New Engagement",
            href: "/dashboard/brandos-v2.1/setup",
            icon: PiHandshakeDuotone
        },
        {
            title: "Data Gathering",
            href: "/dashboard/brandos-v2.1/gather",
            icon: AiOutlinePieChart
        },
        // {
        //     title: "Phase 0 Outside-In Audit",
        //     href: "/dashboard/brandos-v2.1/phase-0",
        //     icon: LuBrain
        // },
        // {
        //     title: "Phase 1 Extraction & Bio",
        //     href: "/dashboard/brandos-v2.1/phase-1",
        //     icon: LuFingerprint
        // },
        // {
        //     title: "Phase 2 Syn & Reporting",
        //     href: "/dashboard/brandos-v2.1/phase-2",
        //      icon: RiLoopRightLine
        // },

        // {
        //     title: "Export & Handoff",
        //     href: "/dashboard/brandos-v2.1/export",
        //      icon: LuShare
        // },
        // {
        //     title: "Intention Intelligence",
        //     href: "/dashboard/bvo",
        //     desc: 'Define the brand you intend to express and scale.',
        //     icon: PiHandshakeDuotone
        // },
        // {
        //     title: "Ground Truth & Content Studio",
        //     href: "/dashboard/cge",
        //     desc: ' Reconcile perception and intention activate system logic and creation.',
        //     icon: MdOutlineBrandingWatermark
        // },
        // {
        //     title: "Evolution Loop",
        //     href: "/dashboard/cbc",
        //     desc: 'Monitor, learn, refine with human-approved improvements.',
        //     icon: RiLoopRightLine
        // },
    ],
    secondaryNav: [
        // {
        //     title: "Usage",
        //     url: "/dashboard/usage",
        //     icon: AiOutlinePieChart
        // },
        // {
        //     title: "API Keys",
        //     url: "/dashboard/keys",
        //     icon: AiOutlineKey
        // },
        // {
        //     title: "Settings",
        //     url: "/dashboard/settings",
        //     icon: AiOutlineSetting,
        //     isActive: true
        // },
    ],
};

export const siteConfig = {
    name: "Brand OS | Humanbrand AI",
    url: "http://localhost:3000",
    description: "Get Brand Clarity & Visibility by Brand OS",
};