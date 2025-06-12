import {
    Users,
    UserPlus,
    Building,
    Crown,
    Handshake,
    Megaphone,
    Award,
    Truck,
    Shield,
    Info,
    Share2,
    Mail,
    Newspaper,
    Clapperboard,
    CalendarDays,
    FileText,
    Mic,
    Lightbulb,
    BadgeDollarSign,
    Copy,
    CalendarPlus,
    Download,
    ExternalLink,
    UserPlus2,
    Headset,
    CalendarClock,
    Bot,
    ShoppingBasket,
    Rss,
    Check,
    UploadCloud,
    X,
    RefreshCw,
    Linkedin,
    Facebook,
    Youtube,
    Instagram,
    Twitter,
    Rocket,
    GraduationCap,
    TrendingUp,
    ShoppingBag,
} from "lucide-react"
import { FaBlog, FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa6"
import { HiOutlineSpeakerphone } from "react-icons/hi"

export const modelTabs = [
    { id: 1, label: 'Recommended', title: "Recommended " },
    { id: 2, label: 'Deeper Thinking', title: "Deep Think " },
]

export const audiences = [
    { id: 1, label: "Members", Icon: Users },
    { id: 2, label: "Prospective Members", Icon: UserPlus },
    { id: 3, label: "Employees", Icon: Building },
    { id: 4, label: "Leadership", Icon: Crown },
    { id: 5, label: "Partners", Icon: Handshake },
    { id: 6, label: "Media", Icon: Megaphone },
]


export const subjects = [
    { id: 1, label: "Quality", Icon: Award },
    { id: 2, label: "Supply Chain", Icon: Truck },
    { id: 3, label: "Corporate Responsibility", Icon: Shield },
    { id: 4, label: "General AIAG", Icon: Info },
]

export const contentTypes = [
    { id: 1, label: "Social Media Post", Icon: Share2 },
    { id: 2, label: "Promotional Email", Icon: Mail },
    { id: 31, label: "Newsletter Article", Icon: FaBlog },
    { id: 51, label: "Video Script", Icon: Clapperboard },
    { id: 61, label: "Member Event", Icon: CalendarDays },
    { id: 7, label: "Whitepaper", Icon: FileText },
    { id: 3, label: "Employee Email", Icon: Mail },
    { id: 4, label: "Press Release", Icon: HiOutlineSpeakerphone },
    { id: 8, label: "Executive Speech", Icon: Mic },
    { id: 9, label: "Thought Leadership Article", Icon: Lightbulb },
    { id: 10, label: "Advertising Copy", Icon: BadgeDollarSign },
    { id: 11, label: "Website Copy Block", Icon: Copy },
]

export const ctas = [
    { id: 1, label: "Register for Event", Icon: CalendarPlus },
    { id: 2, label: "Download Document", Icon: Download },
    { id: 3, label: "Visit Website", Icon: ExternalLink },
    { id: 4, label: "Join AIAG Membership", Icon: UserPlus2 },
    { id: 5, label: "Contact AIAG Support", Icon: Headset },
    { id: 6, label: "Schedule Training", Icon: CalendarClock },
    { id: 7, label: "Access AI (AVA)", Icon: Bot },
    { id: 8, label: "Purchase Standard", Icon: ShoppingBag },
    { id: 9, label: "Follow on Social Media", Icon: Share2 },
    { id: 10, label: "Subscribe to Newsletter", Icon: Rss },
]

export const socialPlatforms = [
    { id: 1, label: "LinkedIn", Icon: FaLinkedin },
    { id: 2, label: "Facebook", Icon: FaFacebook },
    { id: 3, label: "X", Icon: FaTwitter },
    { id: 4, label: "YouTube", Icon: FaYoutube },
    { id: 5, label: "Instagram", Icon: FaInstagram },
    { id: 6, label: "TikTok", Icon: FaTiktok },
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
