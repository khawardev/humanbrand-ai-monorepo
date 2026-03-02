export const gentexData = {
    brandName: "Gentex",
    socialMedia: {
        platforms: {
            linkedin: {
                name: "LinkedIn",
                followers: 31000,
                posts: 186,
                avgEngagement: 225.3,
                sentiment: { positive: 75, neutral: 20, negative: 3, mixed: 2 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Technical Authority Content", value: 350 },
                        { name: "Innovation Showcases (FDM, DMS)", value: 310 },
                        { name: "Quality/Excellence Milestones", value: 280 },
                        { name: "Company Culture/Recruitment", value: 220 },
                        { name: "Community Engagement", value: 150 },
                    ],
                    kpis: {
                        metricsMentions: 225.3,
                        thirdPartyCitations: 28,
                        positiveSentiment: 75,
                    },
                    audienceEngagement: [
                        { name: "B2B Professionals", value: 45, color: "#3B82F6" },
                        { name: "Engineers/Technical Talent", value: 40, color: "#7CFC00" },
                        { name: "OEM Decision Makers", value: 10, color: "#E57373" },
                        { name: "Students/Early Career", value: 5, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "Innovation", value: 21.5, color: "#0ea5e9" },
                        { name: "Technical Education", value: 18.8, color: "#84cc16" },
                        { name: "Quality/Excellence", value: 13.4, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Authority", value: 95, color: "#84cc16" },
                        { claim: "Technical Expertise", value: 90, color: "#3b82f6" },
                        { claim: "Innovation", value: 85, color: "#ffffff" },
                        { claim: "Community", value: 30, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Authoritative", value: 50, color: "#3b82f6" },
                        { name: "Expert", value: 35, color: "#84cc16" },
                        { name: "Professional", value: 15, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Technical Education", Emergent: 19, Mandated: 25 },
                        { name: "ADAS Cybersecurity", Emergent: 1, Mandated: 20 },
                        { name: "SDV Integration", Emergent: 5, Mandated: 20 },
                        { name: "Community", Emergent: 8, Mandated: 10 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "ADAS Cybersecurity Share", value: 0.99 },
                        { title: "SDV Integration Share", value: 0.95 }
                    ],
                    strategySnapshot: [
                        { competitor: "Magna", strategy: "Balanced Blend", dataPoint: "Mix of Technical + People focus", color: "text-primary" },
                        { competitor: "Bosch", strategy: "Technical Expert", dataPoint: "65% Technical / B2B posts", color: "text-primary" },
                        { competitor: "Gentex", strategy: "Niche Expert/Sage", dataPoint: "Focus on Vision Systems & Technical Authority", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Launch ADAS Cybersecurity", goal: "1% → 10% (90 days)", current: 1, target: 10 },
                        { name: "Boost SDV Integration Content", goal: "5% → 15% (now 5%)", current: 5, target: 15 },
                        { name: "Expand Technical Education", goal: "19% → 25% (now 19%)", current: 19, target: 25 },
                    ],
                    competitorPositioning: [
                        { x: 3.5, y: -3.5, name: "Bosch (Technical)" },
                        { x: 0, y: 0, name: "Magna (Balanced)" },
                    ],
                    magnaPosition: { x: 4, y: -1, name: "Gentex", strategy: "Niche Expert/Sage" },
                },
                topDrivers: [
                    { driver: "Technical Authority Content", lift: 350, example: "High engagement on deep dives" },
                    { driver: "Innovation Showcases (FDM, DMS)", lift: 310, example: "Strong shares on new tech" },
                    { driver: "Quality/Excellence Milestones", lift: 280, example: "Positive sentiment on market share posts" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 5, percentage: 2.7 },
                    adas: { posts: 30, percentage: 16.1 },
                    lightweighting: { posts: 4, percentage: 2.2 },
                    environmental: { posts: 8, percentage: 4.3 },
                    sdvs: { posts: 10, percentage: 5.4 },
                },
                audienceSegments: [
                    { segment: "B2B Professionals", share: 45, confidence: "H" },
                    { segment: "Engineers/Technical Talent", share: 40, confidence: "H" },
                    { segment: "OEM Decision Makers", share: 10, confidence: "M" },
                    { segment: "Students/Early Career", share: 5, confidence: "L" },
                ],
            },
            // twitter: {
            //     name: "X/Twitter",
            //     followers: 1418,
            //     posts: 144,
            //     avgEngagement: 15.2,
            //     sentiment: { positive: 75, neutral: 30, negative: 3, mixed: 2 },
            //     PerformanceData: {
            //         topEngagementDrivers: [
            //             { name: "Innovation Snippets", value: 150 },
            //             { name: "Industry News Retweets/Commentary", value: 120 },
            //             { name: "Quality/Excellence Updates", value: 100 },
            //         ],
            //         kpis: { metricsMentions: 15.2, thirdPartyCitations: 12, positiveSentiment: 75 },
            //         audienceEngagement: [
            //             { name: "Tech Enthusiasts", value: 50, color: "#3B82F6" },
            //             { name: "Industry Journalists", value: 25, color: "#7CFC00" },
            //             { name: "Employees", value: 15, color: "#E57373" },
            //             { name: "Local Followers", value: 10, color: "#F3F4F6" },
            //         ],
            //         primaryContentThemes: [
            //             { name: "Innovation", value: 31.3, color: "#0ea5e9" },
            //             { name: "Quality/Excellence", value: 24.3, color: "#84cc16" },
            //             { name: "Technical Education", value: 13.9, color: "#f97316" },
            //         ],
            //         homepageVsFeed: [
            //             { claim: "Accessibility", value: 85, color: "#84cc16" },
            //             { claim: "Innovation", value: 70, color: "#3b82f6" },
            //             { claim: "Technical Expertise", value: 60, color: "#ffffff" },
            //             { claim: "Authority", value: 40, color: "#f97316" },
            //         ],
            //         brandVoice: [
            //             { name: "Casual", value: 55, color: "#84cc16" },
            //             { name: "Informative", value: 30, color: "#3b82f6" },
            //             { name: "Approachable", value: 15, color: "#f97316" },
            //         ],
            //         contentStrategyGap: [
            //             { name: "Innovation Updates", Emergent: 31, Mandated: 35 },
            //             { name: "Community News", Emergent: 7, Mandated: 15 },
            //             { name: "Cybersecurity Updates", Emergent: 1, Mandated: 10 },
            //         ],
            //         whiteSpaceOpportunities: [
            //             { title: "ADAS Cybersecurity Updates Share", value: 0.99 },
            //             { title: "Supply Chain Resilience Share", value: 0.96 }
            //         ],
            //         strategySnapshot: [
            //             { competitor: "Magna", strategy: "Balanced Comms", dataPoint: "Mix of Financial + Tech focus", color: "text-primary" },
            //             { competitor: "Gentex", strategy: "Regular Guy", dataPoint: "Casual, approachable industry updates", color: "text-white" },
            //         ],
            //         strategicInitiatives: [
            //             { name: "Launch Cybersecurity Threads", goal: "1% → 10% (90 days)", current: 1, target: 10 },
            //             { name: "Increase Community Focus", goal: "7% → 15% (now 7%)", current: 7, target: 15 },
            //         ],
            //         competitorPositioning: [
            //             { x: 0, y: 0, name: "Magna (Balanced)" },
            //         ],
            //     magnaPosition: { x: -3, y: -2.5, name: "Gentex", strategy: "Regular Guy" },
            //     },
            //     topDrivers: [
            //         { driver: "Innovation Snippets", lift: 150, example: "Good retweets on new tech" },
            //         { driver: "Industry News Commentary", lift: 120, example: "Engagement from journalists" },
            //         { driver: "Quality/Excellence Updates", lift: 100, example: "Positive replies on product news" },
            //     ],
            //     mandatedDrivers: {
            //         electrification: { posts: 4, percentage: 2.8 },
            //         adas: { posts: 15, percentage: 10.4 },
            //         lightweighting: { posts: 2, percentage: 1.4 },
            //         environmental: { posts: 5, percentage: 3.5 },
            //         sdvs: { posts: 8, percentage: 5.6 },
            //     },
            //     audienceSegments: [
            //         { segment: "Tech Enthusiasts", share: 50, confidence: "M" },
            //         { segment: "Industry Journalists", share: 25, confidence: "M" },
            //         { segment: "Employees", share: 15, confidence: "H" },
            //         { segment: "Local Followers", share: 10, confidence: "H" },
            //     ],
            // },
            instagram: {
                name: "Instagram",
                followers: 5175,
                posts: 113,
                avgEngagement: 125.8,
                sentiment: { positive: 80, neutral: 18, negative: 1, mixed: 1 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Visual Innovation/Product Shots", value: 420 },
                        { name: "Quality/Excellence in Design", value: 380 },
                        { name: "Company Culture/Events", value: 350 },
                    ],
                    kpis: { metricsMentions: 125.8, thirdPartyCitations: 5, positiveSentiment: 88 },
                    audienceEngagement: [
                        { name: "Young Professionals", value: 45, color: "#3B82F6" },
                        { name: "Current Employees", value: 30, color: "#7CFC00" },
                        { name: "Design/Engineering Students", value: 20, color: "#E57373" },
                        { name: "Local Community", value: 5, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "Quality/Excellence", value: 48.7, color: "#0ea5e9" },
                        { name: "Innovation", value: 39.8, color: "#84cc16" },
                        { name: "Company Culture", value: 35.4, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Visual Appeal", value: 95, color: "#84cc16" },
                        { claim: "Innovation", value: 90, color: "#3b82f6" },
                        { claim: "Authority", value: 70, color: "#ffffff" },
                        { claim: "Community", value: 60, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Creative", value: 50, color: "#84cc16" },
                        { name: "Aspirational", value: 35, color: "#3b82f6" },
                        { name: "Polished", value: 15, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Visual Design", Emergent: 50, Mandated: 40 },
                        { name: "Company Culture", Emergent: 35, Mandated: 25 },
                        { name: "Technical Education", Emergent: 13, Mandated: 25 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "Design Process Reels Share", value: 0.9 },
                        { title: "Visual Tech Explainers Share", value: 0.88 }
                    ],
                    strategySnapshot: [
                        { competitor: "Forvia", strategy: "The Visionary", dataPoint: "Focus on visual innovation & design", color: "text-primary" },
                        { competitor: "Gentex", strategy: "The Creator/Artist", dataPoint: "Focus on visual inspiration & excellence", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Launch 'Design Process' Reels", goal: "5% → 20% (90 days)", current: 5, target: 20 },
                        { name: "Create Visual Tech Explainers", goal: "13% → 25% (now 13%)", current: 13, target: 25 },
                    ],
                    competitorPositioning: [
                        { x: 3.5, y: -3.0, name: "Forvia (Visionary)" },
                    ],
                    magnaPosition: { x: 3.0, y: -2.0, name: "Gentex", strategy: "Creator/Artist" },
                },
                topDrivers: [
                    { driver: "Visual Innovation/Product Shots", lift: 420, example: "High likes on FDM photos" },
                    { driver: "Quality/Excellence in Design", lift: 380, example: "Positive comments on product details" },
                    { driver: "Company Culture/Events", lift: 350, example: "Good engagement on team photos" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 2, percentage: 1.8 },
                    adas: { posts: 12, percentage: 10.6 },
                    lightweighting: { posts: 4, percentage: 3.5 },
                    environmental: { posts: 8, percentage: 7.1 },
                    sdvs: { posts: 6, percentage: 5.3 },
                },
                audienceSegments: [
                    { segment: "Young Professionals", share: 45, confidence: "H" },
                    { segment: "Current Employees", share: 30, confidence: "H" },
                    { segment: "Design/Engineering Students", share: 20, confidence: "M" },
                    { segment: "Local Community", share: 5, confidence: "M" },
                ],
            },
            // tiktok: {
            //     name: "TikTok",
            //     followers: 1200,
            //     posts: 15,
            //     avgEngagement: 850,
            //     sentiment: { positive: 88, neutral: 12, negative: 0, mixed: 0 },
            //     PerformanceData: {
            //         topEngagementDrivers: [
            //             { name: "Cool Tech Demos (Dimming Glass)", value: 280 },
            //             { name: "Behind-the-Scenes Manufacturing", value: 210 },
            //             { name: "Employee Trend Participation", value: 150 },
            //         ],
            //         kpis: { metricsMentions: 850, thirdPartyCitations: 1, positiveSentiment: 88 },
            //         audienceEngagement: [
            //             { name: "Gen Z Students", value: 45, color: "#3B82F6" },
            //             { name: "Young Employees", value: 35, color: "#7CFC00" },
            //             { name: "Tech Hobbyists", value: 20, color: "#E57373" },
            //         ],
            //         primaryContentThemes: [
            //             { name: "Innovation", value: 55, color: "#0ea5e9" },
            //             { name: "Culture", value: 30, color: "#84cc16" },
            //             { name: "Education", value: 15, color: "#f97316" },
            //         ],
            //         homepageVsFeed: [
            //             { claim: "Cool Engineering", value: 65, color: "#84cc16" },
            //             { claim: "Fun Place to Work", value: 55, color: "#3b82f6" },
            //             { claim: "Future of Vision", value: 45, color: "#ffffff" },
            //             { claim: "Made in Michigan", value: 70, color: "#f97316" },
            //         ],
            //         brandVoice: [
            //             { name: "Authentic", value: 60, color: "#84cc16" },
            //             { name: "Fascinating", value: 25, color: "#3b82f6" },
            //             { name: "Playful", value: 15, color: "#f97316" },
            //         ],
            //         contentStrategyGap: [
            //             { name: "Tech Demos", Emergent: 50, Mandated: 40 },
            //             { name: "Recruitment/Culture", Emergent: 30, Mandated: 35 },
            //             { name: "DMS Explained Simply", Emergent: 2, Mandated: 20 },
            //         ],
            //         whiteSpaceOpportunities: [
            //             { title: "DMS Eye-Tracking Challenge Share", value: 0.98 },
            //             { title: "From Sand to Mirror Share", value: 0.95 }
            //         ],
            //         strategySnapshot: [
            //             { competitor: "Forvia", strategy: "Visual Futurist", dataPoint: "Focus on cool tech demos", color: "text-primary" },
            //             { competitor: "Gentex", strategy: "Authentic Innovator", dataPoint: "Mix of tech demos and employee trends", color: "text-white" },
            //         ],
            //         strategicInitiatives: [
            //             { name: "Launch 'DMS Challenge' Series", goal: "2% → 20% (60 days)", current: 2, target: 20 },
            //             { name: "Create 'Apply with Us' Videos", goal: "10% → 35% (now 10%)", current: 10, target: 35 },
            //         ],
            //         competitorPositioning: [
            //             { x: 3, y: 3.5, name: "Forvia (Visual Futurist)" },
            //         ],
            //         magnaPosition: { x: -1, y: -2, name: "Gentex", strategy: "Authentic Innovator" },
            //     },
            //     topDrivers: [
            //         { driver: "Cool Tech Demos (Dimming Glass)", lift: 280, example: "High views on electrochromic demos" },
            //         { driver: "Behind-the-Scenes Manufacturing", lift: 210, example: "Positive comments on factory footage" },
            //         { driver: "Employee Trend Participation", lift: 150, example: "Good local community engagement" },
            //     ],
            //     mandatedDrivers: {
            //         electrification: { posts: 1, percentage: 6.7 },
            //         adas: { posts: 4, percentage: 26.7 },
            //         lightweighting: { posts: 1, percentage: 6.7 },
            //         environmental: { posts: 2, percentage: 13.3 },
            //         sdvs: { posts: 2, percentage: 13.3 },
            //     },
            //     audienceSegments: [
            //         { segment: "Gen Z Students", share: 45, confidence: "L" },
            //         { segment: "Young Employees", share: 35, confidence: "L" },
            //         { segment: "Tech Hobbyists", share: 20, confidence: "L" },
            //     ],
            // },
            facebook: {
                name: "Facebook",
                followers: 7200,
                posts: 180,
                avgEngagement: 155.1,
                sentiment: { positive: 78, neutral: 12, negative: 2, mixed: 1 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Community Building/Events", value: 550 },
                        { name: "Company Culture/Employee Spotlights", value: 480 },
                        { name: "Heritage/Legacy Posts", value: 410 },
                    ],
                    kpis: { metricsMentions: 155.1, thirdPartyCitations: 6, positiveSentiment: 78 },
                    audienceEngagement: [
                        { name: "Community Members", value: 50, color: "#3B82F6" },
                        { name: "Employees & Families", value: 40, color: "#7CFC00" },
                        { name: "Local Job Seekers", value: 10, color: "#E57373" },
                    ],
                    primaryContentThemes: [
                        { name: "Company Culture", value: 25.0, color: "#0ea5e9" },
                        { name: "Community", value: 22.2, color: "#84cc16" },
                        { name: "Heritage/Legacy", value: 16.7, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Community", value: 95, color: "#84cc16" },
                        { claim: "Accessibility", value: 90, color: "#3b82f6" },
                        { claim: "Visual Appeal", value: 70, color: "#ffffff" },
                        { claim: "Authority", value: 60, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Neighborly", value: 60, color: "#84cc16" },
                        { name: "Supportive", value: 25, color: "#3b82f6" },
                        { name: "Proud", value: 15, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Community/Culture", Emergent: 50, Mandated: 40 },
                        { name: "Innovation for the Community", Emergent: 14, Mandated: 30 },
                        { name: "Hiring/Careers", Emergent: 20, Mandated: 30 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "Tech For Good Stories Share", value: 1 },
                        { title: "Employee-Led Innovation Share", value: 1 }
                    ],
                    strategySnapshot: [
                        { competitor: "Denso", strategy: "The Caregiver", dataPoint: "Heavy focus on regional employment", color: "text-primary" },
                        { competitor: "Gentex", strategy: "The Neighbor", dataPoint: "Strong focus on local community building", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Link Innovation to Local Impact", goal: "14% → 30% (90 days)", current: 14, target: 30 },
                        { name: "Boost 'Careers at Gentex'", goal: "20% → 30% (now 20%)", current: 20, target: 30 },
                    ],
                    competitorPositioning: [
                        { x: -4, y: 3.5, name: "Denso (Caregiver)" },
                    ],
                    magnaPosition: { x: -4.5, y: 3.0, name: "Gentex", strategy: "The Neighbor" },
                },
                topDrivers: [
                    { driver: "Community Building/Events", lift: 550, example: "High shares of local event sponsorships" },
                    { driver: "Company Culture/Employee Spotlights", lift: 480, example: "Strong engagement on 'Meet the Team'" },
                    { driver: "Heritage/Legacy Posts", lift: 410, example: "Positive reactions to anniversary posts" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 1, percentage: 0.6 },
                    adas: { posts: 8, percentage: 4.4 },
                    lightweighting: { posts: 2, percentage: 1.1 },
                    environmental: { posts: 4, percentage: 2.2 },
                    sdvs: { posts: 3, percentage: 1.7 },
                },
                audienceSegments: [
                    { segment: "Community Members", share: 50, confidence: "H" },
                    { segment: "Employees & Families", share: 40, confidence: "H" },
                    { segment: "Local Job Seekers", share: 10, confidence: "M" },
                ],
            },
            youtube: {
                name: "YouTube",
                followers: 1820,
                posts: 17,
                avgEngagement: 850.5,
                sentiment: { positive: 76, neutral: 28, negative: 1, mixed: 1 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Technical Education", value: 550 },
                        { name: "Quality/Excellence Demos", value: 410 },
                        { name: "Innovation Deep Dives", value: 380 },
                    ],
                    kpis: { metricsMentions: 850.5, thirdPartyCitations: 10, positiveSentiment: 76 },
                    audienceEngagement: [
                        { name: "Technical Learners", value: 50, color: "#3B82F6" },
                        { name: "Engineers", value: 30, color: "#7CFC00" },
                        { name: "DIY Enthusiasts", value: 15, color: "#E57373" },
                        { name: "Students", value: 5, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "Technical Education", value: 41.2, color: "#0ea5e9" },
                        { name: "Quality/Excellence", value: 44.1, color: "#84cc16" },
                        { name: "Innovation", value: 35.3, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Technical Expertise", value: 95, color: "#84cc16" },
                        { claim: "Authority", value: 90, color: "#3b82f6" },
                        { claim: "Innovation", value: 85, color: "#ffffff" },
                        { claim: "Education", value: 100, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Educational", value: 60, color: "#3b82f6" },
                        { name: "Clear", value: 25, color: "#84cc16" },
                        { name: "Expert", value: 15, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Technical Education", Emergent: 41, Mandated: 50 },
                        { name: "ADAS Integration Tutorials", Emergent: 10, Mandated: 30 },
                        { name: "Cybersecurity Explainers", Emergent: 1, Mandated: 20 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "DMS Setup Tutorials Share", value: 1 },
                        { title: "Secure Mirror-Edge Computing Share", value: 1 }
                    ],
                    strategySnapshot: [
                        { competitor: "Forvia", strategy: "The Teacher (Aftermarket)", dataPoint: "Top driver is educational tutorials", color: "text-primary" },
                        { competitor: "Gentex", strategy: "The Teacher (OEM Tech)", dataPoint: "Focus on core technology education", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Launch DMS Installation Series", goal: "10% → 30% (120 days)", current: 10, target: 30 },
                        { name: "Create 'Secure Vision' Explainer", goal: "1% → 20% (now 1%)", current: 1, target: 20 },
                    ],
                    competitorPositioning: [
                        { x: -3.5, y: 3.5, name: "Forvia (Aftermarket)" },
                    ],
                    magnaPosition: { x: 3, y: 2, name: "Gentex", strategy: "Teacher (OEM Tech)" },
                },
                topDrivers: [
                    { driver: "Technical Education", lift: 550, example: "High watch time on tutorials" },
                    { driver: "Quality/Excellence Demos", lift: 410, example: "Positive comments on durability tests" },
                    { driver: "Innovation Deep Dives", lift: 380, example: "Good engagement from engineers" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 1, percentage: 5.9 },
                    adas: { posts: 5, percentage: 29.4 },
                    lightweighting: { posts: 1, percentage: 5.9 },
                    environmental: { posts: 2, percentage: 11.8 },
                    sdvs: { posts: 2, percentage: 11.8 },
                },
                audienceSegments: [
                    { segment: "Technical Learners", share: 50, confidence: "H" },
                    { segment: "Engineers", share: 30, confidence: "M" },
                    { segment: "DIY Enthusiasts", share: 15, confidence: "M" },
                    { segment: "Students", share: 5, confidence: "L" },
                ],
            },
        },
        strategicRecommendations: {
            linkedin: [
                { recommendation: "Launch 'Secure Vision' Cybersecurity Series", audience: "B2B Professionals, OEMs", driver: "ADAS Cybersecurity", action: "Create a 3-part article series on the importance of mirror-edge computing security to fill the <1% whitespace.", expectedEffect: "Establish thought leadership and address a key strategic risk." },
                { recommendation: "Translate 'Vision 2030' Roadmap for B2B", audience: "OEM Decision Makers, Investors", driver: "Innovation", action: "Develop infographics and short-form videos from the 'Vision 2030' roadmap, focusing on the commercial benefits of OLED and night vision.", expectedEffect: "Shift narrative from tech specs to customer value." },
                { recommendation: "Amplify 'Smart Home Ecosystem' Partnerships", audience: "Tech Partners, B2B Professionals", driver: "SDV Integration", action: "Showcase HomeLink's integration with major smart home platforms through partner-tagged posts and testimonials.", expectedEffect: "Position Gentex as a key player in the connected car ecosystem." },
                { recommendation: "Promote 'Made in America' Supply Chain Resilience", audience: "OEMs, Investors", driver: "Quality/Excellence", action: "Create content highlighting domestic production and supply chain diversification in response to geopolitical concerns.", expectedEffect: "Build confidence and counter supply chain risk perceptions." },
                { recommendation: "Spotlight 'Defense & Aerospace' Diversification", audience: "Investors, Tech Talent", driver: "Innovation", action: "Regularly feature content about non-automotive projects like the Navy helmet contract to showcase resilience and diversification.", expectedEffect: "Broaden brand perception beyond just automotive." }
            ],
            twitter: [
                { recommendation: "Live-Tweet from Regulatory & Standards Meetings", audience: "Industry Journalists", driver: "Technical Authority", action: "Have an engineer live-tweet insights from key SAE or UNECE meetings to provide expert commentary.", expectedEffect: "Become a go-to source for journalists on vision system regulations." },
                { recommendation: "Create 'DMS Saves the Day' Scenarios", audience: "Tech Enthusiasts", driver: "Innovation", action: "Use short, simple animated GIFs or threads to explain how Driver Monitoring Systems prevent accidents.", expectedEffect: "Make the safety benefits of ADAS technology more tangible and shareable." },
                { recommendation: "Run a 'Guess the Car' Challenge", audience: "Tech Enthusiasts", driver: "Community", action: "Post close-up, stylized shots of Gentex mirrors on different OEM vehicles and have followers guess the make and model.", expectedEffect: "Increase fun, community-based engagement and subtly showcase OEM wins." },
                { recommendation: "Rapid-Response to Competitor News", audience: "Industry Insiders, Journalists", driver: "Industry Updates", action: "When competitors announce new vision tech, prepare a rapid response tweet highlighting Gentex's differentiated features or market share.", expectedEffect: "Shape the competitive narrative in real-time." },
                { recommendation: "Share 'From the Community' Content", audience: "Community Members", driver: "Community", action: "Retweet positive local news and employee achievements from the West Michigan area to strengthen the 'Neighbor' persona.", expectedEffect: "Improve local sentiment and employee morale." }
            ],
            instagram: [
                { recommendation: "Launch 'Design Studio' Reels Series", audience: "Young Professionals, Design Students", driver: "Visual Inspiration", action: "Create behind-the-scenes Reels showing the industrial design process for new mirrors or dimmable visors.", expectedEffect: "Boost recruitment appeal for design talent." },
                { recommendation: "Create 'Through the Mirror' Photo Series", audience: "All", driver: "Visual Appeal", action: "Run a user-generated content campaign asking followers to submit their best photos taken 'through' a car mirror, tagging Gentex.", expectedEffect: "Drive high engagement and authentic, brand-aligned content." },
                { recommendation: "Visualize Night Vision vs. Standard", audience: "Tech Enthusiasts", driver: "Innovation", action: "Use a compelling split-screen Reel to demonstrate the dramatic difference FDM with night vision makes in dark conditions.", expectedEffect: "Clearly and visually communicate a key technological advantage." },
                { recommendation: "Showcase 'A Day in the Life' of an Engineer", audience: "Young Professionals, Students", driver: "Company Culture", action: "Have a young engineer do an Instagram Stories takeover for a day to showcase the culture and exciting projects.", expectedEffect: "Increase employer brand authenticity and appeal." },
                { recommendation: "Partner with Automotive Photographers", audience: "Tech Enthusiasts", driver: "Visual Appeal", action: "Collaborate with popular car photographers to feature Gentex products in their high-quality, aspirational shots.", expectedEffect: "Increase brand reach and associate with premium automotive aesthetics." }
            ],
            facebook: [
                { recommendation: "Launch 'Gentex Gives Back' Series", audience: "Community Members", driver: "Community Building", action: "Create a dedicated monthly post highlighting a specific community partnership or employee volunteer effort in West Michigan.", expectedEffect: "+300% local engagement and solidified community support." },
                { recommendation: "Translate 'Innovation' to 'Local Jobs'", audience: "Community Members, Employees", driver: "Community", action: "When new technology is announced on LinkedIn, create a follow-up Facebook post explaining how that innovation supports jobs and growth in the local community.", expectedEffect: "Build local pride and support for the company's R&D investments." },
                { recommendation: "'Generations of Gentex' Employee Features", audience: "Employees & Families", driver: "Company Culture", action: "Spotlight families with multiple generations working at Gentex to reinforce the company's role as a stable, long-term local employer.", expectedEffect: "Increase organic reach through employee shares and strengthen loyalty." },
                { recommendation: "Promote Local Hiring Events", audience: "Local Job Seekers", driver: "Community", action: "Use Facebook Events and targeted ads to heavily promote career fairs and hiring events at the Zeeland campus.", expectedEffect: "Drive high-quality local applications and improve employer brand perception." },
                { recommendation: "Share 'West Michigan' Pride Content", audience: "Community Members", driver: "Community Building", action: "Regularly share and engage with positive news and events from the West Michigan area, positioning Gentex as an integral part of the community.", expectedEffect: "Reinforce the 'Neighbor' persona and build goodwill." }
            ],
            youtube: [
                { recommendation: "Create 'DMS: The Ultimate Co-Pilot' Series", audience: "Technical Learners", driver: "Technical Education", action: "Produce a 3-part series that explains not just what DMS is, but *how* it detects distraction and drowsiness, using on-screen graphics.", expectedEffect: "Become the definitive educational resource for DMS technology, driving views from students and professionals." },
                { recommendation: "'Secure Vision': Explaining Mirror Cybersecurity", audience: "Technical Learners", driver: "Education", action: "Create a clear, animated explainer video on the importance of cybersecurity for smart mirrors and how Gentex is addressing it.", expectedEffect: "Fill a critical knowledge gap and proactively address a key strategic risk." },
                { recommendation: "Launch 'From the Archives' Heritage Videos", audience: "All", driver: "Heritage/Legacy", action: "Digitize and share old footage of early product tests or company milestones, packaged as short 'From the Archives' segments.", expectedEffect: "Leverage high-performing heritage content in a new format." },
                { recommendation: "Produce 'How Electrochromics Work' Deep Dive", audience: "Technical Learners, DIY Enthusiasts", driver: "Technical Education", action: "Create a flagship, in-depth video with a lead engineer and lab demos explaining the science behind the core dimming technology.", expectedEffect: "Solidify technical authority and create a long-lasting educational asset." },
                { recommendation: "Convert Top Tech Topics into Shorts", audience: "All", driver: "Education", action: "Take the most interesting 60-second segment from each technical video and publish it as a YouTube Short to attract a wider audience to the channel.", expectedEffect: "Dramatically increase channel discovery and subscriber growth." }
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
            brand: "Gentex",
            period: "2024–06–01 to 2025–08–01",
            articles: 171,
            positivePercentage: 45,
            challengingPercentage: 21,
            topPillar: "Vision Technology Pioneer",
            dominantRegion: "NA 58%",
            riskCount: 4,
            latestVelocity: "2 (Feb '25)",
            positioning: "Vision systems integrator → sensing & connectivity platform"
        },
        v1: {
            executiveSummary: {
                articles: 171,
                period: "June 2024 - August 2025",
                regionalSplit: { NA: 58, AS: 28, EU: 14 },
                sentiment: { positive: 45, neutral: 34, challenging: 21 },
                topPillars: [
                    { name: "Vision Technology Pioneer", percentage: 45 },
                    { name: "ADAS Integration Leader", percentage: 26 },
                    { name: "Smart Ecosystem Connector", percentage: 16 }
                ],
                narrative: "Gentex positions as a technology-forward vision systems integrator successfully navigating geopolitical headwinds while expanding beyond traditional mirrors into comprehensive sensing, AI-driven safety, and smart home connectivity solutions."
            },
            auditFoundation: [
                { sourceType: "Trade/Industry", count: 58, percentage: 34, topPublications: ["Automotive News", "SAE Automotive Engineering", "Just Auto", "WardsAuto"] },
                { sourceType: "Tier-1 Financial", count: 32, percentage: 19, topPublications: ["Reuters", "Bloomberg", "Financial Times", "Wall Street Journal"] },
                { sourceType: "Tech/Innovation", count: 28, percentage: 16, topPublications: ["IEEE Spectrum", "TechCrunch", "The Verge", "ASD News"] },
                { sourceType: "ESG/Policy/Regulatory", count: 24, percentage: 14, topPublications: ["NHTSA docs", "UNECE standards", "Sustainability reports"] },
                { sourceType: "Regional/Business", count: 21, percentage: 12, topPublications: ["MLive", "WGVU News", "Performance Racing", "Channel News Australia"] },
                { sourceType: "Non-independent", count: 8, percentage: 5, topPublications: ["PR Newswire", "Business Wire"] }
            ],
            shareOfVoice: [
                { topic: "Technology Innovation", share: 38, sources: "SAE, Automotive News, IEEE", tone: "Positive" },
                { topic: "Financial Performance", share: 22, sources: "Bloomberg, Reuters, WSJ", tone: "Challenging" },
                { topic: "Strategic M&A/Partnerships", share: 18, sources: "Financial Times, Trade pubs", tone: "Positive" },
                { topic: "Regulatory/ADAS Compliance", share: 12, sources: "NHTSA, UNECE, Trade media", tone: "Neutral" },
                { topic: "Leadership/Operations", share: 10, sources: "Regional, Trade outlets", tone: "Positive" }
            ],
            productCoverage: {
                brandNative: [
                    { category: "Full Display Mirror", share: 42, tone: "Positive", signal: "Night vision capabilities integrated. OLED upgrade signals premium positioning." },
                    { category: "Driver Monitoring (DMS)", share: 28, tone: "Positive", signal: "Mirror-integrated solution addresses EU NCAP mandates. Cabin-wide sensing capabilities." },
                    { category: "Electrochromic Mirror", share: 18, tone: "Neutral", signal: "Dimmable film technology evolution. 86% market share maintained." },
                    { category: "Interior Electronics", share: 12, tone: "Positive", signal: "HomeLink 30-year evolution. Integration with Apple CarPlay/Android Auto." }
                ],
                universal: [
                    { category: "Electrical/Electronics", share: 68, tone: "Positive", signal: "ADAS sensor integration dominates. Thermal imaging partnerships breakthrough." },
                    { category: "Exterior/Interior", share: 28, tone: "Positive", signal: "Dimmable visor innovation. Film-based electrochromic sunroof development." },
                    { category: "Body & Chassis", share: 2, tone: "Neutral", signal: "Limited structural applications." },
                    { category: "Powertrain", share: 1, tone: "Neutral", signal: "Minimal EV-specific integration noted." },
                    { category: "Complete Vehicles", share: 1, tone: "N/A", signal: "Not applicable to Gentex business model." }
                ]
            },
            sentiment: {
                overall: {
                    raw: [
                        { sentiment: "Positive", count: 77, percentage: 45 },
                        { sentiment: "Neutral", count: 58, percentage: 34 },
                        { sentiment: "Challenging", count: 36, percentage: 21 }
                    ],
                    weighted: [
                        { sentiment: "Positive", count: 77, percentage: 45 },
                        { sentiment: "Neutral", count: 58, percentage: 34 },
                        { sentiment: "Challenging", count: 36, percentage: 21 }
                    ]
                },
                byRegion: [
                    { region: "NA", positive: 52, neutral: 31, challenging: 17 },
                    { region: "AS", positive: 28, neutral: 42, challenging: 30 },
                    { region: "EU", positive: 41, neutral: 38, challenging: 21 }
                ],
                byOutlet: [
                    { outlet: "Tier-1 Financial", positive: 22, neutral: 39, challenging: 39 },
                    { outlet: "Trade/Industry", positive: 51, neutral: 35, challenging: 14 },
                    { outlet: "Tech/Innovation", positive: 61, neutral: 29, challenging: 10 },
                    { outlet: "ESG/Policy", positive: 42, neutral: 46, challenging: 12 },
                    { outlet: "Regional", positive: 64, neutral: 28, challenging: 8 }
                ],
                quotes: [
                    { type: "Positive", quote: "We use CES as a way to throw things up on the wall and see what sticks... The ones that our customers gravitate toward — hopefully, we'll get a development program with them", author: "Craig Piersma, VP Marketing", source: "Automotive News", date: "Jan 6, 2025" },
                    { type: "Challenging", quote: "Gentex Corp. and even Magna International — are dialing back their financial guidance... suppliers are cutting back on their R&D spending, fearing their investments in EVs might not pay off", author: "Industry Analysis", source: "Automotive News", date: "Aug 11, 2024" }
                ]
            },
            brandPillars: [
                { pillar: "Vision Technology Pioneer", share: 45, tone: "Positive", phrases: "night vision integration, OLED advancement, digital vision leader", quote: "The new FDM uses infrared sensors, allowing clear, glare-free image regardless of nighttime darkness" },
                { pillar: "ADAS Integration Leader", share: 26, tone: "Positive", phrases: "mirror-integrated DMS, comprehensive sensing, regulatory compliance", quote: "DMS integrates monitoring capabilities throughout the cabin... space-saving option that aligns with evolving safety standards" },
                { pillar: "Smart Ecosystem Connector", share: 16, tone: "Positive", phrases: "HomeLink evolution, smart home integration, CarPlay compatibility", quote: "HomeLink celebrating 30 years of car-to-home automation... integrates with Apple CarPlay and Android Auto" },
                { pillar: "Resilient Innovator", share: 13, tone: "Mixed", phrases: "navigating tariffs, strategic pivot, technology adaptation", quote: "They're still out here looking for partnerships... they know they have to change what they're doing" }
            ],
            businessDrivers: [
                { driver: "ADAS/Autonomy", hits: 38, toneBias: "Positive", relevance: "DMS/ICMS mirror integration aligns with EU NCAP requirements driving adoption." },
                { driver: "Software-Defined Vehicles", hits: 22, toneBias: "Neutral", relevance: "HomeLink smart home integration positions for SDV connectivity demands." },
                { driver: "Environmental Leadership", hits: 18, toneBias: "Positive", relevance: "Film-based electrochromic technology reduces energy consumption vs. gel alternatives." },
                { driver: "Electrification", hits: 16, toneBias: "Mixed", relevance: "VOXX acquisition adds EV aftermarket but core technology EV-agnostic." },
                { driver: "Lightweighting", hits: 6, toneBias: "Neutral", relevance: "OLED displays eliminate backlights, contributing to weight reduction goals." }
            ],
            whiteSpace: [
                { topic: "ADAS Cybersecurity", coverage: "1%", importance: "2023 cyberattack mentioned but no proactive security narrative", action: "Partner with cybersecurity firm for secure mirror-edge computing platform." },
                { topic: "Circularity/Recycling", coverage: "3%", importance: "EU end-of-vehicle directives tightening on electronic components", action: "Highlight mirror component recyclability and circular design principles." },
                { topic: "Hydrogen", coverage: "0%", importance: "Fuel cell vehicles require specialized sensor calibration", action: "Explore H2-compatible sensor adaptations for emerging FCEV market." },
                { topic: "Supply-Chain Resilience", coverage: "4%", importance: "China production halt exposes geographic concentration risks", action: "Articulate supply chain diversification strategy publicly." }
            ],
            narrativeVelocity: [
                { month: "2024-06", positive: 3, challenging: 1, netDelta: 0 },
                { month: "2024-07", positive: 4, challenging: 1, netDelta: 3 },
                { month: "2024-08", positive: 2, challenging: 3, netDelta: -2 },
                { month: "2024-09", positive: 2, challenging: 2, netDelta: 0 },
                { month: "2024-10", positive: 5, challenging: 1, netDelta: 4 },
                { month: "2024-11", positive: 3, challenging: 1, netDelta: 2 },
                { month: "2024-12", positive: 4, challenging: 3, netDelta: -1 },
                { month: "2025-01", positive: 7, challenging: 2, netDelta: 6 },
                { month: "2025-02", positive: 3, challenging: 1, netDelta: 2 }
            ],
            industryEvents: [
                { date: "2024-10", event: "US Chip Export Controls Expansion", driver: "Supply-chain", coverage: 400, gentexArticles: 2, toneShift: 0, sources: "Reuters, Bloomberg" },
                { date: "2024-11", event: "EU NCAP DMS Requirements Finalized", driver: "ADAS/Autonomy", coverage: 200, gentexArticles: 4, toneShift: 3, sources: "SAE, Automotive News" },
                { date: "2024-12", event: "VOXX International Acquisition Complete", driver: "M&A/Consolidation", coverage: 180, gentexArticles: 8, toneShift: -1, sources: "WSJ, Channel News" },
                { date: "2025-01", event: "CES 2025 Automotive Tech Showcase", driver: "SDV/Innovation", coverage: 800, gentexArticles: 12, toneShift: 6, sources: "Automotive News, TechCrunch" },
                { date: "2025-01", event: "China ADAS Advertisement Restrictions", driver: "ADAS/Autonomy", coverage: 300, gentexArticles: 3, toneShift: -2, sources: "Reuters, Trade media" },
                { date: "2025-02", event: "EU Cybersecurity Act Implementation", driver: "ADAS Cybersecurity", coverage: 150, gentexArticles: 1, toneShift: 0, sources: "EU regulatory sources" },
                { date: "2025-04", event: "Gentex China Production Halt", driver: "Supply-chain", coverage: 120, gentexArticles: 15, toneShift: -5, sources: "WGVU, Trade publications" },
                { date: "2025-07", event: "Semiconductor Shortage 2.0 Warnings", driver: "Supply-chain", coverage: 300, gentexArticles: 4, toneShift: -3, sources: "S&P Global, Trade media" }
            ],
            strategic: {
                risks: [
                    "Cybersecurity vulnerability exposure: 2023 attack mentioned without defensive narrative",
                    "Geopolitical concentration risk: China market elimination exposes over-dependence",
                    "Technology commoditization threat: Chinese DMS suppliers at lower price points",
                    "EV transition headwinds: Supplier guidance reductions amid automaker EV pullbacks"
                ],
                opportunities: [
                    "Premium technology differentiation: Night vision FDM and OLED displays",
                    "Regulatory tailwind capture: EU NCAP DMS requirements create TAM expansion",
                    "Smart home ecosystem expansion: HomeLink evolution into connectivity platform",
                    "Defense market diversification: Navy helmet contract demonstrates growth potential"
                ],
                blindSpots: [
                    "Software platform strategy unclear: Limited articulation of SDV middleware/API capabilities",
                    "Semiconductor supply chain resilience: No diversification strategy post-2021 shortages",
                    "Cybersecurity proactive measures: Focus on incident response without prevention narrative",
                    "China competitive landscape: Insufficient tracking of BYD/Huawei ADAS development"
                ]
            },
            recommendations: [
                { id: 1, action: "Launch 'Secure Vision' Cybersecurity Initiative", detail: "Partner with automotive cybersecurity leader to develop encrypted edge computing for mirrors, directly addressing 2023 attack narrative while differentiating in DMS market." },
                { id: 2, action: "Establish 'Vision 2030' Technology Roadmap", detail: "Publicly articulate night vision, OLED, and thermal integration timeline to shift investor focus from margin concerns to technology leadership premium." },
                { id: 3, action: "Create Smart Home Developer Ecosystem", detail: "Launch API portal for HomeLink integration, host developer conferences, positioning as connectivity platform versus component supplier." },
                { id: 4, action: "Amplify Defense Diversification Narrative", detail: "Highlight Navy helmet contract and aerospace applications to demonstrate market resilience beyond automotive cyclicality." },
                { id: 5, action: "Deploy 'Supply Chain Independence' Communications", detail: "Announce semiconductor sourcing diversification and domestic production expansion to counter geopolitical risk perceptions." }
            ],
            brandPositioning: {
                ascribedPositioning: 'A niche technology leader in vision systems, expanding its dominance into integrated ADAS sensing and connectivity.',
                thirdPartyBrandPromise: 'Delivering the most advanced and reliable mirror-based safety and convenience features in the automotive industry.',
                narrativeFrames: [
                    'Vision Systems Dominator',
                    'Smart Integrator',
                    'Resilient Niche Player',
                    'Community-Rooted Innovator'
                ]
            },
            conclusion: 'Gentex\'s 2024-2025 earned media footprint solidifies its position as a dominant force in vision technology, successfully expanding its narrative to include integrated ADAS and smart connectivity. Positive coverage is driven by clear technological superiority (FDM, DMS) and regulatory tailwinds. However, this is counterbalanced by challenging financial narratives linked to broader EV market slowdowns and significant geopolitical risks, particularly supply chain concentration. The brand has major unaddressed vulnerabilities in its cybersecurity narrative and supply chain resilience communications. The core opportunity lies in leveraging its strong innovation pipeline to build a more comprehensive story of a resilient, diversified technology company that extends beyond the automotive mirror.',
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
                    { name: 'Trade/Industry', value: 34, color: '#8FFF00' },
                    { name: 'Tier-1 Financial', value: 19, color: '#DA6E44' },
                    { name: 'Tech/Innovation', value: 16, color: '#8b5cf6' },
                    { name: 'ESG/Policy', value: 14, color: '#3175D4' },
                    { name: 'Regional/Business', value: 12, color: '#FAFAFA' },
                    { name: 'Non-independent', value: 5, color: '#CCCCCC' }
                ],
                topPublications: { list: ["Automotive News", "SAE Automotive Engineering", "Just Auto"], percentage: 34 }
            },
            topicsTreeMap: {
                legend: { Positive: '#8FFF00', Challenging: '#DA6E44', Neutral: '#3175D4' },
                data: [
                    { name: 'Technology Innovation', size: 38, sentiment: 'Positive' },
                    { name: 'Financial Performance', size: 22, sentiment: 'Challenging', keySources: ["Bloomberg", "Reuters", "WSJ"] },
                    { name: 'Strategic M&A/Partnerships', size: 18, sentiment: 'Positive' },
                    { name: 'Regulatory/ADAS Compliance', size: 12, sentiment: 'Neutral' },
                    { name: 'Leadership/Operations', size: 10, sentiment: 'Positive' }
                ]
            },
            brandNativeCoverage: {
                data: [
                    { name: 'Full Display Mirror', value: 42, color: '#8FFF00' },
                    { name: 'Driver Monitoring (DMS)', value: 28, color: '#8FFF00' },
                    { name: 'Electrochromic Mirror', value: 18, color: '#CCCCCC' },
                    { name: 'Interior Electronics', value: 12, color: '#3175D4' }
                ],
                strategicSignal: { text: "Night vision capabilities integrated. OLED upgrade signals premium positioning.", percentage: 42 }
            },
            mandatedBusinessDrivers: {
                legend: { positive: '#8FFF00', neutral: '#3175D4', challenging: '#DA6E44' },
                data: [
                    { name: 'ADAS/Autonomy', total: 38, positive: 95, neutral: 5, challenging: 0 },
                    { name: 'Software-Defined Vehicles', total: 22, positive: 50, neutral: 50, challenging: 0 },
                    { name: 'Environmental Leadership', total: 18, positive: 80, neutral: 20, challenging: 0 },
                    { name: 'Electrification', total: 16, positive: 30, neutral: 40, challenging: 30 },
                    { name: 'Lightweighting', total: 6, positive: 40, neutral: 60, challenging: 0 },
                ]
            },
            strengths: [
                { title: 'Vision Tech Dominance', description: "Unquestioned leadership in core vision systems, with a clear innovation roadmap (OLED, night vision) driving positive tech coverage." },
                { title: 'Regulatory Alignment', description: "Products like the mirror-integrated DMS are perfectly positioned to capitalize on mandatory safety regulations (EU NCAP), creating a strong growth narrative." },
                { title: "Smart Integration Strategy", description: "Successfully expanding beyond mirrors into connected ecosystems (HomeLink) and cabin-wide sensing, broadening the company's addressable market." }
            ],
            risks: [
                { title: 'Geopolitical Vulnerability', description: "Heavy reliance on specific regions for production and sales creates significant risk, as demonstrated by the China production halt.", color: "text-orange-400" },
                { title: 'Cybersecurity Narrative Gap', description: "A past cyberattack is mentioned in coverage with no proactive, defensive narrative from the company, creating a perception of vulnerability.", color: "text-blue-400" }
            ],
            timeline: {
                events: [
                    { date: "November 2024", label: "EU NCAP DMS Rules", type: "Positive", position: 25, side: 'top' },
                    { date: "December 2024", label: "VOXX Acquisition", type: "Mixed", position: 35, side: 'bottom' },
                    { date: "January 2025", label: "CES 2025 Showcase", type: "Positive", position: 45, side: 'top' },
                    { date: "April 2025", label: "China Production Halt", type: "Crisis", position: 70, side: 'bottom' },
                    { date: "July 2025", label: "Semiconductor Shortage 2.0", type: "Crisis", position: 90, side: 'top' },
                ],
                context: { text: "Industry Context: Geopolitical supply chain pressures and regulatory deadlines for ADAS.\nStrategic Impact: Regulatory wins provide a positive catalyst against supply chain challenges.", position: 55 },
                legend: { Positive: '#8FFF00', Mixed: '#FFD700', Crisis: '#DA6E44', Dual: '#8b5cf6', Others: '#CCCCCC' }
            },
            keyInsights: [
                { title: 'Leader in a Niche', color: '', description: "The media portrays Gentex as a dominant, innovative leader within its specific domain, but links its financial fate to broader, challenging industry trends." },
                { title: 'Innovation Outpaces Narrative', color: 'text-blue-400', description: "The company's technology is expanding into complex areas like cabin-wide sensing and connectivity, but the public narrative on adjacent topics (cybersecurity, software) hasn't kept pace." },
                { title: 'External Risks, Internal Strengths', color: 'text-orange-400', description: "The biggest challenges in the narrative come from external factors (geopolitics, EV slowdowns), while the core strengths are internal (technology, market share)." },
            ],
            opportunities: [
                { text: "Launch a 'Secure Vision' cybersecurity initiative to fill the narrative gap", color: '#8FFF00' },
                { text: "Deploy 'Supply Chain Independence' communications to counter geopolitical risk", color: '#DA6E44' },
                { text: "Amplify the defense and aerospace diversification story to show resilience", color: '#3175D4' }
            ]
        }
    }
}