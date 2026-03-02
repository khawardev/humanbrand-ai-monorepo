export const siteConfig = {
    name: "Brand Health Audit | Humanbrand AI",
    url: "http://localhost:3000",
    description: "Get Clarity. Start your free Website Brand Health",
};

export type SiteConfig = typeof siteConfig;

export const appConfig = {
    audits: {
        freeTierLimit: 3,
    },
};