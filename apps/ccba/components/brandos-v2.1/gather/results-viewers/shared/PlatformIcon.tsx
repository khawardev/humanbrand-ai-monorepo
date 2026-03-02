import { FaFacebook, FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { BsLinkedin } from "react-icons/bs";
import { Instagram, Youtube } from 'lucide-react';

export const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return <FaFacebook className="h-4 w-4" />;
        case 'instagram': return <Instagram className="h-4 w-4" />;
        case 'linkedin': return <BsLinkedin className="h-4 w-4" />;
        case 'x':
        case 'twitter': return <FaXTwitter className="h-4 w-4" />;
        case 'youtube': return <Youtube className="h-4 w-4" />;
        case 'tiktok': return <FaTiktok className="h-4 w-4" />;
        default: return null;
    }
};
