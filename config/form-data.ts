import {
    FaAward,
    FaBlog,
    FaBuilding,
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
    { id: 1, label: 'recomended', title: "Recommended " },
    { id: 2, label: 'deepthink', title: "Deep Think " },
];

export const COLOR_PRIMARY = "bg-primary/15 border border-primary/50";
export const COLOR_PINK = "bg-pink-400/20 border border-pink-400/40";

export const audiences = [
    { id: 1, label: "Members", Icon: FaUsers, color: COLOR_PRIMARY },
    { id: 2, label: "Prospective Members", Icon: FaUserPlus, color: COLOR_PRIMARY },
    { id: 3, label: "Employees", Icon: FaBuilding, color: COLOR_PRIMARY },
    { id: 4, label: "Leadership", Icon: FaCrown, color: COLOR_PRIMARY },
    { id: 5, label: "Partners", Icon: FaHandshake, color: COLOR_PRIMARY },
    { id: 6, label: "Media", Icon: MdCampaign, color: COLOR_PRIMARY },
];

export const subjects = [
    { id: 1, label: "Quality", Icon: FaAward, color: COLOR_PRIMARY },
    { id: 2, label: "Supply Chain", Icon: FaTruck, color: COLOR_PRIMARY },
    { id: 3, label: "Corporate Responsibility", Icon: MdShield, color: COLOR_PRIMARY },
    { id: 4, label: "General AIAG", Icon: MdInfo, color: COLOR_PRIMARY },
];

export const contentTypes = [
    { id: 1, label: "Social Media Post", Icon: MdShare, color: COLOR_PRIMARY },
    { id: 2, label: "Promotional Email", Icon: MdEmail, color: COLOR_PRIMARY },
    { id: 3, label: "Employee Email", Icon: MdEmail, color: COLOR_PRIMARY },
    { id: 4, label: "Press Release", Icon: HiSpeakerphone, color: COLOR_PRIMARY },
    { id: 5, label: "Newsletter Article", Icon: FaBlog, color: COLOR_PRIMARY },
    { id: 6, label: "Video Script", Icon: MdMovie, color: COLOR_PRIMARY },
    { id: 7, label: "Member Event", Icon: MdCalendarMonth, color: COLOR_PRIMARY },
    { id: 8, label: "Whitepaper", Icon: FaFileLines, color: COLOR_PRIMARY },
    { id: 9, label: "Executive Speech", Icon: FaMicrophone, color: COLOR_PRIMARY },
    { id: 10, label: "Thought Leadership Article", Icon: FaLightbulb, color: COLOR_PRIMARY },
    { id: 11, label: "Advertising Copy", Icon: MdSell, color: COLOR_PRIMARY },
    { id: 12, label: "Website Copy Block", Icon: MdContentCopy, color: COLOR_PRIMARY },
];

export const ctas = [
    { id: 1, label: "Register for Event", Icon: MdCalendarMonth, color: COLOR_PRIMARY },
    { id: 2, label: "Download Document", Icon: FaDownload, color: COLOR_PRIMARY },
    { id: 3, label: "Visit Website", Icon: MdOpenInNew, color: COLOR_PRIMARY },
    { id: 4, label: "Join AIAG Membership", Icon: FaUserPlus, color: COLOR_PRIMARY },
    { id: 5, label: "Contact AIAG Support", Icon: FaHeadset, color: COLOR_PRIMARY },
    { id: 6, label: "Schedule Training", Icon: MdSchedule, color: COLOR_PRIMARY },
    { id: 7, label: "Access AI (AVA)", Icon: MdSmartToy, color: COLOR_PRIMARY },
    { id: 8, label: "Purchase Standard", Icon: MdShoppingBag, color: COLOR_PRIMARY },
    { id: 9, label: "Follow on Social Media", Icon: MdShare, color: COLOR_PRIMARY },
    { id: 10, label: "Subscribe to Newsletter", Icon: MdRssFeed, color: COLOR_PRIMARY },
];

export const socialPlatforms = [
    { id: 1, label: "LinkedIn", Icon: FaLinkedin, color: COLOR_PRIMARY },
    { id: 2, label: "Facebook", Icon: FaFacebook, color: COLOR_PRIMARY },
    { id: 3, label: "X", Icon: FaTwitter, color: COLOR_PRIMARY },
    { id: 4, label: "YouTube", Icon: FaYoutube, color: COLOR_PRIMARY },
    { id: 5, label: "Instagram", Icon: FaInstagram, color: COLOR_PRIMARY },
    { id: 6, label: "TikTok", Icon: FaTiktok, color: COLOR_PRIMARY },
];

export const campaignTypes = [
    { id: 1, label: "Product Launch", Icon: MdRocketLaunch, color: COLOR_PRIMARY },
    { id: 2, label: "Event or Summit Promo", Icon: MdEvent, color: COLOR_PRIMARY },
    { id: 3, label: "Training & Certifications", Icon: MdSchool, color: COLOR_PRIMARY },
    { id: 4, label: "Membership Growth & Retention", Icon: MdTrendingUp, color: COLOR_PRIMARY },
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
        defaultValue: 3,
        maxValue: 5,
        minValue: 0,
        options: ["Casual", "Conversational", "Professional", "Formal", "Academic"],
    },
    creativity: {
        label: "Creativity",
        defaultValue: 0.5,
        maxValue:1,
        minValue:0,
        options: ["Conservative", "Practical", "Balanced", "Creative", "Authoritative"],
    },
};