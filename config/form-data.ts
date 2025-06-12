import { CalendarDays, GraduationCap, Rocket, TrendingUp } from "lucide-react";
import {
    FaAward,
    FaBlog,
    FaBuilding,
    FaCalendarPlus,
    FaCrown,
    FaDownload,
    FaFacebook,
    FaFileLines,
    FaHandshake,
    FaHeadset,
    FaInstagram,
    FaLightbulb,
    FaLinkedin,
    FaMicrophone,
    FaTiktok,
    FaTwitter,
    FaUserPlus,
    FaUsers,
    FaYoutube,
    FaTruck,
} from "react-icons/fa6";
import { HiSpeakerphone } from "react-icons/hi";

import {
    MdShare,
    MdEmail,
    MdMovie,
    MdCalendarMonth,
    MdShield,
    MdInfo,
    MdSell,
    MdContentCopy,
    MdOpenInNew,
    MdSchedule,
    MdSmartToy,
    MdShoppingBag,
    MdRssFeed,
    MdCampaign
} from "react-icons/md";

import { MdRocketLaunch, MdEvent, MdSchool, MdTrendingUp } from "react-icons/md";

export const modelTabs = [
    { id: 1, label: 'Recommended', title: "Recommended " },
    { id: 2, label: 'Deeper Thinking', title: "Deep Think " },
];

export const audiences = [
    { id: 1, label: "Members", Icon: FaUsers, color: "bg-primary/15 border border-primary/50" },
    { id: 2, label: "Prospective Members", Icon: FaUserPlus, color: "bg-pink-100 border border-pink-400" },
    { id: 3, label: "Employees", Icon: FaBuilding, color: "bg-pink-100 border border-pink-400" },
    { id: 4, label: "Leadership", Icon: FaCrown, color: "bg-primary/15 border border-primary/50" },
    { id: 5, label: "Partners", Icon: FaHandshake, color: "bg-pink-100 border border-pink-400" },
    { id: 6, label: "Media", Icon: MdCampaign, color: "bg-primary/15 border border-primary/50" },
];

export const subjects = [
    { id: 1, label: "Quality", Icon: FaAward, color: "bg-primary/15 border border-primary/50" },
    { id: 2, label: "Supply Chain", Icon: FaTruck, color: "bg-pink-100 border border-pink-400" },
    { id: 3, label: "Corporate Responsibility", Icon: MdShield, color: "bg-primary/15 border border-primary/50" },
    { id: 4, label: "General AIAG", Icon: MdInfo, color: "bg-pink-100 border border-pink-400" },
];

export const contentTypes = [
    { id: 1, label: "Social Media Post", Icon: MdShare, color: "bg-primary/15 border border-primary/50" },
    { id: 2, label: "Promotional Email", Icon: MdEmail, color: "bg-pink-100 border border-pink-400" },
    { id: 3, label: "Employee Email", Icon: MdEmail, color: "bg-primary/15 border border-primary/50" },
    { id: 4, label: "Press Release", Icon: HiSpeakerphone, color: "bg-pink-100 border border-pink-400" },
    { id: 5, label: "Newsletter Article", Icon: FaBlog, color: "bg-primary/15 border border-primary/50" },
    { id: 6, label: "Video Script", Icon: MdMovie, color: "bg-primary/15 border border-primary/50" },
    { id: 7, label: "Member Event", Icon: MdCalendarMonth, color: "bg-pink-100 border border-pink-400" },
    { id: 8, label: "Whitepaper", Icon: FaFileLines, color: "bg-primary/15 border border-primary/50" },
    { id: 9, label: "Executive Speech", Icon: FaMicrophone, color: "bg-primary/15 border border-primary/50" },
    { id: 10, label: "Thought Leadership Article", Icon: FaLightbulb, color: "bg-pink-100 border border-pink-400" },
    { id: 11, label: "Advertising Copy", Icon: MdSell, color: "bg-primary/15 border border-primary/50" },
    { id: 12, label: "Website Copy Block", Icon: MdContentCopy, color: "bg-pink-100 border border-pink-400" },
];

export const ctas = [
    { id: 1, label: "Register for Event", Icon: FaCalendarPlus, color: "bg-pink-100 border border-pink-400" },
    { id: 2, label: "Download Document", Icon: FaDownload, color: "bg-primary/15 border border-primary/50" },
    { id: 3, label: "Visit Website", Icon: MdOpenInNew, color: "bg-pink-100 border border-pink-400" },
    { id: 4, label: "Join AIAG Membership", Icon: FaUserPlus, color: "bg-primary/15 border border-primary/50" },
    { id: 5, label: "Contact AIAG Support", Icon: FaHeadset, color: "bg-pink-100 border border-pink-400" },
    { id: 6, label: "Schedule Training", Icon: MdSchedule, color: "bg-primary/15 border border-primary/50" },
    { id: 7, label: "Access AI (AVA)", Icon: MdSmartToy, color: "bg-pink-100 border border-pink-400" },
    { id: 8, label: "Purchase Standard", Icon: MdShoppingBag, color: "bg-pink-100 border border-pink-400" },
    { id: 9, label: "Follow on Social Media", Icon: MdShare, color: "bg-primary/15 border border-primary/50" },
    { id: 10, label: "Subscribe to Newsletter", Icon: MdRssFeed, color: "bg-pink-100 border border-pink-400" },
];

