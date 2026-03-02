export const densoData = {
    brandName: "Denso",
    socialMedia: {
        platforms: {
            linkedin: {
                name: "LinkedIn",
                followers: 303000,
                posts: 228,
                avgEngagement: 410.5,
                sentiment: { positive: 72, neutral: 20, negative: 3, mixed: 2 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Innovation Leadership", value: 420 },
                        { name: "Employee Recognition", value: 380 },
                        { name: "Sustainability Focus", value: 350 },
                        { name: "Manufacturing Excellence", value: 310 },
                        { name: "Company Heritage", value: 280 },
                    ],
                    kpis: {
                        metricsMentions: 410.5,
                        thirdPartyCitations: 48,
                        positiveSentiment: 72,
                    },
                    audienceEngagement: [
                        { name: "B2B Professionals", value: 50, color: "#3B82F6" },
                        { name: "Engineers/Technical Specialists", value: 35, color: "#7CFC00" },
                        { name: "OEM Decision Makers", value: 10, color: "#E57373" },
                        { name: "Students/Academia", value: 5, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "Innovation Leadership", value: 43.9, color: "#0ea5e9" },
                        { name: "Employee Recognition", value: 37.3, color: "#84cc16" },
                        { name: "Sustainability Focus", value: 35.1, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Technical Authority", value: 95.0, color: "#84cc16" },
                        { claim: "Innovation Leadership", value: 100.0, color: "#3b82f6" },
                        { claim: "Sustainability Commitment", value: 80.0, color: "#ffffff" },
                        { claim: "Employer Brand", value: 85.0, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Authoritative", value: 45.0, color: "#3b82f6" },
                        { name: "Educational", value: 35.0, color: "#84cc16" },
                        { name: "Professional", value: 20.0, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Innovation Leadership", Emergent: 45, Mandated: 40 },
                        { name: "Electrification", Emergent: 15, Mandated: 35 },
                        { name: "ADAS/Semiconductors", Emergent: 20, Mandated: 45 },
                        { name: "Employee Recognition", Emergent: 38, Mandated: 15 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "ADAS Cybersecurity Share", value: 0.6 },
                        { title: "Data Monetization Share", value: 0.8 }
                    ],
                    strategySnapshot: [
                        { competitor: "Bosch", strategy: "Technical Expert", dataPoint: "65% Technical / B2B posts", color: "text-primary" },
                        { competitor: "Continental", strategy: "Validation & Authority", dataPoint: "Focus on milestones & strategy", color: "text-primary" },
                        { competitor: "Denso", strategy: "Sage Authority", dataPoint: "Heavy focus on tech leadership & partnerships", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Amplify Semiconductor Narrative", goal: "20% → 45% (90 days)", current: 20, target: 45 },
                        { name: "Launch Data Monetization Content", goal: "0.8% → 5% (now 0.8%)", current: 0.8, target: 5 },
                        { name: "Boost Electrification Stories", goal: "15% → 35% (now 15%)", current: 15, target: 35 },
                    ],
                    competitorPositioning: [
                        { x: 3.5, y: -3.5, name: "Bosch (Technical)" },
                        { x: 2.5, y: 3.5, name: "Continental (Validation)" },
                    ],
                    magnaPosition: { x: 3.0, y: 2.5, name: "Denso", strategy: "Sage Authority" },
                },
                topDrivers: [
                    { driver: "Innovation Leadership", lift: 420, example: "High likes/comments on partnerships" },
                    { driver: "Employee Recognition", lift: 380, example: "Strong engagement on team awards" },
                    { driver: "Sustainability Focus", lift: 350, example: "Positive sentiment on green initiatives" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 35, percentage: 15.4 },
                    adas: { posts: 40, percentage: 17.5 },
                    lightweighting: { posts: 5, percentage: 2.2 },
                    environmental: { posts: 25, percentage: 11.0 },
                    sdvs: { posts: 30, percentage: 13.2 },
                },
                audienceSegments: [
                    { segment: "B2B Professionals", share: 50, confidence: "H" },
                    { segment: "Engineers/Technical Specialists", share: 35, confidence: "H" },
                    { segment: "OEM Decision Makers", share: 10, confidence: "M" },
                    { segment: "Students/Academia", share: 5, confidence: "L" },
                ],
            },
            // twitter: {
            //     name: "X/Twitter",
            //     followers: 509,
            //     posts: 36,
            //     avgEngagement: 85.2,
            //     sentiment: { positive: 42, neutral: 9, negative: 1, mixed: 0 },
            //     PerformanceData: {
            //         topEngagementDrivers: [
            //             { name: "Employee Recognition", value: 200 },
            //             { name: "Regional Employment News", value: 180 },
            //             { name: "Company Heritage Snippets", value: 150 },
            //         ],
            //         kpis: { metricsMentions: 85.2, thirdPartyCitations: 35, positiveSentiment: 42 },
            //         audienceEngagement: [
            //             { name: "Industry Insiders", value: 45, color: "#3B82F6" },
            //             { name: "Journalists", value: 30, color: "#7CFC00" },
            //             { name: "Employees", value: 15, color: "#E57373" },
            //             { name: "Local Communities", value: 10, color: "#F3F4F6" },
            //         ],
            //         primaryContentThemes: [
            //             { name: "Employee Recognition", value: 50.0, color: "#0ea5e9" },
            //             { name: "Regional Employment", value: 42.5, color: "#84cc16" },
            //             { name: "Company Heritage", value: 35.0, color: "#f97316" },
            //         ],
            //         homepageVsFeed: [
            //             { claim: "News Authority", value: 90, color: "#84cc16" },
            //             { claim: "Timeliness", value: 95, color: "#3b82f6" },
            //             { claim: "Community Focus", value: 85, color: "#ffffff" },
            //             { claim: "Innovation Updates", value: 65, color: "#f97316" },
            //         ],
            //         brandVoice: [
            //             { name: "Informative", value: 55, color: "#3b82f6" },
            //             { name: "Timely", value: 30, color: "#84cc16" },
            //             { name: "Celebratory", value: 15, color: "#f97316" },
            //         ],
            //         contentStrategyGap: [
            //             { name: "News & Updates", Emergent: 55, Mandated: 40 },
            //             { name: "Innovation/Semiconductors", Emergent: 25, Mandated: 45 },
            //             { name: "Sustainability", Emergent: 10, Mandated: 20 },
            //         ],
            //         whiteSpaceOpportunities: [
            //             { title: "Real-Time Partnership Updates Share", value: 0.9 },
            //             { title: "Semiconductor Tech Threads Share", value: 0.92 }
            //         ],
            //         strategySnapshot: [
            //             { competitor: "Continental", strategy: "Corporate Broadcast", dataPoint: "Focus on official news & strategy", color: "text-primary" },
            //             { competitor: "Denso", strategy: "The Herald", dataPoint: "Highest retweets on real-time news", color: "text-white" },
            //         ],
            //         strategicInitiatives: [
            //             { name: "Launch Semiconductor Tech Threads", goal: "5% → 20% (90 days)", current: 5, target: 20 },
            //             { name: "Increase Real-Time Partnership News", goal: "15% → 30% (now 15%)", current: 15, target: 30 },
            //         ],
            //         competitorPositioning: [
            //             { x: 3, y: 1.5, name: "Continental (Corporate)" },
            //         ],
            //         magnaPosition: { x: -2, y: 3.0, name: "Denso", strategy: "The Herald" },
            //     },
            //     topDrivers: [
            //         { driver: "Employee Recognition", lift: 200, example: "Highest retweets on awards" },
            //         { driver: "Regional Employment News", lift: 180, example: "High engagement on job fair announcements" },
            //         { driver: "Company Heritage Snippets", lift: 150, example: "Strong performance of #ThrowbackThursday" },
            //     ],
            //     mandatedDrivers: {
            //         electrification: { posts: 10, percentage: 10.0 },
            //         adas: { posts: 15, percentage: 15.0 },
            //         lightweighting: { posts: 2, percentage: 2.0 },
            //         environmental: { posts: 8, percentage: 8.0 },
            //         sdvs: { posts: 12, percentage: 12.0 },
            //     },
            //     audienceSegments: [
            //         { segment: "Industry Insiders", share: 45, confidence: "H" },
            //         { segment: "Journalists", share: 30, confidence: "H" },
            //         { segment: "Employees", share: 15, confidence: "M" },
            //         { segment: "Local Communities", share: 10, confidence: "M" },
            //     ],
            // },
            instagram: {
                name: "Instagram",
                followers: 2600,
                posts: 199,
                avgEngagement: 380.1,
                sentiment: { positive: 91, neutral: 13, negative: 1, mixed: 1 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Manufacturing Excellence (Visuals)", value: 550 },
                        { name: "Employee Recognition", value: 480 },
                        { name: "Innovation Showcase (Behind-the-Scenes)", value: 410 },
                    ],
                    kpis: { metricsMentions: 380.1, thirdPartyCitations: 10, positiveSentiment: 91 },
                    audienceEngagement: [
                        { name: "Young Professionals", value: 50, color: "#3B82F6" },
                        { name: "Engineering Students", value: 30, color: "#7CFC00" },
                        { name: "Current Employees", value: 15, color: "#E57373" },
                        { name: "Tech Enthusiasts", value: 5, color: "#F3F4F6" },
                    ],
                    primaryContentThemes: [
                        { name: "Manufacturing Excellence", value: 50.3, color: "#0ea5e9" },
                        { name: "Employee Recognition", value: 47.7, color: "#84cc16" },
                        { name: "Innovation Leadership", value: 35.2, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Manufacturing Excellence", value: 100, color: "#84cc16" },
                        { claim: "Visual Storytelling", value: 95, color: "#3b82f6" },
                        { claim: "People & Culture", value: 95, color: "#ffffff" },
                        { claim: "Innovation", value: 70, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Creative", value: 45, color: "#84cc16" },
                        { name: "Proud", value: 35, color: "#3b82f6" },
                        { name: "Inspiring", value: 20, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Manufacturing Excellence", Emergent: 55, Mandated: 30 },
                        { name: "Employee Stories", Emergent: 45, Mandated: 25 },
                        { name: "Semiconductor/SDV", Emergent: 10, Mandated: 35 },
                    ],
                    whiteSpaceOpportunities: { behindTheScenesInnovation: 0.9, dayInTheLifeOfAnEngineer: 0.85 },
                    strategySnapshot: [
                        { competitor: "Magna", strategy: "People-First", dataPoint: "Top driver is 'Behind-the-Scenes'", color: "text-primary" },
                        { competitor: "Denso", strategy: "The Creator", dataPoint: "Focus on visual manufacturing excellence", color: "text-white" },
                        { competitor: "Bosch", strategy: "Life Enhancer", dataPoint: "#LikeABosch campaign focus", color: "text-primary" },
                    ],
                    strategicInitiatives: [
                        { name: "Launch Visual Semiconductor Series", goal: "10% → 35% (90 days)", current: 10, target: 35 },
                        { name: "Create 'Day in the Life' Reels", goal: "5% → 25% (now 5%)", current: 5, target: 25 },
                    ],
                    competitorPositioning: [
                        { x: -3, y: -2.5, name: "Magna (People-First)" },
                        { x: 2, y: 3, name: "Bosch (Life Enhancer)" },
                    ],
                    magnaPosition: { x: 3, y: -2, name: "Denso", strategy: "The Creator" },
                },
                topDrivers: [
                    { driver: "Manufacturing Excellence", lift: 550, example: "High visual engagement on factory shots" },
                    { driver: "Employee Recognition", lift: 480, example: "Strong shares of employee award posts" },
                    { driver: "Innovation Showcase", lift: 410, example: "High saves on tech demo Reels" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 15, percentage: 7.5 },
                    adas: { posts: 25, percentage: 12.6 },
                    lightweighting: { posts: 4, percentage: 2.0 },
                    environmental: { posts: 18, percentage: 9.0 },
                    sdvs: { posts: 20, percentage: 10.1 },
                },
                audienceSegments: [
                    { segment: "Young Professionals", share: 50, confidence: "H" },
                    { segment: "Engineering Students", share: 30, confidence: "H" },
                    { segment: "Current Employees", share: 15, confidence: "M" },
                    { segment: "Tech Enthusiasts", share: 5, confidence: "L" },
                ],
            },
            // tiktok: {
            //     name: "TikTok",
            //     followers: 25000,
            //     posts: 25,
            //     avgEngagement: 2500,
            //     sentiment: { positive: 90, neutral: 10, negative: 0, mixed: 0 },
            //     PerformanceData: {
            //         topEngagementDrivers: [
            //             { name: "Manufacturing ASMR", value: 320 },
            //             { name: "Employee Challenges/Trends", value: 250 },
            //             { name: "Tech Explained Simply", value: 180 },
            //         ],
            //         kpis: { metricsMentions: 2500, thirdPartyCitations: 2, positiveSentiment: 90 },
            //         audienceEngagement: [
            //             { name: "Gen Z Students", value: 50, color: "#3B82F6" },
            //             { name: "Young Employees", value: 30, color: "#7CFC00" },
            //             { name: "Tech Hobbyists", value: 20, color: "#E57373" },
            //         ],
            //         primaryContentThemes: [
            //             { name: "Manufacturing", value: 50, color: "#0ea5e9" },
            //             { name: "Culture", value: 35, color: "#84cc16" },
            //             { name: "Innovation", value: 15, color: "#f97316" },
            //         ],
            //         homepageVsFeed: [
            //             { claim: "Cool Tech & People", value: 55, color: "#84cc16" },
            //             { claim: "A Place to Work", value: 40, color: "#3b82f6" },
            //             { claim: "Future of Mobility", value: 25, color: "#ffffff" },
            //             { claim: "Raw Manufacturing", value: 60, color: "#f97316" },
            //         ],
            //         brandVoice: [
            //             { name: "Authentic", value: 60, color: "#84cc16" },
            //             { name: "Playful", value: 25, color: "#3b82f6" },
            //             { name: "Fascinating", value: 15, color: "#f97316" },
            //         ],
            //         contentStrategyGap: [
            //             { name: "Manufacturing ASMR", Emergent: 55, Mandated: 20 },
            //             { name: "Recruitment/Culture", Emergent: 35, Mandated: 30 },
            //             { name: "Semiconductors Explained", Emergent: 5, Mandated: 25 },
            //         ],
            //         whiteSpaceOpportunities: [
            //             { title: "Semiconductor Wafer ASMR Share", value: 0.98 },
            //             { title: "Engineer Day In The Life Share", value: 0.95 }
            //         ],
            //         strategySnapshot: [
            //             { competitor: "Continental", strategy: "The Jester (Viral)", dataPoint: "Top driver is Fear-based Humor", color: "text-primary" },
            //             { competitor: "Denso", strategy: "Authentic Creator", dataPoint: "Mix of ASMR and employee trends", color: "text-white" },
            //         ],
            //         strategicInitiatives: [
            //             { name: "Launch 'Semiconductor ASMR'", goal: "2% → 20% (60 days)", current: 2, target: 20 },
            //             { name: "Create 'Engineer Day in the Life'", goal: "5% → 25% (now 5%)", current: 5, target: 25 },
            //         ],
            //         competitorPositioning: [
            //             { x: 3, y: 4, name: "Continental (The Jester)" },
            //         ],
            //         magnaPosition: { x: -2, y: -3, name: "Denso", strategy: "Authentic Creator" },
            //     },
            //     topDrivers: [
            //         { driver: "Manufacturing ASMR", lift: 320, example: "High views and 'satisfying' comments" },
            //         { driver: "Employee Challenges/Trends", lift: 250, example: "Strong engagement from local communities" },
            //         { driver: "Tech Explained Simply", lift: 180, example: "High shares on educational content" },
            //     ],
            //     mandatedDrivers: {
            //         electrification: { posts: 2, percentage: 8.0 },
            //         adas: { posts: 4, percentage: 16.0 },
            //         lightweighting: { posts: 1, percentage: 4.0 },
            //         environmental: { posts: 2, percentage: 8.0 },
            //         sdvs: { posts: 3, percentage: 12.0 },
            //     },
            //     audienceSegments: [
            //         { segment: "Gen Z Students", share: 50, confidence: "L" },
            //         { segment: "Young Employees", share: 30, confidence: "L" },
            //         { segment: "Tech Hobbyists", share: 20, confidence: "L" },
            //     ],
            // },
            facebook: {
                name: "Facebook",
                followers: 33000,
                posts: 217,
                avgEngagement: 255.8,
                sentiment: { positive: 84, neutral: 18, negative: 1, mixed: 1 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Regional Employment", value: 520 },
                        { name: "Employee Recognition", value: 490 },
                        { name: "Company Heritage", value: 410 },
                    ],
                    kpis: { metricsMentions: 255.8, thirdPartyCitations: 8, positiveSentiment: 84 },
                    audienceEngagement: [
                        { name: "Regional Communities", value: 50, color: "#3B82F6" },
                        { name: "Employees & Families", value: 40, color: "#7CFC00" },
                        { name: "Job Seekers", value: 10, color: "#E57373" },
                    ],
                    primaryContentThemes: [
                        { name: "Regional Employment", value: 45.7, color: "#0ea5e9" },
                        { name: "Employee Recognition", value: 41.1, color: "#84cc16" },
                        { name: "Company Heritage", value: 36.5, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Community Building", value: 100, color: "#84cc16" },
                        { claim: "Great Place to Work", value: 95, color: "#3b82f6" },
                        { claim: "Local Pride", value: 90, color: "#ffffff" },
                        { claim: "Stability", value: 80, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Caring", value: 55, color: "#84cc16" },
                        { name: "Supportive", value: 30, color: "#3b82f6" },
                        { name: "Proud", value: 15, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Regional Employment", Emergent: 50, Mandated: 35 },
                        { name: "Employee Recognition", Emergent: 45, Mandated: 30 },
                        { name: "Innovation/Technology", Emergent: 10, Mandated: 40 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "Innovation to Local Jobs Share", value: 1 },
                        { title: "Family at Denso Stories Share", value: 1 }
                    ],
                    strategySnapshot: [
                        { competitor: "Magna", strategy: "Community-First", dataPoint: "Top drivers are Employee & Local content", color: "text-primary" },
                        { competitor: "Denso", strategy: "The Caregiver", dataPoint: "Heavy focus on regional employment", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Link Innovation to Local Jobs", goal: "10% → 30% (90 days)", current: 10, target: 30 },
                        { name: "Launch 'Family at DENSO' Series", goal: "5% → 20% (now 5%)", current: 5, target: 20 },
                    ],
                    competitorPositioning: [
                        { x: -3.5, y: 3, name: "Magna (Community-First)" },
                    ],
                    magnaPosition: { x: -4, y: 3.5, name: "Denso", strategy: "The Caregiver" },
                },
                topDrivers: [
                    { driver: "Regional Employment", lift: 520, example: "High shares/comments on job postings" },
                    { driver: "Employee Recognition", lift: 490, example: "Strong engagement on service anniversaries" },
                    { driver: "Company Heritage", lift: 410, example: "Positive reactions to historical photos" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 10, percentage: 4.6 },
                    adas: { posts: 12, percentage: 5.5 },
                    lightweighting: { posts: 2, percentage: 0.9 },
                    environmental: { posts: 8, percentage: 3.7 },
                    sdvs: { posts: 5, percentage: 2.3 },
                },
                audienceSegments: [
                    { segment: "Regional Communities", share: 50, confidence: "H" },
                    { segment: "Employees & Families", share: 40, confidence: "H" },
                    { segment: "Job Seekers", share: 10, confidence: "M" },
                ],
            },
            youtube: {
                name: "YouTube",
                followers: 2120,
                posts: 10,
                avgEngagement: 1250,
                sentiment: { positive: 70, neutral: 15, negative: 0, mixed: 0 },
                PerformanceData: {
                    topEngagementDrivers: [
                        { name: "Employer Branding Videos", value: 450 },
                        { name: "Regional Employment Opportunities", value: 380 },
                        { name: "Manufacturing Process Explained", value: 250 },
                    ],
                    kpis: { metricsMentions: 1250, thirdPartyCitations: 5, positiveSentiment: 70 },
                    audienceEngagement: [
                        { name: "Job Seekers", value: 60, color: "#3B82F6" },
                        { name: "Students", value: 25, color: "#7CFC00" },
                        { name: "New Employees", value: 15, color: "#E57373" },
                    ],
                    primaryContentThemes: [
                        { name: "Regional Employment", value: 47.5, color: "#0ea5e9" },
                        { name: "Employee Recognition", value: 40.0, color: "#84cc16" },
                        { name: "Manufacturing Excellence", value: 37.5, color: "#f97316" },
                    ],
                    homepageVsFeed: [
                        { claim: "Career Guidance", value: 95, color: "#84cc16" },
                        { claim: "Comprehensive Info", value: 90, color: "#3b82f6" },
                        { claim: "A Look Inside", value: 80, color: "#ffffff" },
                        { claim: "Why Work Here", value: 100, color: "#f97316" },
                    ],
                    brandVoice: [
                        { name: "Guiding", value: 50, color: "#3b82f6" },
                        { name: "Informative", value: 35, color: "#84cc16" },
                        { name: "Welcoming", value: 15, color: "#f97316" },
                    ],
                    contentStrategyGap: [
                        { name: "Employer Branding", Emergent: 65, Mandated: 40 },
                        { name: "Innovation/Technology for Recruits", Emergent: 15, Mandated: 45 },
                        { name: "Sustainability for Recruits", Emergent: 10, Mandated: 25 },
                    ],
                    whiteSpaceOpportunities: [
                        { title: "Semiconductor Careers Share", value: 1 },
                        { title: "Virtual Plant Tours Share", value: 1 }
                    ],
                    strategySnapshot: [
                        { competitor: "Magna", strategy: "Educational Leader", dataPoint: "Focus on episodic educational content", color: "text-primary" },
                        { competitor: "Denso", strategy: "The Guide (Recruitment)", dataPoint: "Focus on employer branding videos", color: "text-white" },
                    ],
                    strategicInitiatives: [
                        { name: "Create 'Semiconductor Careers' Series", goal: "5% → 25% (120 days)", current: 5, target: 25 },
                        { name: "Launch Virtual Plant Tour Videos", goal: "10% → 30% (now 10%)", current: 10, target: 30 },
                    ],
                    competitorPositioning: [
                        { x: -2, y: 3, name: "Magna (Educational Leader)" },
                    ],
                    magnaPosition: { x: 3, y: -2, name: "Denso", strategy: "The Guide (Recruitment)" },
                },
                topDrivers: [
                    { driver: "Employer Branding Videos", lift: 450, example: "1,000+ views on 'Why DENSO'" },
                    { driver: "Regional Employment Opportunities", lift: 380, example: "High click-through to careers page" },
                    { driver: "Manufacturing Process Explained", lift: 250, example: "Positive comments from students" },
                ],
                mandatedDrivers: {
                    electrification: { posts: 1, percentage: 10.0 },
                    adas: { posts: 2, percentage: 20.0 },
                    lightweighting: { posts: 0, percentage: 0 },
                    environmental: { posts: 1, percentage: 10.0 },
                    sdvs: { posts: 2, percentage: 20.0 },
                },
                audienceSegments: [
                    { segment: "Job Seekers", share: 60, confidence: "H" },
                    { segment: "Students", share: 25, confidence: "M" },
                    { segment: "New Employees", share: 15, confidence: "M" },
                ],
            },
        },
        strategicRecommendations: {
            linkedin: [
                { recommendation: "Launch 'Semiconductor Strategy' Deep Dive Series", audience: "B2B Professionals & OEMs", driver: "Innovation Leadership", action: "Create a quarterly article series detailing the strategy behind partnerships like Quadric and ROHM.", expectedEffect: "Solidify thought leadership in the critical semiconductor space." },
                { recommendation: "Translate Manufacturing Excellence to Business Value", audience: "OEM Decision Makers", driver: "Manufacturing Excellence", action: "Produce content showing how 'workerless' factories lead to higher quality, lower costs, and supply chain resilience.", expectedEffect: "Connect operational strength to customer benefits." },
                { recommendation: "Amplify 'AI Security' Narrative", audience: "Tech Talent & Industry Analysts", driver: "ADAS/Semiconductors", action: "Develop content on the cybersecurity of AI NPUs to fill the 0.6% coverage whitespace and build trust.", expectedEffect: "Establish proactive leadership on a key emerging risk." },
                { recommendation: "Showcase Sustainability as an Innovation Driver", audience: "All Professionals", driver: "Sustainability Focus", action: "Create content that links sustainability goals (carbon neutrality) to product innovation (e.g., dual inverter efficiency).", expectedEffect: "Frame sustainability as a competitive advantage, not just a corporate responsibility." },
                { recommendation: "Activate Employee Advocacy for Recruitment", audience: "Engineers/Technical Specialists", driver: "Employee Recognition", action: "Launch a program encouraging engineers to share technical posts and innovation stories, amplifying reach to potential hires.", expectedEffect: "Boost qualified applications for technical roles." }
            ],
            twitter: [
                { recommendation: "Live-Tweet from Tech & Semiconductor Conferences", audience: "Industry Insiders & Journalists", driver: "Innovation Leadership", action: "Provide real-time updates and expert commentary from key industry events, even those not directly sponsored by DENSO.", expectedEffect: "Increase share of voice and be seen as a key industry commentator." },
                { recommendation: "Create 'Partnership in Action' Threads", audience: "Industry Insiders", driver: "Real-time Updates", action: "For major partnerships, create multi-tweet threads with quotes, graphics, and technical details to dominate the news cycle.", expectedEffect: "Maximize impact of positive news and become the primary source." },
                { recommendation: "Translate Global News to Local Impact", audience: "Regional Communities & Employees", driver: "Regional Employment", action: "When a major global partnership is announced, follow up with tweets explaining what it means for local plants and jobs.", expectedEffect: "Strengthen community relations and internal morale." },
                { recommendation: "Rapid Response on Supply Chain/Tariff News", audience: "Journalists & Analysts", driver: "News Communication", action: "Prepare statements on supply chain resilience to deploy quickly when industry-wide issues (tariffs, shortages) emerge.", expectedEffect: "Shape the narrative from a position of strength and preparedness." },
                { recommendation: "Run Weekly 'DENSO Did You Know?' Heritage Facts", audience: "All", driver: "Company Heritage", action: "Tweet one interesting fact or photo from DENSO's history each week to consistently engage followers with high-performing content.", expectedEffect: "Maintain high baseline engagement between major announcements." }
            ],
            instagram: [
                { recommendation: "Launch 'Made by DENSO' Reels Series", audience: "Young Professionals", driver: "Manufacturing Excellence", action: "Create high-quality, visually satisfying Reels showing the automated process of creating complex components like semiconductors.", expectedEffect: "Make manufacturing 'cool' and appealing to a younger talent pool." },
                { recommendation: "Introduce 'Innovator Spotlight' Stories", audience: "Engineering Students", driver: "Employee Recognition", action: "Weekly Instagram Stories featuring a DENSO engineer, their work, and their career path, with interactive Q&A stickers.", expectedEffect: "Humanize the brand and create a direct line to potential recruits." },
                { recommendation: "Visualize the 'Semiconductor Journey'", audience: "Tech Enthusiasts", driver: "Innovation Showcase", action: "Create a carousel post that visually explains the journey of a semiconductor from design to integration in a vehicle.", expectedEffect: "Demystify core technology and showcase expertise in an accessible format." },
                { recommendation: "Partner with 'Manufacturing' & 'Engineering' Influencers", audience: "Young Professionals", driver: "Manufacturing Excellence", action: "Collaborate with influencers for a behind-the-scenes look at a 'workerless' factory.", expectedEffect: "Gain third-party validation and reach a wider, engaged audience." },
                { recommendation: "Create 'Then vs. Now' Technology Posts", audience: "All", driver: "Company Heritage", action: "Use a split-screen format in Reels or carousels to show the evolution of a DENSO product over the decades.", expectedEffect: "Bridge high-performing heritage content with innovation." }
            ],
            tiktok: [
                { recommendation: "Scale 'Manufacturing ASMR' with Semiconductors", audience: "Gen Z", driver: "Manufacturing", action: "Create ASMR videos of the semiconductor manufacturing process (e.g., wafer handling by robots) to tap into a niche, viral trend.", expectedEffect: "Differentiate content and highlight core business strategy in a native format." },
                { recommendation: "Launch 'Could You Be a DENSO Engineer?' Challenge", audience: "Gen Z Students", driver: "Recruitment/Culture", action: "Create a series of short, simple engineering puzzles or logic tests using Duet/Stitch features.", expectedEffect: "Gamify recruitment and identify engaged, high-potential candidates." },
                { recommendation: "Simplify Electrification Concepts", audience: "All", driver: "Innovation", action: "Create a 30-second video explaining how the 'dual inverter' works using simple animation and trending audio.", expectedEffect: "Translate complex technical wins into easily digestible and shareable content." },
                { recommendation: "Partner with a STEM-focused Creator", audience: "Gen Z Students", driver: "Education", action: "Co-create a video with a popular science/engineering creator to explain the AI NPU partnership with Quadric.", expectedEffect: "Increase credibility and reach for complex technical topics." },
                { recommendation: "'What's That Sound?' Factory Edition", audience: "All", driver: "Manufacturing", action: "Post videos of interesting sounds from the factory floor and have users guess what machine is making it.", expectedEffect: "Create a simple, engaging content format that highlights the manufacturing environment." }
            ],
            facebook: [
                { recommendation: "Create 'Innovation Means Jobs' Campaign", audience: "Regional Communities", driver: "Regional Employment", action: "Run targeted ad campaigns in plant communities that directly link global innovation (e.g., new semiconductor partnerships) to local job security and growth.", expectedEffect: "Build strong local support and a positive employer brand." },
                { recommendation: "Launch Multi-Generational 'DENSO Families' Series", audience: "Employees & Families", driver: "Company Heritage", action: "Spotlight families who have had multiple generations work at DENSO, reinforcing the company's role as a stable, long-term employer.", expectedEffect: "Deepen emotional connection and community ties." },
                { recommendation: "Host Live 'Town Halls' with Plant Managers", audience: "Regional Communities", driver: "Community Building", action: "Quarterly Facebook Live Q&A sessions where local plant managers can answer community questions.", expectedEffect: "Increase transparency and build trust at the local level." },
                { recommendation: "Promote Employee-Led Volunteer Efforts", audience: "All", driver: "Employee Recognition", action: "Dedicate more content to showcasing employee volunteer teams and the impact they have, driven by employee-submitted photos.", expectedEffect: "Empower employees as brand ambassadors and showcase corporate values." },
                { recommendation: "Share 'Made Here' Product Spotlights", audience: "Regional Communities", driver: "Manufacturing Excellence", action: "Create posts that highlight a specific, world-class product and proudly state 'It's made right here in [City Name]'.", expectedEffect: "Instill a sense of local pride and connection to the company's global success." }
            ],
            youtube: [
                { recommendation: "Produce 'Your Future in Semiconductors' Career Series", audience: "Job Seekers & Students", driver: "Employer Branding", action: "Create a video series showcasing the diverse and exciting career paths in DENSO's growing semiconductor division.", expectedEffect: "Attract top talent to a key strategic area by closing the content gap." },
                { recommendation: "Launch 'Virtual Plant Tour' for Job Seekers", audience: "Job Seekers", driver: "Regional Employment", action: "Create high-quality, 360-degree video tours of key manufacturing facilities to give potential applicants an inside look.", expectedEffect: "Improve candidate experience and increase application conversion rates." },
                { recommendation: "Create 'DENSO Tech Explained' for New Hires", audience: "New Employees", driver: "Comprehensive Info", action: "Develop a playlist of short, animated videos explaining DENSO's core technologies, to be used as part of the onboarding process.", expectedEffect: "Improve new hire engagement and technical understanding." },
                { recommendation: "Interview 'Day in the Life of an AI Engineer'", audience: "Job Seekers & Students", driver: "Employer Branding", action: "A documentary-style video following an engineer working on the Quadric AI NPU partnership.", expectedEffect: "Make high-tech roles tangible and exciting for potential recruits." },
                { recommendation: "Repurpose Top LinkedIn Content into Video", audience: "B2B Professionals", driver: "Innovation Leadership", action: "Take the most successful LinkedIn articles on innovation and turn them into short, presenter-led YouTube videos to reach a different audience.", expectedEffect: "Maximize the value of high-performing content across platforms." }
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
            brand: "Denso",
            period: "2024–06–01 to 2025–08–01",
            articles: 1847,
            positivePercentage: 54,
            challengingPercentage: 13,
            topPillar: "Semiconductor Platform Strategy",
            dominantRegion: "NA 45%",
            riskCount: 5,
            latestVelocity: "-39 (Aug '25)",
            positioning: "Hardware mfg → semiconductor platform orchestrator"
        },
        v1: {
            executiveSummary: {
                articles: 1847,
                period: "June 1, 2024 – August 1, 2025",
                regionalSplit: { NA: 45, EU: 21, AS: 34 },
                sentiment: { positive: 54, neutral: 33, challenging: 13 },
                topPillars: [
                    { name: "Semiconductor Platform Strategy", percentage: 32 },
                    { name: "Strategic Partnership Ecosystem", percentage: 26 },
                    { name: "Electrification Technology Leadership", percentage: 21 }
                ],
                narrative: "A tier-one automotive supplier pivoting from traditional hardware manufacturing to become a semiconductor-enabled mobility platform orchestrator through strategic AI and electrification partnerships."
            },
            auditFoundation: [
                { sourceType: "Tier-1 Financial", count: 201, percentage: 10.9, topPublications: ["Reuters", "Bloomberg", "Financial Times", "Nikkei Asia", "Wall Street Journal"] },
                { sourceType: "Trade/Industry", count: 612, percentage: 33.2, topPublications: ["Automotive News", "Just Auto", "WardsAuto", "Automotive World", "EE Times"] },
                { sourceType: "Tech/Innovation", count: 387, percentage: 21.0, topPublications: ["IEEE Spectrum", "TechCrunch", "The Verge", "Evertiq", "Market Research Future"] },
                { sourceType: "ESG/Policy", count: 89, percentage: 4.8, topPublications: ["NHTSA", "EU regulatory sites", "FT Moral Money"] },
                { sourceType: "Regional/Business", count: 421, percentage: 22.8, topPublications: ["Detroit Free Press", "Japan Times", "Business Standard"] },
                { sourceType: "Non-independent", count: 137, percentage: 7.4, topPublications: ["PR Newswire", "Business Wire", "DENSO newsroom"] }
            ],
            shareOfVoice: [
                { topic: "Semiconductor Partnerships", share: 31, sources: "Evertiq, Market Research Future, EE Times", tone: "Very Positive" },
                { topic: "Electrification/SiC Technology", share: 26, sources: "Automotive News, IEEE Spectrum", tone: "Positive" },
                { topic: "Manufacturing Innovation", share: 18, sources: "Automotive Manufacturing Solutions", tone: "Positive" },
                { topic: "Financial Performance/Tariffs", share: 12, sources: "Bloomberg, Reuters, Automotive News", tone: "Neutral" },
                { topic: "Strategic Alliances", share: 8, sources: "S&P Global, Just Auto", tone: "Positive" },
                { topic: "Regulatory/Quality", share: 5, sources: "NHTSA, trade press", tone: "Challenging" }
            ],
            productCoverage: {
                brandNative: [
                    { category: "Automotive Electronics", share: 38, tone: "Very Positive", signal: "AI NPU partnerships accelerating; ROHM analog IC collaboration expanding lineup" },
                    { category: "ADAS (incl. J-QuAD DYNAMICS)", share: 19, tone: "Positive", signal: "Quadric partnership positions DENSO for edge AI processing leadership" },
                    { category: "Electrification Systems", share: 24, tone: "Positive", signal: "Dual inverter architecture breakthrough; Fukushima plant expansion" },
                    { category: "Powertrain Systems", share: 11, tone: "Neutral", signal: "Gradual transition to electrified powertrains" },
                    { category: "Thermal Systems", share: 8, tone: "Positive", signal: "Advanced climate control with AI-driven zone optimization" }
                ],
                universal: [
                    { category: "Complete Vehicles", share: 0, tone: "N/A", signal: "Correctly excluded; no contract manufacturing" },
                    { category: "Body & Chassis", share: 6, tone: "Neutral", signal: "Limited coverage; safety actuators mentioned" },
                    { category: "Electrical/Electronics", share: 71, tone: "Very Positive", signal: "Dominant narrative; AI semiconductors, NPUs, analog ICs driving growth" },
                    { category: "Exterior/Interior", share: 5, tone: "Positive", signal: "Climate control innovation gaining traction" },
                    { category: "Powertrain", share: 18, tone: "Positive", signal: "Electrification transition accelerating with dual inverter tech" }
                ]
            },
            sentiment: {
                overall: {
                    raw: [
                        { sentiment: "Positive", count: 997, percentage: 54.0 },
                        { sentiment: "Neutral", count: 610, percentage: 33.0 },
                        { sentiment: "Challenging", count: 240, percentage: 13.0 }
                    ],
                    weighted: [
                        { sentiment: "Positive", count: 998, percentage: 54.0 },
                        { sentiment: "Neutral", count: 610, percentage: 33.0 },
                        { sentiment: "Challenging", count: 239, percentage: 13.0 }
                    ]
                },
                byRegion: [
                    { region: "NA", positive: 51, neutral: 35, challenging: 14 },
                    { region: "EU", positive: 55, neutral: 33, challenging: 12 },
                    { region: "AS", positive: 57, neutral: 31, challenging: 12 }
                ],
                byOutlet: [
                    { outlet: "Tier-1 Financial", positive: 48, neutral: 39, challenging: 13 },
                    { outlet: "Trade/Industry", positive: 56, neutral: 32, challenging: 12 },
                    { outlet: "Tech/Innovation", positive: 67, neutral: 25, challenging: 8 },
                    { outlet: "Regional/Business", positive: 43, neutral: 36, challenging: 21 },
                    { outlet: "ESG/Policy", positive: 45, neutral: 37, challenging: 18 }
                ],
                quotes: [
                    { type: "Positive", quote: "DENSO's partnership strategy with Quadric and ROHM positions it as a semiconductor powerhouse capable of meeting the rising computational needs of modern automobiles", author: "Market Research Future", source: "Market Research Future", date: "July 2025" },
                    { type: "Challenging", quote: "Rather than panicking and making a fuss, we want to proceed with sound price transfers where possible", author: "DENSO Executive", source: "Automotive News", date: "January 2025" }
                ]
            },
            brandPillars: [
                { pillar: "Semiconductor Platform Strategy", share: 32, tone: "Very Positive", phrases: "AI NPU, edge computing, analog ICs, RISC-V integration", quote: "This collaboration marks a pivotal shift in DENSO's direction towards developing automotive semiconductor technology" },
                { pillar: "Strategic Partnership Ecosystem", share: 26, tone: "Positive", phrases: "co-creation, collaborative innovation, strengthened relationships", quote: "DENSO positions semiconductors as key devices to realize next-generation vehicle systems" },
                { pillar: "Electrification Innovation", share: 21, tone: "Positive", phrases: "dual inverter, SiC technology, efficiency gains, thermal management", quote: "The dual inverter reduces copper usage and simplifies busbar design, resulting in a 12% overall efficiency gain" },
                { pillar: "Manufacturing Excellence", share: 13, tone: "Positive", phrases: "workerless factories, 24-hour unmanned, automation, sustainable energy", quote: "Be capable of 24-hour unmanned operation" },
                { pillar: "Climate Technology", share: 8, tone: "Positive", phrases: "AI-driven controls, energy optimization, modular systems", quote: "Reduce HVAC system energy consumption by up to 30%" }
            ],
            businessDrivers: [
                { driver: "Electrification", hits: 478, toneBias: "Positive", relevance: "Core growth driver; dual inverter breakthrough differentiator" },
                { driver: "ADAS/Autonomy", hits: 354, toneBias: "Positive", relevance: "Quadric NPU partnership positions for AI leadership" },
                { driver: "Software-Defined Vehicles", hits: 312, toneBias: "Positive", relevance: "ROHM analog IC partnership enables SDV transition" },
                { driver: "Environmental Leadership", hits: 127, toneBias: "Positive", relevance: "Carbon neutral commitment with sustainable manufacturing" },
                { driver: "Lightweighting", hits: 52, toneBias: "Positive", relevance: "Limited coverage; opportunity for enhanced messaging" }
            ],
            whiteSpace: [
                { topic: "ADAS Cybersecurity", coverage: "0.6%", importance: "Critical for AI NPU trust; regulatory focus increasing", action: "Develop security-by-design messaging around Quadric partnership" },
                { topic: "Data Monetization", coverage: "0.8%", importance: "SDV platforms create revenue opportunities beyond hardware", action: "Showcase analytics capabilities from sensor data" },
                { topic: "Circular Economy", coverage: "0.4%", importance: "ESG investors seeking concrete recycling initiatives", action: "Highlight semiconductor recycling programs" },
                { topic: "Hydrogen Infrastructure", coverage: "1.1%", importance: "SOEC technology ready but ecosystem coverage minimal", action: "Amplify JERA partnership for H2 value chain visibility" }
            ],
            narrativeVelocity: [
                { month: "2024-06", positive: 72, challenging: 18, netDelta: 0 },
                { month: "2024-07", positive: 89, challenging: 21, netDelta: 18 },
                { month: "2024-08", positive: 76, challenging: 16, netDelta: -18 },
                { month: "2024-09", positive: 94, challenging: 25, netDelta: 21 },
                { month: "2024-10", positive: 108, challenging: 22, netDelta: 11 },
                { month: "2024-11", positive: 87, challenging: 19, netDelta: -24 },
                { month: "2024-12", positive: 112, challenging: 14, netDelta: 22 },
                { month: "2025-01", positive: 134, challenging: 17, netDelta: 25 },
                { month: "2025-02", positive: 98, challenging: 13, netDelta: -23 },
                { month: "2025-03", positive: 105, challenging: 15, netDelta: 9 },
                { month: "2025-04", positive: 118, challenging: 18, netDelta: 16 },
                { month: "2025-05", positive: 127, challenging: 19, netDelta: 8 },
                { month: "2025-06", positive: 142, challenging: 16, netDelta: 16 },
                { month: "2025-07", positive: 138, challenging: 14, netDelta: -6 },
                { month: "2025-08", positive: 103, challenging: 12, netDelta: -39 }
            ],
            industryEvents: [
                { date: "2024-07", event: "Quadric AI partnership announcement", driver: "ADAS/Autonomy", coverage: 1200, densoArticles: 34, toneShift: 18, sources: "Market Research Future, TechCrunch" },
                { date: "2024-09", event: "UAW Stellantis strike threat", driver: "Supply chain", coverage: 2800, densoArticles: 42, toneShift: -8, sources: "Reuters, Automotive News" },
                { date: "2024-10", event: "Fukushima inverter plant launch", driver: "Electrification", coverage: 800, densoArticles: 28, toneShift: 12, sources: "Automotive Manufacturing Solutions" },
                { date: "2024-12", event: "Honda-Nissan merger talks", driver: "Industry consolidation", coverage: 4200, densoArticles: 31, toneShift: 5, sources: "Nikkei, Reuters" },
                { date: "2025-01", event: "Trump tariff implementation", driver: "Trade policy", coverage: 4500, densoArticles: 67, toneShift: -15, sources: "Automotive News, Bloomberg" },
                { date: "2025-03", event: "Tesla FSD China approval", driver: "ADAS/Autonomy", coverage: 2900, densoArticles: 29, toneShift: 8, sources: "TechCrunch, Reuters" },
                { date: "2025-05", event: "ROHM partnership agreement", driver: "Semiconductors", coverage: 600, densoArticles: 18, toneShift: 14, sources: "Evertiq, EE Times" },
                { date: "2025-06", event: "Toyota solid-state battery", driver: "Electrification", coverage: 3800, densoArticles: 52, toneShift: 11, sources: "Bloomberg, Nikkei" },
                { date: "2025-07", event: "CES climate control showcase", driver: "Tech Innovation", coverage: 1400, densoArticles: 22, toneShift: 7, sources: "SAE, IEEE Spectrum" },
                { date: "2025-08", event: "Semiconductor shortage 2.0", driver: "Supply chain", coverage: 2400, densoArticles: 31, toneShift: -9, sources: "Bloomberg, Reuters" }
            ],
            strategic: {
                risks: [
                    "Heavy semiconductor partnership dependence creates potential integration complexity and IP sharing challenges",
                    "Trump tariff exposure through North American supply chain despite CFO confidence in price negotiations",
                    "Limited AI talent acquisition narrative compared to software-first competitors despite Quadric partnership",
                    "Regulatory uncertainty around AI NPU safety standards for automotive applications",
                    "Traditional OEM customer concentration risk during industry consolidation wave"
                ],
                opportunities: [
                    "Quadric NPU partnership positions DENSO as early leader in automotive edge AI processing before competitors scale",
                    "ROHM analog IC collaboration creates comprehensive semiconductor portfolio for SDV transition",
                    "Dual inverter technology breakthrough provides competitive moat in electrification efficiency",
                    "Workerless factory capabilities demonstrate manufacturing cost leadership for premium components",
                    "Climate control AI optimization addresses growing EV range anxiety through energy management"
                ],
                blindSpots: [
                    "Data monetization strategy completely absent despite NPU and sensor capabilities creating valuable datasets",
                    "Minimal coverage of non-automotive applications for semiconductor technology despite industrial potential",
                    "Limited visibility on cybersecurity approach for AI-enabled systems versus increasing regulatory scrutiny",
                    "Circular economy initiatives underreported despite semiconductor material scarcity concerns",
                    "Software talent acquisition and retention strategy unclear compared to traditional hardware focus"
                ]
            },
            recommendations: [
                { id: 1, action: "Launch AI Security Leadership Program", detail: "Develop comprehensive cybersecurity framework for Quadric NPU deployment, addressing the 0.6% coverage gap in ADAS cybersecurity while regulatory scrutiny increases." },
                { id: 2, action: "Articulate Data Monetization Strategy", detail: "Create use cases demonstrating revenue potential from NPU-processed vehicle data analytics, addressing complete blind spot in platform value creation beyond hardware." },
                { id: 3, action: "Expand Semiconductor Non-Automotive Narrative", detail: "Leverage ROHM partnership to showcase industrial and energy applications, diversifying beyond automotive dependency narrative." },
                { id: 4, action: "Amplify Manufacturing Cost Leadership", detail: "Highlight workerless factory economics and 24-hour unmanned operation as competitive moat during tariff uncertainty, supporting 13% manufacturing excellence pillar." },
                { id: 5, action: "Build Circular Semiconductor Story", detail: "Launch recycling program for automotive semiconductors addressing material scarcity, closing 0.4% coverage gap while supporting ESG narrative." }
            ],
            brandPositioning: {
                ascribedPositioning: 'A semiconductor-enabled mobility platform orchestrator, leading the industry transition through a powerful partnership ecosystem.',
                thirdPartyBrandPromise: 'Delivering the core semiconductor technology and electrification systems that power the next generation of intelligent vehicles.',
                narrativeFrames: [
                    'Semiconductor Powerhouse',
                    'Ecosystem Builder',
                    'Electrification Innovator',
                    'Manufacturing Futurist'
                ]
            },
            conclusion: 'DENSO\'s 2024-2025 earned media footprint shows a highly successful pivot from a traditional parts manufacturer to a key player in the future of mobility. The narrative is overwhelmingly positive, dominated by its aggressive and well-communicated semiconductor strategy. Partnerships with Quadric and ROHM have effectively positioned DENSO as an essential enabler of AI-driven and software-defined vehicles. This strong technology narrative is supported by tangible breakthroughs in electrification and advanced manufacturing. The primary risks and blind spots are not in the current strategy but in adjacent, future-facing areas: a lack of a clear data monetization story and an under-communicated cybersecurity posture. Overall, DENSO is successfully shaping a perception of itself as a forward-thinking technology leader.',
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
                    { name: 'Trade/Industry', value: 33.2, color: '#8FFF00' },
                    { name: 'Regional/Business', value: 22.8, color: '#3175D4' },
                    { name: 'Tech/Innovation', value: 21.0, color: '#8b5cf6' },
                    { name: 'Tier-1 Financial', value: 10.9, color: '#DA6E44' },
                    { name: 'Non-independent', value: 7.4, color: '#FAFAFA' },
                    { name: 'ESG/Policy', value: 4.8, color: '#CCCCCC' }
                ],
                topPublications: { list: ["Automotive News", "Just Auto", "WardsAuto"], percentage: 33.2 }
            },
            topicsTreeMap: {
                legend: { Positive: '#8FFF00', Challenging: '#DA6E44', Neutral: '#3175D4' },
                data: [
                    { name: 'Semiconductor Partnerships', size: 31, sentiment: 'Positive' },
                    { name: 'Electrification/SiC Technology', size: 26, sentiment: 'Positive' },
                    { name: "Manufacturing Innovation", size: 18, sentiment: 'Positive' },
                    { name: "Financial Performance/Tariffs", size: 12, sentiment: 'Neutral' },
                    { name: "Strategic Alliances", size: 8, sentiment: 'Positive' },
                    { name: "Regulatory/Quality", size: 5, sentiment: 'Challenging', keySources: ["NHTSA", "trade press"] }
                ]
            },
            brandNativeCoverage: {
                data: [
                    { name: 'Automotive Electronics', value: 38, color: '#8FFF00' },
                    { name: 'Electrification Systems', value: 24, color: '#8FFF00' },
                    { name: 'ADAS', value: 19, color: '#3175D4' },
                    { name: 'Powertrain Systems', value: 11, color: '#CCCCCC' },
                    { name: 'Thermal Systems', value: 8, color: '#DA6E44' }
                ],
                strategicSignal: { text: "AI NPU partnerships accelerating; ROHM analog IC collaboration expanding lineup.", percentage: 38 }
            },
            mandatedBusinessDrivers: {
                legend: { positive: '#8FFF00', neutral: '#3175D4', challenging: '#DA6E44' },
                data: [
                    { name: 'Electrification', total: 31.9, positive: 95, neutral: 5, challenging: 0 },
                    { name: 'ADAS/Autonomy', total: 23.6, positive: 98, neutral: 2, challenging: 0 },
                    { name: 'Software-Defined Vehicles', total: 20.8, positive: 95, neutral: 5, challenging: 0 },
                    { name: 'Environmental Leadership', total: 8.5, positive: 90, neutral: 10, challenging: 0 },
                    { name: 'Lightweighting', total: 3.5, positive: 70, neutral: 30, challenging: 0 },
                ]
            },
            strengths: [
                { title: 'Semiconductor-First Strategy', description: "A clear, decisive, and well-executed pivot to a semiconductor-centric model is driving an overwhelmingly positive narrative." },
                { title: 'Ecosystem as a Moat', description: "Strategic partnerships (Quadric, ROHM) are not just technology enablers but are framed as a competitive advantage." },
                { title: 'Tangible Innovation', description: "Breakthroughs like the dual inverter and 'workerless' factories provide concrete proof points for the forward-looking narrative." }
            ],
            risks: [
                { title: 'Partnership Dependency', description: "Heavy reliance on external partners for core AI and semiconductor technology creates potential integration and IP risks.", color: "text-orange-400" },
                { title: 'Narrative Blind Spots', description: "A lack of proactive communication on crucial topics like data monetization and AI cybersecurity presents a future vulnerability.", color: "text-blue-400" }
            ],
            timeline: {
                events: [
                    { date: "July 2024", label: "Quadric AI Partnership", type: "Positive", position: 8, side: 'top' },
                    { date: "September 2024", label: "UAW Strike Threat", type: "Crisis", position: 20, side: 'bottom' },
                    { date: "October 2024", label: "Fukushima Plant Launch", type: "Positive", position: 28, side: 'top' },
                    { date: "January 2025", label: "Tariff Implementation", type: "Crisis", position: 45, side: 'bottom' },
                    { date: "March 2025", label: "Tesla FSD China Approval", type: "Positive", position: 58, side: 'top' },
                    { date: "May 2025", label: "ROHM Partnership", type: "Positive", position: 70, side: 'bottom' },
                    { date: "June 2025", label: "Toyota Solid-State Battery", type: "Positive", position: 80, side: 'top' },
                    { date: "August 2025", label: "Semiconductor Shortage 2.0", type: "Crisis", position: 95, side: 'bottom' },
                ],
                context: { text: "Industry Context: Intense focus on semiconductor supply chains and OEM consolidation.\nStrategic Impact: Partnership news provides strong positive momentum against market volatility.", position: 52 },
                legend: { Positive: '#8FFF00', Mixed: '#FFD700', Crisis: '#DA6E44', Dual: '#8b5cf6', Others: '#CCCCCC' }
            },
            keyInsights: [
                { title: 'Mastery of the Pivot Narrative', color: '', description: "DENSO has successfully executed one of the industry's clearest narrative pivots, moving from 'hardware supplier' to 'semiconductor platform orchestrator'." },
                { title: 'Partnerships as Proof', color: 'text-blue-400', description: "The media strategy effectively uses high-profile partnerships as the primary evidence for its technological leadership, generating high-quality, positive coverage in tech and industry press." },
                { title: 'Success Breeds New Risks', color: 'text-orange-400', description: "The strategy's success creates new narrative challenges, namely the need to articulate a vision for data monetization and AI security that matches the sophistication of its hardware strategy." },
            ],
            opportunities: [
                { text: "Launch an AI Security Leadership Program to address the ADAS cybersecurity gap", color: '#8FFF00' },
                { text: "Articulate a clear Data Monetization Strategy for NPU-enabled platforms", color: '#DA6E44' },
                { text: "Build a Circular Semiconductor Story to enhance the ESG narrative", color: '#3175D4' }
            ]
        }
    }
}