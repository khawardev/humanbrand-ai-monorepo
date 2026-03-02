export const continentalData = {
    brandName: "Continental",
    socialMedia: {
        platforms: {
            linkedin: {
                name: "LinkedIn",
                followers: 2000000,
                posts: 248,
                avgEngagement: 1253,
                sentiment: { positive: 62, neutral: 15, negative: 2, mixed: 1 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Corporate Transformation (AUMOVIO)", value: 450 },
                        { name: "Technology/Innovation Showcase", value: 390 },
                        { name: "Strategic Partnerships (AWS, Aurora)", value: 310 },
                        { name: "Career/Talent Acquisition", value: 250 },
                        { name: "Sustainability Milestones", value: 220 },
                    ],
                    kpis: {
                        metricsMentions: 382,
                        thirdPartyCitations: 55,
                        positiveSentiment: 62,
                    },
                    audienceEngagement: [
                        { name: "Senior Professionals", value: 45, color: "#3B82F6" },
                        { name: "Engineers/Tech Specialists", value: 40, color: "#7CFC00" },
                        { name: "Students/Early Career", value: 10, color: "#E57373" },
                        { name: "Investors/Analysts", value: 5, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "Technology/Innovation", value: 35.3, color: "#0ea5e9" },
                        { name: "Career/Talent", value: 25.7, color: "#84cc16" },
                        { name: "Business Strategy", value: 24.5, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Authority", value: 90, color: "#84cc16" },
                        { claim: "Expertise", value: 95, color: "#3b82f6" },
                        { claim: "Innovation", value: 85, color: "#ffffff" },
                        { claim: "Authenticity", value: 70, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Professional", value: 30, color: "#3b82f6" },
                        { name: "Strategic", value: 29, color: "#f97316" },
                        { name: "Achievement-oriented", value: 23, color: "#84cc16" },
                        { name: "Corporate", value: 18, color: "#CCCCCC" },
                    ],
                    contentStrategyGap: [
                        { name: "Business Strategy", Emergent: 45, Mandated: 25 },
                        { name: "SDV Leadership", Emergent: 18, Mandated: 35 },
                        { name: "ADAS Leadership", Emergent: 22, Mandated: 30 },
                        { name: "Lightweighting", Emergent: 2, Mandated: 10 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "ADAS Cybersecurity Share", value: 0.99 },
                        { title: "Lightweighting Content Share", value: 0.95 }
                    ],
                    strategySnapshot: [
                        { competitor: "Bosch", strategy: "Technical Expert", dataPoint: "65% Technical / B2B posts", color: "text-primary" },
                        { competitor: "Magna", strategy: "Balanced Blend", dataPoint: "Mix of Technical + People focus", color: "text-primary" },
                        { competitor: "Continental", strategy: "Validation & Authority", dataPoint: "High focus on milestones & strategy", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Amplify SDV Leadership", goal: "18% → 35% (90 days)", current: 18, target: 35 },
                        { name: "Launch ADAS Cybersecurity", goal: "1% → 10% (now 1%)", current: 1, target: 10 },
                        { name: "Boost Lightweighting Narrative", goal: "2% → 10% (now 2%)", current: 2, target: 10 },
                    ],
                    competitorPositioning: [
                        { x: 3.5, y: -3.5, name: "Bosch (Technical)" },
                        { x: 0, y: 0, name: "Magna (Balanced)" },
                    ],
                    magnaPosition: { x: 2.5, y: 3.5, name: "Continental", strategy: "Validation & Authority" },
                },
                topDrivers: [
                    { driver: "AUMOVIO Announcement", lift: 450, example: "5,007 engagements" },
                    { driver: "Technology/Innovation Showcase", lift: 390, example: "High B2B shares" },
                    { driver: "Strategic Partnerships", lift: 310, example: "Positive investor sentiment" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 20, percentage: 8.1 },
                    adas: { posts: 45, percentage: 18.2 },
                    lightweighting: { posts: 5, percentage: 2.0 },
                    environmental: { posts: 15, percentage: 6.1 },
                    sdvs: { posts: 35, percentage: 14.2 },
                },
                audienceSegments: [
                    { segment: "Senior Professionals", share: 45, confidence: "H" },
                    { segment: "Engineers/Tech Specialists", share: 40, confidence: "H" },
                    { segment: "Students/Early Career", share: 10, confidence: "M" },
                    { segment: "Investors/Analysts", share: 5, confidence: "M" },
                ],
            },
            // twitter: {
            //     name: "X/Twitter",
            //     followers: 112000,
            //     posts: 95,
            //     avgEngagement: 45.8,
            //     sentiment: { positive: 65, neutral: 30, negative: 5, mixed: 0 },
            //     PerformanceData: {
            //         topEngagementDrivers: [
            //             { name: "Corporate Announcements", value: 150 },
            //             { name: "Live Event Commentary", value: 120 },
            //             { name: "Tech Milestone Alerts", value: 100 },
            //         ],
            //         kpis: { metricsMentions: 45.8, thirdPartyCitations: 25, positiveSentiment: 65 },
            //         audienceEngagement: [
            //             { name: "Industry Journalists", value: 40, color: "#3B82F6" },
            //             { name: "Financial Analysts", value: 25, color: "#7CFC00" },
            //             { name: "Tech Professionals", value: 20, color: "#E57373" },
            //             { name: "Partners", value: 15, color: "#F3F4F6" },
            //         ],
            //         primaryContentThemes: [
            //             { name: "Business Strategy", value: 40, color: "#0ea5e9" },
            //             { name: "Technology/Innovation", value: 35, color: "#84cc16" },
            //             { name: "Corporate News", value: 25, color: "#f97316" },
            //         ],
            //         homepageVsFeed: [
            //             { claim: "Authority", value: 90, color: "#84cc16" },
            //             { claim: "Innovation", value: 85, color: "#3b82f6" },
            //             { claim: "Expertise", value: 95, color: "#ffffff" },
            //             { claim: "Accessibility", value: 50, color: "#f97316" },
            //         ],
            //         brandVoice: [
            //             { name: "Authoritative", value: 50, color: "#3b82f6" },
            //             { name: "Informative", value: 35, color: "#84cc16" },
            //             { name: "Corporate", value: 15, color: "#f97316" },
            //         ],
            //         contentStrategyGap: [
            //             { name: "Corporate News", Emergent: 40, Mandated: 30 },
            //             { name: "SDV", Emergent: 10, Mandated: 35 },
            //             { name: "ADAS Cybersecurity", Emergent: 1, Mandated: 15 },
            //         ],
            //         whiteSpaceOpportunities: [
            //             { title: "Real-Time Tech Analysis Share", value: 0.9 },
            //             { title: "ADAS Security Threads Share", value: 0.95 }
            //         ],
            //         strategySnapshot: [
            //             { competitor: "Bosch", strategy: "Expert Commentary", dataPoint: "Heavy focus on expert analysis", color: "text-primary" },
            //             { competitor: "Continental", strategy: "Corporate Broadcast", dataPoint: "Focus on official news & strategy", color: "text-white" },
            //         ],
            //         strategicInitiatives: [
            //             { name: "Launch SDV Explainer Threads", goal: "10% → 35% (90 days)", current: 10, target: 35 },
            //             { name: "Amplify ADAS Security Narrative", goal: "1% → 15% (now 1%)", current: 1, target: 15 },
            //         ],
            //         competitorPositioning: [
            //             { x: -3, y: 3.5, name: "Bosch (Expert Commentary)" },
            //         ],
            //         magnaPosition: { x: 3, y: 1.5, name: "Continental", strategy: "Corporate Broadcast" },
            //     },
            //     topDrivers: [
            //         { driver: "Corporate Announcements", lift: 150, example: "AUMOVIO Spin-off news" },
            //         { driver: "Live Event Commentary", lift: 120, example: "CES 2025 updates" },
            //         { driver: "Tech Milestone Alerts", lift: 100, example: "200M Radar Sensor tweet" },
            //     ],
            //     mandatedDrivers: {
            //         electrification: { posts: 8, percentage: 8.4 },
            //         adas: { posts: 18, percentage: 18.9 },
            //         lightweighting: { posts: 2, percentage: 2.1 },
            //         environmental: { posts: 7, percentage: 7.4 },
            //         sdvs: { posts: 12, percentage: 12.6 },
            //     },
            //     audienceSegments: [
            //         { segment: "Industry Journalists", share: 40, confidence: "H" },
            //         { segment: "Financial Analysts", share: 25, confidence: "H" },
            //         { segment: "Tech Professionals", share: 20, confidence: "M" },
            //         { segment: "Partners", share: 15, confidence: "M" },
            //     ],
            // },
            instagram: {
                name: "Instagram",
                followers: 5175,
                posts: 179,
                avgEngagement: 140,
                sentiment: { positive: 84, neutral: 7, negative: 1, mixed: 0 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Visual Tech Demos", value: 600 },
                        { name: "Career & Culture Showcase", value: 450 },
                        { name: "Inspirational Content", value: 380 },
                    ],
                    kpis: { metricsMentions: 477, thirdPartyCitations: 15, positiveSentiment: 84 },
                    audienceEngagement: [
                        { name: "Early Career/Students", value: 70, color: "#3B82F6" },
                        { name: "Young Professionals", value: 25, color: "#7CFC00" },
                        { name: "Tech Enthusiasts", value: 5, color: "#E57373" },
                    ],
                    primaryContentThemes: [
                        { name: "Technology/Innovation", value: 44.0, color: "#0ea5e9" },
                        { name: "Career/Talent", value: 39.0, color: "#84cc16" },
                        { name: "Culture/Behind Scenes", value: 30.2, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Innovation", value: 90, color: "#84cc16" },
                        { claim: "Accessibility", value: 85, color: "#3b82f6" },
                        { claim: "Authenticity", value: 80, color: "#ffffff" },
                        { claim: "Engagement", value: 85, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Inspirational", value: 49.1, color: "#84cc16" },
                        { name: "Authentic", value: 32.9, color: "#3b82f6" },
                        { name: "Welcoming", value: 28.7, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Career/Talent", Emergent: 55, Mandated: 25 },
                        { name: "Technology/Innovation", Emergent: 40, Mandated: 35 },
                        { name: "SDV", Emergent: 5, Mandated: 20 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "Day In The Life Reels Share", value: 0.9 },
                        { title: "Visual Tech Explainers Share", value: 0.88 }
                    ],
                    strategySnapshot: [
                        { competitor: "Bosch", strategy: "Life Enhancer", dataPoint: "#LikeABosch campaign focus", color: "text-primary" },
                        { competitor: "Magna", strategy: "People-First", dataPoint: "Top driver is 'Behind-the-Scenes'", color: "text-primary" },
                        { competitor: "Continental", strategy: "The Mentor", dataPoint: "Focus on inspirational, career-oriented content", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Launch 'Day in the Life' Reels", goal: "5% → 20% (90 days)", current: 5, target: 20 },
                        { name: "Create Visual SDV Explainer Series", goal: "5% → 20% (now 5%)", current: 5, target: 20 },
                    ],
                    competitorPositioning: [
                        { x: 2, y: 3, name: "Bosch (Life Enhancer)" },
                        { x: -3, y: -2.5, name: "Magna (People-First)" },
                    ],
                    magnaPosition: { x: -2.5, y: 3.0, name: "Continental", strategy: "The Mentor" },
                },
                topDrivers: [
                    { driver: "Grip Technology Demo", lift: 600, example: "14,884 engagements" },
                    { driver: "Career & Culture Showcase", lift: 450, example: "High comments on 'Why Conti' posts" },
                    { driver: "Inspirational Content", lift: 380, example: "Strong shares on motivational posts" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 12, percentage: 6.6 },
                    adas: { posts: 25, percentage: 13.7 },
                    lightweighting: { posts: 4, percentage: 2.2 },
                    environmental: { posts: 20, percentage: 11.0 },
                    sdvs: { posts: 10, percentage: 5.5 },
                },
                audienceSegments: [
                    { segment: "Early Career/Students", share: 70, confidence: "H" },
                    { segment: "Young Professionals", share: 25, confidence: "H" },
                    { segment: "Tech Enthusiasts", share: 5, confidence: "M" },
                ],
            },
            tiktok: {
                name: "TikTok",
                followers: 202400,
                posts: 162,
                avgEngagement: 47,
                sentiment: { positive: 87, neutral: 5, negative: 0, mixed: 0 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Viral Humor/Memes", value: 850 },
                        { name: "Educational 'Did You Know?'", value: 400 },
                        { name: "Authentic/User-Generated", value: 320 },
                    ],
                    kpis: { metricsMentions: 631000, thirdPartyCitations: 2, positiveSentiment: 87 },
                    audienceEngagement: [
                        { name: "Gen Z", value: 85, color: "#3B82F6" },
                        { name: "Early Career", value: 15, color: "#7CFC00" },
                    ],
                    primaryContentThemes: [
                        { name: "Technology/Innovation", value: 39.5, color: "#0ea5e9" },
                        { name: "Educational", value: 17.3, color: "#84cc16" },
                        { name: "Culture/Behind Scenes", value: 9.3, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Accessibility", value: 95, color: "#84cc16" },
                        { claim: "Authenticity", value: 90, color: "#3b82f6" },
                        { claim: "Engagement", value: 95, color: "#ffffff" },
                        { claim: "Innovation", value: 70, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Playful", value: 62, color: "#84cc16" },
                        { name: "Educational", value: 28, color: "#3b82f6" },
                        { name: "Authentic", value: 6, color: "#f97316" },
                        { name: "Exciting", value: 4, color: "#CCCCCC" },
                    ],
                    contentStrategyGap: [
                        { name: "Viral Creative", Emergent: 70, Mandated: 20 },
                        { name: "Educational", Emergent: 20, Mandated: 15 },
                        { name: "Career/Talent", Emergent: 5, Mandated: 25 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "Simplify Complex Tech Share", value: 0.9 },
                        { title: "Recruitment Challenges Share", value: 0.92 }
                    ],
                    strategySnapshot: [
                        { competitor: "Bosch", strategy: "Edutainment", dataPoint: "Top driver is 'Tech Explained Simply'", color: "text-primary" },
                        { competitor: "Continental", strategy: "The Jester (Viral)", dataPoint: "Top driver is Fear-based Humor", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Launch 'Simplify SDV' Series", goal: "1% → 15% (60 days)", current: 1, target: 15 },
                        { name: "Create Recruitment-focused Trends", goal: "5% → 25% (now 5%)", current: 5, target: 25 },
                    ],
                    competitorPositioning: [
                        { x: -2, y: -4, name: "Bosch (Edutainment)" },
                    ],
                    magnaPosition: { x: 3, y: 4, name: "Continental", strategy: "The Jester (Viral)" },
                },
                topDrivers: [
                    { driver: "Fear-based Humor", lift: 850, example: "12,600,000 engagements" },
                    { driver: "Educational 'Did You Know?'", lift: 400, example: "High saves and shares" },
                    { driver: "Authentic/User-Generated", lift: 320, example: "Strong community feeling" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 10, percentage: 6.2 },
                    adas: { posts: 15, percentage: 9.3 },
                    lightweighting: { posts: 2, percentage: 1.2 },
                    environmental: { posts: 8, percentage: 4.9 },
                    sdvs: { posts: 5, percentage: 3.1 },
                },
                audienceSegments: [
                    { segment: "Gen Z", share: 85, confidence: "H" },
                    { segment: "Early Career", share: 15, confidence: "M" },
                ],
            },
            facebook: {
                name: "Facebook",
                followers: 509000,
                posts: 200,
                avgEngagement: 98,
                sentiment: { positive: 71, neutral: 12, negative: 3, mixed: 0 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Local Community Involvement", value: 350 },
                        { name: "Employee Recognition", value: 280 },
                        { name: "Product Heritage & History", value: 220 },
                    ],
                    kpis: { metricsMentions: 215.5, thirdPartyCitations: 12, positiveSentiment: 71 },
                    audienceEngagement: [
                        { name: "Current/Former Employees & Families", value: 40, color: "#3B82F6" },
                        { name: "Local Communities", value: 30, color: "#7CFC00" },
                        { name: "Brand Loyalists/Enthusiasts", value: 20, color: "#E57373" },
                        { name: "General Audience", value: 10, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "People/Culture", value: 45, color: "#84cc16" },
                        { name: "Corporate Heritage", value: 30, color: "#0ea5e9" },
                        { name: "Technology/Innovation", value: 25, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "People & Community", value: 65, color: "#84cc16" },
                        { claim: "Brand History", value: 50, color: "#3b82f6" },
                        { claim: "Innovation", value: 30, color: "#ffffff" },
                        { claim: "Sustainability", value: 20, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Proud", value: 40, color: "#84cc16" },
                        { name: "Community-focused", value: 35, color: "#3b82f6" },
                        { name: "Supportive", value: 25, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "People/Culture", Emergent: 50, Mandated: 30 },
                        { name: "Technology", Emergent: 25, Mandated: 40 },
                        { name: "SDV", Emergent: 5, Mandated: 20 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "Tech For Good Stories Share", value: 1 },
                        { title: "Employee Innovation Spotlights Share", value: 1 }
                    ],
                    strategySnapshot: [
                        { competitor: "Magna", strategy: "Community-First", dataPoint: "Top drivers are Employee & Local content", color: "text-primary" },
                        { competitor: "Continental", strategy: "Heritage & Community", dataPoint: "Mix of brand history and local impact", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Showcase 'Tech for Good'", goal: "5% → 20% (90 days)", current: 5, target: 20 },
                        { name: "Launch SDV Narrative", goal: "5% → 20% (now 5%)", current: 5, target: 20 },
                    ],
                    competitorPositioning: [
                        { x: -3.5, y: 3, name: "Magna (Community-First)" },
                    ],
                    magnaPosition: { x: -3, y: 1.5, name: "Continental", strategy: "Heritage & Community" },
                },
                topDrivers: [
                    { driver: "Local Community Involvement", lift: 350, example: "High engagement on plant charity events" },
                    { driver: "Employee Recognition", lift: 280, example: "Service anniversary posts" },
                    { driver: "Product Heritage & History", lift: 220, example: "'On this day' posts" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 10, percentage: 6.7 },
                    adas: { posts: 18, percentage: 12.0 },
                    lightweighting: { posts: 3, percentage: 2.0 },
                    environmental: { posts: 12, percentage: 8.0 },
                    sdvs: { posts: 8, percentage: 5.3 },
                },
                audienceSegments: [
                    { segment: "Current/Former Employees & Families", share: 40, confidence: "H" },
                    { segment: "Local Communities", share: 30, confidence: "H" },
                    { segment: "Brand Loyalists/Enthusiasts", share: 20, confidence: "M" },
                    { segment: "General Audience", share: 10, confidence: "L" },
                ],
            },
            youtube: {
                name: "YouTube",
                followers: 1820,
                posts: 20,
                avgEngagement: 6,
                sentiment: { positive: 55, neutral: 12, negative: 0, mixed: 0 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Educational Deep Dives", value: 350 },
                        { name: "Authoritative Tech Explainers", value: 280 },
                        { name: "Innovation Documentaries", value: 210 },
                    ],
                    kpis: { metricsMentions: 371, thirdPartyCitations: 20, positiveSentiment: 55 },
                    audienceEngagement: [
                        { name: "B2B Specialists", value: 40, color: "#3B82F6" },
                        { name: "Engineers", value: 35, color: "#7CFC00" },
                        { name: "Students", value: 20, color: "#E57373" },
                        { name: "Tech Enthusiasts", value: 5, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "Technology/Innovation", value: 55, color: "#0ea5e9" },
                        { name: "Business Strategy", value: 25, color: "#84cc16" },
                        { name: "Educational", value: 10, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Expertise", value: 100, color: "#84cc16" },
                        { claim: "Authority", value: 95, color: "#3b82f6" },
                        { claim: "Innovation", value: 80, color: "#ffffff" },
                        { claim: "Authenticity", value: 75, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Authoritative", value: 70, color: "#3b82f6" },
                        { name: "Educational", value: 20, color: "#84cc16" },
                        { name: "Innovation-focused", value: 10, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Educational Deep Dives", Emergent: 60, Mandated: 30 },
                        { name: "SDV Leadership", Emergent: 15, Mandated: 40 },
                        { name: "ADAS Cybersecurity", Emergent: 1, Mandated: 15 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "SDV Architecture Explainers Share", value: 0.95 },
                        { title: "ADAS Security Simulations Share", value: 0.98 }
                    ],
                    strategySnapshot: [
                        { competitor: "Bosch", strategy: "Technical University", dataPoint: "Focus on deep-dive and educational series", color: "text-primary" },
                        { competitor: "Continental", strategy: "The Sage", dataPoint: "Focus on authoritative, expert-led content", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Launch 'SDV Architecture' Series", goal: "15% → 40% (120 days)", current: 15, target: 40 },
                        { name: "Develop ADAS Security Demo Videos", goal: "1% → 15% (now 1%)", current: 1, target: 15 },
                    ],
                    competitorPositioning: [
                        { x: -2.5, y: 3.5, name: "Bosch (Technical University)" },
                    ],
                    magnaPosition: { x: 2.5, y: 2.5, name: "Continental", strategy: "The Sage" },
                },
                topDrivers: [
                    { driver: "Winter Tire Knowledge", lift: 350, example: "1,228 engagements" },
                    { driver: "Authoritative Tech Explainers", lift: 280, example: "High watch time on ADAS videos" },
                    { driver: "Innovation Documentaries", lift: 210, example: "CAEdge framework video" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 2, percentage: 10.0 },
                    adas: { posts: 5, percentage: 25.0 },
                    lightweighting: { posts: 1, percentage: 5.0 },
                    environmental: { posts: 3, percentage: 15.0 },
                    sdvs: { posts: 4, percentage: 20.0 },
                },
                audienceSegments: [
                    { segment: "B2B Specialists", share: 40, confidence: "H" },
                    { segment: "Engineers", share: 35, confidence: "H" },
                    { segment: "Students", share: 20, confidence: "M" },
                    { segment: "Tech Enthusiasts", share: 5, confidence: "L" },
                ],
            },
        },
        strategicRecommendations: {
            linkedin: [
                { recommendation: "Amplify 'Aumovio' Strategic Narrative", audience: "Investors & Senior Professionals", driver: "Business Strategy", action: "Create a dedicated content stream on the strategic rationale and future vision for the Aumovio spin-off.", expectedEffect: "Shape investor narrative and build confidence in transformation." },
                { recommendation: "Launch 'SDV Pioneers' Series with AWS", audience: "Engineers & OEM Decision Makers", driver: "Technology/Innovation", action: "Co-produce a video series with AWS experts explaining the CAEdge framework and its benefits.", expectedEffect: "Solidify SDV leadership claim and leverage partner credibility." },
                { recommendation: "Counter Restructuring News with Talent Focus", audience: "Early Career & Professionals", driver: "Career/Talent", action: "Increase frequency of posts highlighting new software roles, upskilling programs, and employee testimonials.", expectedEffect: "Mitigate negative impact of restructuring news on talent acquisition." },
                { recommendation: "Showcase ADAS Leadership through Milestones", audience: "OEMs & Industry Analysts", driver: "ADAS", action: "Translate milestones like '200M radars sold' into compelling infographics and articles on market leadership and reliability.", expectedEffect: "Reinforce market dominance and counter quality-related narratives." },
                { recommendation: "Promote ADAS Cybersecurity Thought Leadership", audience: "Tech & Policy Media", driver: "SDV", action: "Publish an expert-authored article on the importance of cybersecurity for L4 autonomy, referencing the Aurora partnership.", expectedEffect: "Fill critical whitespace and establish proactive leadership on a key issue." }
            ],
            twitter: [
                { recommendation: "Live-Tweet Capital Market Days & Earnings", audience: "Financial Media & Analysts", driver: "Business Strategy", action: "Provide real-time key takeaways, quotes, and data points during major financial events to control the narrative.", expectedEffect: "Increase accuracy and positive framing in financial reporting." },
                { recommendation: "Create Rapid Response to Regulatory News", audience: "Industry Journalists", driver: "Authority", action: "Prepare statements and expert commentary to deploy instantly when new regulations (e.g., ADAS mandates) are announced.", expectedEffect: "Position Continental as a primary source for media." },
                { recommendation: "Amplify Partnership Announcements", audience: "OEMs & Partners", driver: "Technology/Innovation", action: "For every partnership (Aurora, AWS, S-CORE), create a multi-tweet thread explaining the strategic importance and technological benefits.", expectedEffect: "Strengthen B2B reputation and demonstrate ecosystem leadership." },
                { recommendation: "Run 'Ask the Expert' Q&A Sessions", audience: "Tech Professionals", driver: "Expertise", action: "Host monthly Q&A sessions on X Spaces with lead engineers on topics like SDV, radar technology, or sustainability.", expectedEffect: "Increase direct engagement and showcase internal talent." },
                { recommendation: "Address Recall News Proactively", audience: "All", driver: "Authenticity", action: "When challenging news like recalls occurs, use X to share official statements and links to information, demonstrating transparency.", expectedEffect: "Build trust by addressing issues head-on, rather than staying silent." }
            ],
            instagram: [
                { recommendation: "Launch 'Future of Mobility' Career Reels", audience: "Early Career & Students", driver: "Career/Talent", action: "Create a Reels series where young engineers showcase their work on exciting projects like autonomous driving and SDVs.", expectedEffect: "Boost recruitment appeal and make high-tech roles seem accessible." },
                { recommendation: "Translate Tech Demos into Visual Carousels", audience: "Tech Enthusiasts", driver: "Technology/Innovation", action: "Repurpose complex tech like 'Grip Technology' into simple, step-by-step visual explainers using Instagram carousels.", expectedEffect: "+400% engagement on technical content." },
                { recommendation: "Create 'Mentor Moments' Stories", audience: "Early Career", driver: "Culture", action: "Feature senior leaders sharing career advice in short, authentic Instagram Stories to reinforce the 'Mentor' persona.", expectedEffect: "Double story views and increase follower loyalty." },
                { recommendation: "Showcase Sustainability in Action", audience: "All", driver: "Sustainability", action: "Use Reels to visually show the lifecycle of recycled materials or the process of making a plant carbon-neutral.", expectedEffect: "Make ESG claims tangible and shareable for a younger audience." },
                { recommendation: "Partner with University Tech Clubs", audience: "Students", driver: "Career/Talent", action: "Collaborate with student engineering clubs for Instagram takeovers and joint projects to build a grassroots talent pipeline.", expectedEffect: "Increase brand preference among top engineering students." }
            ],
            tiktok: [
                { recommendation: "Launch 'Can it...?' Viral Test Series", audience: "Gen Z", driver: "Viral Creative", action: "Create a series testing Continental products in extreme/humorous situations (e.g., 'Can our sensor detect a rubber chicken?').", expectedEffect: "Maintain viral momentum while subtly showcasing product capability." },
                { recommendation: "Simplify Complex Tech with Trending Audio", audience: "Gen Z", driver: "Educational", action: "Create a 'Tech in 15 Seconds' series explaining concepts like ADAS or SDV using popular TikTok sounds and on-screen text.", expectedEffect: "Increase educational content reach by 10x." },
                { recommendation: "Partner with Comedy Creators", audience: "Gen Z", driver: "Viral Creative", action: "Collaborate with popular comedy creators to produce sketches based on the 'fear-based humor' concept.", expectedEffect: "Reach new audiences and solidify the brand's unique 'Jester' persona." },
                { recommendation: "Create 'Apply with Me' Recruitment Content", audience: "Gen Z", driver: "Career/Talent", action: "Showcase the application process and 'day in the life' of interns and apprentices in a relatable, authentic format.", expectedEffect: "Dramatically increase views on career-related content and drive applications." },
                { recommendation: "Run a 'Future Mobility Idea' Challenge", audience: "Gen Z", driver: "Innovation", action: "Use the Duet feature to challenge users to share their wildest ideas for the future of transportation, with prizes for the best ones.", expectedEffect: "Boost user-generated content and brand engagement." }
            ],
            facebook: [
                { recommendation: "Launch 'Conti Legends' Heritage Series", audience: "Employees & Brand Loyalists", driver: "Corporate Heritage", action: "Create monthly posts celebrating key milestones, inventions, and long-serving employees from the company's history.", expectedEffect: "Strengthen emotional connection with core audience and employees." },
                { recommendation: "Amplify Local Plant 'Tech for Good' Stories", audience: "Local Communities", driver: "Community", action: "Showcase how technology or initiatives from local plants are benefiting the community (e.g., sustainability efforts, STEM programs).", expectedEffect: "+300% local engagement and improved employer brand." },
                { recommendation: "Create Employee Innovation Spotlights", audience: "Employees & Families", driver: "People/Culture", action: "Dedicate 15% of posts to celebrating innovations created by employees, linking their work to major company products.", expectedEffect: "Boost internal morale and showcase a culture of innovation." },
                { recommendation: "Promote Product Reliability and Safety", audience: "Brand Loyalists", driver: "Technology", action: "Create content that focuses on the longevity, safety, and reliability of Continental products to reinforce trust, especially for the tire business.", expectedEffect: "Reinforce core brand attributes with the consumer-facing audience." },
                { recommendation: "Host Live Q&As on Corporate Strategy", audience: "Employees & Local Communities", driver: "Business Strategy", action: "Host Facebook Live sessions with regional leaders to explain strategic shifts like the Aumovio spin-off in simple terms.", expectedEffect: "Increase transparency and reduce uncertainty among employees and communities." }
            ],
            youtube: [
                { recommendation: "Create 'SDV: The Operating System for Cars' Series", audience: "B2B Specialists & Engineers", driver: "SDV", action: "Produce a flagship 5-part series that becomes the definitive industry resource for understanding SDVs and Continental's role.", expectedEffect: "Establish undeniable thought leadership in a key growth area." },
                { recommendation: "Launch 'Inside the Lab' Technical Deep Dives", audience: "Engineers", driver: "Technology/Innovation", action: "Shift content to longer-form (15-min) videos where engineers give a detailed tour of a specific technology, like a new radar sensor.", expectedEffect: "+500% B2B engagement and watch time." },
                { recommendation: "Visualize ADAS Cybersecurity Threats", audience: "B2B Specialists & Regulators", driver: "ADAS", action: "Create a high-production animated video simulating a cyberattack on an unprotected vehicle vs. one with Continental's security.", expectedEffect: "Make the abstract threat of cyberattacks concrete and showcase the value of the solution." },
                { recommendation: "Repurpose Top Educational Content into Shorts", audience: "All", driver: "Educational", action: "Take the best 60-second clips from successful long-form videos (like 'Winter Tire Knowledge') and post them as YouTube Shorts.", expectedEffect: "Massively increase reach and attract new subscribers to the main content." },
                { recommendation: "Create a 'CEO Vision' Quarterly Address", audience: "Investors, Employees, Partners", driver: "Business Strategy", action: "Produce a quarterly video from the CEO explaining strategic progress, addressing challenges, and outlining the vision for the next 90 days.", expectedEffect: "Build trust and communicate a clear, confident vision for the company's transformation." }
            ]
        },
        colors: {
            PLATFORM_COLORS: {
                LinkedIn: "#75E80B",
                "X/Twitter": "#6b7280",
                Instagram: "#ef4444",
                TikTok: "#f59e0b",
                Facebook: "#3b82f6",
                YouTube: "#dc2626",
            },
            SENTIMENT_COLORS: {
                positive: '#8FFF00',
                neutral: '#CCCCCC',
                negative: '#DA6E44',
                mixed: '#3175D4',
            },
            DRIVER_COLORS: {
                electrification: "#f59e0b",
                adas: "#8b5cf6",
                lightweighting: "#ec4899",
                environmental: "#10b981",
                sdvs: "#3b82f6",
            },
        }
    },
    earnedMedia: {
        comparisonFields: {
            brand: "Continental",
            period: "2024–06–01 to 2025–08–01",
            articles: 195,
            positivePercentage: 18.7,
            challengingPercentage: 22.8,
            topPillar: "Software-Defined Vehicle Pioneer",
            dominantRegion: "NA 45%",
            riskCount: 5,
            latestVelocity: "0 (Jul '25)",
            positioning: "Resilient innovator undergoing transformation"
        },
        v1: {
            executiveSummary: {
                articles: 195,
                period: "June 2024 — August 2025",
                regionalSplit: { NA: 45, EU: 35, AS: 20 },
                sentiment: { positive: 18.7, neutral: 58.5, challenging: 22.8 },
                topPillars: [
                    { name: "Software-Defined Vehicle Pioneer", percentage: 32 },
                    { name: "ADAS Technology Leader", percentage: 28 },
                    { name: "Corporate Transformation Catalyst", percentage: 25 }
                ],
                narrative: "Continental Automotive positions itself as a resilient technology innovator executing a historic corporate transformation toward software-defined mobility while navigating complex market headwinds and regulatory challenges."
            },
            auditFoundation: [
                { sourceType: "Trade/Industry", count: 52, percentage: 26.7, topPublications: ["Automotive News", "Just Auto", "WardsAuto", "S&P Global Mobility", "Automotive World"] },
                { sourceType: "Regional/Business", count: 47, percentage: 24.1, topPublications: ["Reuters", "Bloomberg", "WSJ", "Financial Times", "Forbes"] },
                { sourceType: "Tech/Innovation", count: 38, percentage: 19.5, topPublications: ["AWS", "IEEE Spectrum", "TechCrunch", "The Verge", "Electrive"] },
                { sourceType: "Tier-1 Financial", count: 32, percentage: 16.4, topPublications: ["Reuters", "Bloomberg", "WSJ", "Financial Times"] },
                { sourceType: "ESG/Policy/Regulatory", count: 18, percentage: 9.2, topPublications: ["NHTSA", "European Commission", "EPA", "IndustriALL"] },
                { sourceType: "Non-independent", count: 8, percentage: 4.1, topPublications: ["Continental.com", "PR Newswire"] }
            ],
            shareOfVoice: [
                { topic: "Financial/Earnings/Guidance", share: 18.5, sources: "Reuters, Bloomberg, WSJ, FT", tone: "Neutral" },
                { topic: "Strategic Events (Spin-off/M&A)", share: 16.9, sources: "Automotive News, Just Auto, Forbes", tone: "Positive" },
                { topic: "Technology & R&D (ADAS/SDV)", share: 15.8, sources: "AWS, S&P Global, WardsAuto", tone: "Positive" },
                { topic: "Partnerships/OEM Programs", share: 14.4, sources: "Electrive, Automotive World", tone: "Neutral" },
                { topic: "ESG/Sustainability", share: 13.3, sources: "Weibold, Continental reports", tone: "Positive" },
                { topic: "Regulatory/Quality/Recalls", share: 11.3, sources: "NHTSA, European Commission", tone: "Challenging" },
                { topic: "Regional Operations/Plants", share: 9.8, sources: "Local press, IndustriALL", tone: "Challenging" }
            ],
            productCoverage: {
                brandNative: [
                    { category: "Autonomous Mobility", share: 29, tone: "Positive", signal: "200M+ radar milestone demonstrates market dominance; Aurora L4 partnership validates scalable approach" },
                    { category: "Automotive Software", share: 27, tone: "Positive", signal: "CAEdge framework with AWS positions for SDV leadership; German OEM software alliance participation signals ecosystem strategy" },
                    { category: "Architecture and Networking", share: 22, tone: "Neutral", signal: "Zone architecture development progressing; Semiconductor unit creation shows vertical integration ambitions" },
                    { category: "Safety and Motion", share: 16, tone: "Challenging", signal: "Brake system recalls create quality perception challenges; Innovation pipeline strong but overshadowed by issues" },
                    { category: "ContiTech (Industrial)", share: 6, tone: "Challenging", signal: "Divestiture plans signal strategic focus shift; Sale expected by 2026 to unlock value" }
                ],
                universal: [
                    { category: "Electrical/Electronics", share: 42, tone: "Positive", signal: "ADAS sensor leadership with 20%+ market share; High-performance compute capabilities advancing" },
                    { category: "Body & Chassis", share: 24, tone: "Neutral", signal: "Safety system innovation continues; Brake quality issues require attention" },
                    { category: "Powertrain", share: 19, tone: "Neutral", signal: "EV component growth noted; E-axle and power electronics expanding" },
                    { category: "Exterior/Interior", share: 12, tone: "Positive", signal: "Display innovations (Invisible Biometrics); Mirror replacement technologies" },
                    { category: "Complete Vehicles", share: 3, tone: "N/A", signal: "Correctly excludes whole-vehicle manufacturing" }
                ]
            },
            sentiment: {
                overall: {
                    raw: [
                        { sentiment: "Positive", count: 36, percentage: 18.5 },
                        { sentiment: "Neutral", count: 115, percentage: 59.0 },
                        { sentiment: "Challenging", count: 44, percentage: 22.6 }
                    ],
                    weighted: [
                        { sentiment: "Positive", count: 36, percentage: 18.7 },
                        { sentiment: "Neutral", count: 114, percentage: 58.5 },
                        { sentiment: "Challenging", count: 45, percentage: 22.8 }
                    ]
                },
                byRegion: [
                    { region: "NA", positive: 22, neutral: 58, challenging: 20 },
                    { region: "EU", positive: 14, neutral: 57, challenging: 29 },
                    { region: "AS", positive: 20, neutral: 62, challenging: 18 }
                ],
                byOutlet: [
                    { outlet: "Tier-1 Financial", positive: 16, neutral: 58, challenging: 26 },
                    { outlet: "Trade/Industry", positive: 21, neutral: 61, challenging: 18 },
                    { outlet: "Tech/Innovation", positive: 34, neutral: 58, challenging: 8 },
                    { outlet: "ESG/Policy", positive: 22, neutral: 52, challenging: 26 },
                    { outlet: "Regional/Business", positive: 15, neutral: 56, challenging: 29 }
                ],
                quotes: [
                    { type: "Positive", quote: "Continental has set a milestone...200 million radar sensors. This impressive number reflects the company's leading position with more than 20 percent market share", author: "S&P Global Mobility", source: "S&P Global", date: "May 2025" },
                    { type: "Challenging", quote: "Continental plans to slash up to 13,000 jobs in the country...German unions IG BCE and IG Metall say that the reasons for the surprise announcement are not true, calling it 'cutting for the sake of cutting'", author: "IndustriALL Global Union", source: "IndustriALL", date: "2025" }
                ]
            },
            brandPillars: [
                { pillar: "Software-Defined Vehicle Pioneer", share: 32, tone: "Positive", phrases: "CAEdge framework, cloud-first, virtual workbench", quote: "Continental is one of the technological pioneers of the SDV worldwide" },
                { pillar: "ADAS Technology Leader", share: 28, tone: "Positive", phrases: "200 million radars, Aurora partnership, sensor fusion", quote: "Continental stands for high-tech engineering, pioneering spirit" },
                { pillar: "Corporate Transformation Catalyst", share: 25, tone: "Neutral", phrases: "historic spin-off, Aumovio launch, strategic realignment", quote: "The most extensive transformation in the company's history" },
                { pillar: "Sustainability Innovator", share: 15, tone: "Positive", phrases: "carbon neutrality 2050, circular economy, ContiLifeCycle", quote: "Continental is committed to the Paris Agreement" }
            ],
            businessDrivers: [
                { driver: "Software-Defined Vehicles (SDV)", hits: 31, toneBias: "Positive", relevance: "Core differentiator; AWS partnership validates cloud strategy" },
                { driver: "ADAS/Autonomy", hits: 29, toneBias: "Positive", relevance: "Market leadership with 20%+ radar share; Aurora validates L4 capability" },
                { driver: "Environmental Leadership", hits: 26, toneBias: "Positive", relevance: "2050 carbon neutrality commitment; ISCC certifications achieved" },
                { driver: "Electrification", hits: 22, toneBias: "Neutral", relevance: "Growing segment but margin-dilutive; component capabilities expanding" },
                { driver: "Lightweighting", hits: 6, toneBias: "Neutral", relevance: "Under-communicated despite material science innovations" }
            ],
            whiteSpace: [
                { topic: "ADAS Cybersecurity", coverage: "<1%", importance: "Critical for autonomous vehicles; regulatory momentum building", action: "Amplify security messaging in Aurora partnership communications" },
                { topic: "Hydrogen Solutions", coverage: "2%", importance: "Energy transition opportunity; industrial applications via ContiTech", action: "Leverage ContiTech capabilities before divestiture" },
                { topic: "Circularity/Recycling", coverage: "4%", importance: "ESG investor priority; regulatory pressure mounting", action: "Showcase ContiLifeCycle achievements more prominently" },
                { topic: "Supply-chain Resilience", coverage: "5%", importance: "Post-COVID critical capability; tariff hedging essential", action: "Communicate manufacturing flexibility across regions" }
            ],
            narrativeVelocity: [
                { month: "2024-06", positive: 3, challenging: 2, netDelta: 1 },
                { month: "2024-07", positive: 2, challenging: 3, netDelta: -2 },
                { month: "2024-08", positive: 4, challenging: 3, netDelta: 2 },
                { month: "2024-09", positive: 3, challenging: 2, netDelta: 0 },
                { month: "2024-10", positive: 2, challenging: 4, netDelta: -3 },
                { month: "2024-11", positive: 3, challenging: 5, netDelta: 0 },
                { month: "2024-12", positive: 5, challenging: 3, netDelta: 4 },
                { month: "2025-01", positive: 4, challenging: 2, netDelta: -2 },
                { month: "2025-02", positive: 3, challenging: 2, netDelta: 0 },
                { month: "2025-03", positive: 4, challenging: 4, netDelta: 1 },
                { month: "2025-04", positive: 3, challenging: 3, netDelta: 0 },
                { month: "2025-05", positive: 3, challenging: 4, netDelta: -1 },
                { month: "2025-06", positive: 2, challenging: 3, netDelta: 0 },
                { month: "2025-07", positive: 1, challenging: 2, netDelta: 0 }
            ],
            industryEvents: [
                { date: "2024-09", event: "BMW 1.5M brake recall (Continental component)", driver: "Quality/Safety", coverage: 800, continentalArticles: 11, toneShift: -8, sources: "Reuters, The Autopian" },
                { date: "2024-12", event: "Continental Aumovio spin-off announcement", driver: "Corporate restructuring", coverage: 600, continentalArticles: 12, toneShift: 8, sources: "Automotive News, Reuters" },
                { date: "2025-01", event: "Aurora-Continental-Nvidia partnership at CES", driver: "ADAS/Autonomy", coverage: 400, continentalArticles: 8, toneShift: 8, sources: "WardsAuto, FreightWaves" },
                { date: "2025-03", event: "Trump tariff implementation (25% Mexico/Canada)", driver: "Supply-chain resilience", coverage: 2000, continentalArticles: 15, toneShift: -15, sources: "WSJ, Reuters, CarEdge" },
                { date: "2025-04", event: "Continental shareholders approve spin-off (99.95%)", driver: "Corporate restructuring", coverage: 350, continentalArticles: 7, toneShift: 7, sources: "Eulerpool, TelematicsWire" },
                { date: "2025-05", event: "Continental 200M radar milestone", driver: "ADAS/Autonomy", coverage: 300, continentalArticles: 6, toneShift: 6, sources: "S&P Global Mobility" },
                { date: "2025-06", event: "German OEM software alliance (S-CORE) launch", driver: "SDV", coverage: 500, continentalArticles: 8, toneShift: 8, sources: "Electrive, VDA" },
                { date: "2025-06", event: "Continental Capital Market Day", driver: "Strategic clarity", coverage: 400, continentalArticles: 9, toneShift: 0, sources: "Continental press" },
                { date: "2025-07", event: "Continental Q2 2025 strong results", driver: "Financial performance", coverage: 250, continentalArticles: 5, toneShift: 5, sources: "WSJ, Bloomberg" },
                { date: "2025-08", event: "U.S. semiconductor export controls expansion", driver: "Supply-chain resilience", coverage: 900, continentalArticles: 4, toneShift: 0, sources: "CSIS, BIS" }
            ],
            strategic: {
                risks: [
                    "Spin-off Execution Complexity: Aumovio separation timeline aggressive",
                    "Tariff Impact Amplification: 25% NAFTA tariffs threaten margin structure",
                    "Quality Shadow Casting: Multiple brake recalls erode safety leadership narrative",
                    "European Labor Unrest: Union opposition to restructuring intensifying",
                    "China Technology Dependencies: Semiconductor restrictions expose supply vulnerabilities"
                ],
                opportunities: [
                    "SDV Platform Monetization: CAEdge-AWS partnership significantly under-leveraged",
                    "ADAS Market Expansion: 20%+ radar market share positions for autonomous vehicle wave",
                    "Sustainability Leadership: Carbon-neutral production achievements under-promoted",
                    "German Software Alliance: S-CORE participation demonstrates ecosystem leadership",
                    "Post-Spin Agility Narrative: Aumovio pure-play story gaining investor traction"
                ],
                blindSpots: [
                    "Cybersecurity Silence: Zero proactive ADAS security messaging",
                    "Lightweighting Innovation Gap: Material science breakthroughs uncommunicated",
                    "Asia Strategy Opacity: 20% coverage share underrepresents China market importance",
                    "Software Monetization Model: No clear SDV business model articulation"
                ]
            },
            recommendations: [
                { id: 1, action: "Launch 'Security-First Autonomy' Campaign", detail: "Partner with Aurora to showcase L4 security architecture; position Continental as autonomous vehicle cybersecurity leader through technical whitepapers and Tier-1 media briefings. Target: 15+ cybersecurity mentions in Q4 2025." },
                { id: 2, action: "Execute 'Tariff-Resilient Operations' Roadshow", detail: "CEO/CFO manufacturing flexibility tour across NA/EU/AS; emphasize 85%+ USMCA compliance and regional supply chain adaptability. Goal: Shift tariff narrative from 'vulnerable' to 'prepared' within 60 days." },
                { id: 3, action: "Deploy 'Innovation Drumbeat' Counter-Narrative", detail: "Weekly technology milestone communications via trade media; showcase customer wins, patents, and engineer spotlights to drown out restructuring noise. Metric: Achieve 3:1 innovation-to-restructuring story ratio by year-end." },
                { id: 4, action: "Activate 'Asia Innovation Showcase'", detail: "Announce expanded China R&D investment focused on local-for-local SDV solutions; highlight Chinese OEM partnerships and market-specific innovations. Target: Increase Asia-Pacific share of voice to 35%+ within 6 months." },
                { id: 5, action: "Create 'Aumovio Independence Day' Momentum", detail: "90-day countdown campaign featuring daily technology demonstrations, employee stories, and customer testimonials; reframe from 'separation' to 'acceleration.' Goal: Achieve 80% positive sentiment in spin-off completion month coverage." }
            ],
            brandPositioning: {
                ascribedPositioning: 'A technology leader undergoing a historic transformation to dominate the software-defined mobility era.',
                thirdPartyBrandPromise: 'Delivering market-leading ADAS and software solutions while restructuring for future agility.',
                narrativeFrames: [
                    'Technology pioneer',
                    'Corporate transformer',
                    'Market leader (ADAS)',
                    'Navigating headwinds'
                ]
            },
            conclusion: 'Continental\'s 2024–2025 earned media narrative is dominated by its ambitious corporate transformation. The Aumovio spin-off and strategic partnerships in SDV (AWS) and autonomy (Aurora) generate positive, forward-looking coverage, positioning the company as a key player in future mobility. However, this is significantly counterbalanced by challenging narratives around quality control (brake recalls), labor relations, and market headwinds. The brand\'s strength lies in its clear market leadership in ADAS, but this is at risk of being overshadowed. The key opportunity is to proactively manage the transformation narrative, fill critical communication gaps in areas like ADAS cybersecurity, and leverage innovation stories to create a more balanced media profile.',
            colors: {
                positive: '#8FFF00',
                neutral: '#CCCCCC',
                challenging: '#DA6E44',
                primary: '#3175D4',
                secondary: '#8b5cf6',
                accent: '#8FFF00',
            }
        },
        v4: {
            sourceMix: {
                data: [
                    { name: 'Trade/Industry', value: 26.7, color: '#8FFF00' },
                    { name: 'Regional/Business', value: 24.1, color: '#3175D4' },
                    { name: 'Tech/Innovation', value: 19.5, color: '#8b5cf6' },
                    { name: 'Tier-1 Financial', value: 16.4, color: '#DA6E44' },
                    { name: 'ESG/Policy', value: 9.2, color: '#FAFAFA' },
                    { name: 'Non-independent', value: 4.1, color: '#CCCCCC' }
                ],
                topPublications: { list: ["Automotive News", "Just Auto", "WardsAuto"], percentage: 26.7 }
            },
            topicsTreeMap: {
                legend: { Positive: '#8FFF00', Challenging: '#DA6E44', Neutral: '#3175D4' },
                data: [
                    { name: 'Financial/Earnings/Guidance', size: 18.5, sentiment: 'Neutral' },
                    { name: 'Strategic Events (Spin-off/M&A)', size: 16.9, sentiment: 'Positive' },
                    { name: 'Technology & R&D (ADAS/SDV)', size: 15.8, sentiment: 'Positive' },
                    { name: 'Partnerships/OEM Programs', size: 14.4, sentiment: 'Neutral' },
                    { name: 'ESG/Sustainability', size: 13.3, sentiment: 'Positive' },
                    { name: 'Regulatory/Quality/Recalls', size: 11.3, sentiment: 'Challenging', keySources: ["NHTSA", "European Commission"] },
                    { name: 'Regional Operations/Plants', size: 9.8, sentiment: 'Challenging' }
                ]
            },
            brandNativeCoverage: {
                data: [
                    { name: 'Autonomous Mobility', value: 29, color: '#8FFF00' },
                    { name: 'Automotive Software', value: 27, color: '#8FFF00' },
                    { name: 'Architecture & Networking', value: 22, color: '#CCCCCC' },
                    { name: 'Safety and Motion', value: 16, color: '#DA6E44' },
                    { name: 'ContiTech (Industrial)', value: 6, color: '#DA6E44' }
                ],
                strategicSignal: { text: "200M+ radar milestone demonstrates market dominance; Aurora L4 partnership validates scalable approach.", percentage: 29 }
            },
            mandatedBusinessDrivers: {
                legend: { positive: '#8FFF00', neutral: '#3175D4', challenging: '#DA6E44' },
                data: [
                    { name: 'Software-Defined Vehicles', total: 31, positive: 90, neutral: 10, challenging: 0 },
                    { name: 'ADAS/Autonomy', total: 29, positive: 95, neutral: 5, challenging: 0 },
                    { name: 'Environmental Leadership', total: 26, positive: 85, neutral: 15, challenging: 0 },
                    { name: 'Electrification', total: 22, positive: 40, neutral: 60, challenging: 0 },
                    { name: 'Lightweighting', total: 6, positive: 20, neutral: 80, challenging: 0 },
                ]
            },
            strengths: [
                { title: 'SDV & ADAS Pioneer', description: "Strong positioning as a technology leader in the two most critical areas of future mobility: software and autonomy." },
                { title: 'Strategic Clarity', description: "The Aumovio spin-off and partnerships create a clear, forward-looking narrative that resonates positively with tech and industry media." },
                { title: 'Market Validation', description: "Milestones like the 200M radar sensors sold provide concrete proof of market leadership and dominance in key segments." }
            ],
            risks: [
                { title: 'Execution Risk', description: "The narrative is highly dependent on the successful, on-time execution of a complex corporate transformation.", color: "text-orange-400" },
                { title: 'Narrative Contradiction', description: "Positive innovation stories are at risk of being drowned out by challenging news on recalls and restructuring.", color: "text-blue-400" }
            ],
            timeline: {
                events: [
                    { date: "September 2024", label: "BMW Brake Recall", type: "Crisis", position: 15, side: 'bottom' },
                    { date: "December 2024", label: "Aumovio Spin-off Anncd.", type: "Positive", position: 30, side: 'top' },
                    { date: "January 2025", label: "CES Aurora Partnership", type: "Positive", position: 35, side: 'bottom' },
                    { date: "March 2025", label: "Tariff Implementation", type: "Crisis", position: 50, side: 'top' },
                    { date: "April 2025", label: "Spin-off Approved", type: "Positive", position: 58, side: 'bottom' },
                    { date: "May 2025", label: "200M Radar Milestone", type: "Positive", position: 65, side: 'top' },
                    { date: "June 2025", label: "S-CORE Alliance Launch", type: "Positive", position: 75, side: 'bottom' },
                    { date: "July 2025", label: "Q2 Strong Results", type: "Positive", position: 85, side: 'top' },
                ],
                context: { text: "Industry Context: Sector-wide pressure from tariffs and recalls.\nStrategic Impact: Positive transformation news serves as a crucial counter-narrative.", position: 42 },
                legend: { Positive: '#8FFF00', Mixed: '#FFD700', Crisis: '#DA6E44', Dual: '#8b5cf6', Others: '#CCCCCC' }
            },
            keyInsights: [
                { title: 'A Tale of Two Narratives', color: '', description: "The company is successfully building a future-focused narrative around SDV and ADAS, but it's in a constant battle with challenging news from its legacy operations." },
                { title: 'Leadership is Proven, Not Just Claimed', color: 'text-blue-400', description: "The most impactful positive coverage comes from concrete milestones (200M radars) and major partnerships (AWS, Aurora), not just strategic announcements." },
                { title: 'Blind Spots are Significant Risks', color: 'text-orange-400', description: "The lack of communication around critical topics like ADAS cybersecurity and supply chain resilience leaves the brand vulnerable to being defined by others on these issues." },
            ],
            opportunities: [
                { text: "Launch a 'Security-First Autonomy' campaign", color: '#8FFF00' },
                { text: "Execute a 'Tariff-Resilient Operations' roadshow", color: '#DA6E44' },
                { text: "Deploy an 'Innovation Drumbeat' to counter restructuring news", color: '#3175D4' }
            ]
        }
    }
}