export const socialPlatforms = [
    { id: 1, label: "LinkedIn", Icon: FaLinkedin, color: "bg-primary/15 border border-primary/50" },
    { id: 2, label: "Facebook", Icon: FaFacebook, color: "bg-pink-100 border border-pink-400" },
    { id: 3, label: "X", Icon: FaTwitter, color: "bg-primary/15 border border-primary/50" },
    { id: 4, label: "YouTube", Icon: FaYoutube, color: "bg-primary/15 border border-primary/50" },
    { id: 5, label: "Instagram", Icon: FaInstagram, color: "bg-pink-100 border border-pink-400" },
    { id: 6, label: "TikTok", Icon: FaTiktok, color: "bg-primary/15 border border-primary/50" },
];


export const campaignTypes = [
    { id: 1, label: "Product Launch", Icon: MdRocketLaunch, color: "bg-primary/15 border border-primary/50" },
    { id: 2, label: "Event or Summit Promo", Icon: MdEvent, color: "bg-pink-100 border border-pink-400" },
    { id: 3, label: "Training & Certifications", Icon: MdSchool, color: "bg-primary/15 border border-primary/50" },
    { id: 4, label: "Membership Growth & Retention", Icon: MdTrendingUp, color: "bg-pink-100 border border-pink-400" },
];

export const campaignElementsData = [
    {
        title: "Product Launch",
        elements: [
            "Vision & value whitepaper",
            "Launch press release + media kit",
            "Explainer video demonstrating",
            "Multi-tier visibility",
            "AI insights",
            "Product landing page with request form",
            "Interactive product tour or sandbox login",
            "Early-adopter pilot invitation email + flyer",
            "Analyst / influencer briefing deck",
            "Use-case playbook:",
            "  - Quality Live Loop",
            "  - PCF exchange",
            "  - Battery Passport",
            "Pricing & membership-bundle datasheet",
            "Technical FAQs",
            "Security",
            "Data sovereignty",
            "Connectors",
        ],
    },
    {
        title: "Event Promotion",
        elements: [
            "Vision & value whitepaper",
            "Launch press release + media kit",
            "Explainer video demonstrating",
            "Multi-tier visibility",
            "AI insights",
            "Product landing page with request form",
            "Interactive product tour or sandbox login",
            "Early-adopter pilot invitation email + flyer",
            "Analyst / influencer briefing deck",
            "Use-case playbook:",
            "  - Quality Live Loop",
            "  - PCF exchange",
            "  - Battery Passport",
            "Pricing & membership-bundle datasheet",
            "Technical FAQs",
            "Security",
            "Data sovereignty",
            "Connectors",
        ],
    },
    {
        title: "Standards-Adoption & Training",
        elements: [
            "Persona-segmented email nurture tracks (OEM execs, Tier 1, 2, 3 owners, partners)",
            "Member-testimonial micro-cast video series (“Why we joined AIAG”)",
            "Social-proof infographic (membership stats, global reach)",
            "LinkedIn thought-leadership articles by AIAG executives",
            "Direct-mail postcard / digital brochure for prospects",
            "Comparative one-pager: “AIAG vs. going solo” cost & risk matrix",
            "Renewal-reminder email sequence with personalised benefit report",
            "New members On-boarding checklist",
            "Quarterly member-only newsletter template",
            "Web banner ads for trade publications",
            "Staff FAQ & call-script for membership team",
        ],
    },
    {
        title: "Membership Growth & Retention",
        elements: [
            "Persona-segmented email nurture tracks (OEM execs, Tier 1, 2, 3 owners, partners)",
            "Member-testimonial micro-cast video series (“Why we joined AIAG”)",
            "Social-proof infographic (membership stats, global reach)",
            "LinkedIn thought-leadership articles by AIAG executives",
            "Direct-mail postcard / digital brochure for prospects",
            "Comparative one-pager: “AIAG vs. going solo” cost & risk matrix",
            "Renewal-reminder email sequence with personalised benefit report",
            "New members On-boarding checklist",
            "Quarterly member-only newsletter template",
            "Web banner ads for trade publications",
            "Staff FAQ & call-script for membership team",
        ],
    },
]












export const adjustToneAndCreativityData = {
    tone: {
        label: "Tone",
        defaultValue: 50,
        options: ["Casual", "Conversational", "Professional", "Formal", "Academic"],
    },
    creativity: {
        label: "Creativity",
        defaultValue: 60,
        options: ["Conservative", "Practical", "Balanced", "Creative", "Innovative"],
    },
};