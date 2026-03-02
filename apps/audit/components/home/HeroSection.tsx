'use client';

import React, { useRef, useState } from 'react';
import UrlSubmissionForm from './UrlSubmissionForm';
import AuthModal from '../auth/AuthModal';
import { useRouter } from 'next/navigation';
import { createMiniAudit } from '@/db/actions/miniAuditActions';
import { toast } from 'sonner';
import WorldMap from '../ui/world-map';
import AuditProgress from '../layout/AuditProgress';

export default function HeroSection({ user }: { user: any }) {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [submittedUrl, setSubmittedUrl] = useState('');
    const [activeCompetitors, setActiveCompetitors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [progress, setProgress] = useState(0);
    const [progressTitle, setProgressTitle] = useState('');
    const router = useRouter();


    const stopProgress = () => {
        if (progressIntervalRef.current) {
            clearTimeout(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const runProgressSimulation = (competitorsCount: number) => {
        const stages: { title: string; progress: number; duration: number }[] = [
            { title: 'Initializing Audit...', progress: 5, duration: 5000 },
            { title: 'Capturing Brand Data...', progress: 15, duration: 15000 },
        ];

        if (competitorsCount > 0) {
            stages.push({
                title: `Capturing Data for ${competitorsCount} Competitor${competitorsCount > 1 ? 's' : ''}...`,
                progress: 40,
                duration: 15000 * competitorsCount
            });
        }

        stages.push(
            { title: 'Analyzing Brand Strategy...', progress: 70, duration: 15000 },
            { title: 'Generating Audit Report...', progress: 85, duration: 10000 }
        );

        if (competitorsCount > 0) {
            stages.push({ title: 'Performing Competitive Analysis...', progress: 92, duration: 10000 });
        }

        stages.push({ title: 'Finalizing Reports...', progress: 98, duration: 5000 });

        let stageIndex = 0;

        const nextStage = () => {
            if (stageIndex >= stages.length) {
                stopProgress();
                return;
            }

            const stage = stages[stageIndex];
            if (stage) {
                setProgress(stage.progress);
                setProgressTitle(stage.title);
                stageIndex++;
                progressIntervalRef.current = setTimeout(nextStage, stage.duration);
            }
        };

        nextStage();
    };

    const handleUrlSubmit = async (url: string, competitors: string[]) => {
        if (!user) {
            setSubmittedUrl(url);
            setActiveCompetitors(competitors);
            setAuthModalOpen(true);
            setIsLoading(false);
        } else {
            startAudit(url, competitors);
        }
    };

    const startAudit: any = async (url: string, competitors: string[]) => {
        runProgressSimulation(competitors.length);
        try {
            toast.info('Starting your Outside-In Mini Audit, this will take a moment...');
            const result = await createMiniAudit(url, competitors);
            stopProgress();

            if (result.error) {
                toast.error(result.error);
            } else if (result.auditId) {
                setProgress(100);
                setProgressTitle('Analysis Finished!');
                toast.success('Analysis finished! Redirecting to results...');
                router.push(`/audit/${result.auditId}`);
            }
        } catch (error) {
            stopProgress();
            console.error(error);
            toast.error('Something went wrong while starting audit.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthSuccess = () => {
        setAuthModalOpen(false);

        if (submittedUrl) {
            setIsLoading(true);
            startAudit(submittedUrl, activeCompetitors);
        }
    };



    return (
        <main className=' flex flex-col justify-between space-y-4'>
            <div className="relative">
                <div className="absolute inset-x-0 w-full md:scale-110 md:-top-30 top-20 overflow-hidden z-0 opacity-30 dark:opacity-60 pointer-events-none">
                    <WorldMap
                        dots={[
                            { start: { lat: 64.2, lng: -149.4 }, end: { lat: 34.0, lng: -118.2 } },
                            { start: { lat: 51.5, lng: -0.1 }, end: { lat: -15.7, lng: -47.8 } },
                            { start: { lat: -15.7, lng: -47.8 }, end: { lat: 38.7, lng: -9.1 } },
                            { start: { lat: 51.5, lng: -0.1 }, end: { lat: 28.6, lng: 77.2 } },
                            { start: { lat: 28.6, lng: 77.2 }, end: { lat: 43.1, lng: 131.9 } },
                            { start: { lat: 28.6, lng: 77.2 }, end: { lat: -1.2, lng: 36.8 } }
                        ]}
                    />
                </div>
                <div className="absolute md:-bottom-50 -bottom-40 w-full z-50">
                    {isLoading && <AuditProgress progress={progress} progressTitle={progressTitle} />}
                </div>
                <div className="relative z-10">
                    <UrlSubmissionForm setIsLoading={setIsLoading} isLoading={isLoading} onSubmit={handleUrlSubmit} />
                </div>
            </div>
            <AuthModal
                isOpen={isAuthModalOpen}
                onOpenChange={setAuthModalOpen}
                onAuthSuccess={handleAuthSuccess}
            />
        </main>
    );
}
