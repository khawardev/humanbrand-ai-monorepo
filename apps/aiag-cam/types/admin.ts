
export type LoomVideo = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  html: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SupportTicketAdmin = {
  id: string;
  userId: string;
  subject: string;
  description: string;
  type: "bug_report" | "feature_request";
  status: "pending" | "in_progress" | "completed" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  adminRemarks: string | null;
  attachments: string[] | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export type UserAdmin = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  isAdmin: boolean | null;
  adminVerified: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};
