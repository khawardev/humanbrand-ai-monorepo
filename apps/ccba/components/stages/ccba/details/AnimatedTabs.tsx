'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { useAnimatedTabs } from '@/hooks/useAnimatedTabs';
import { CcbaStatusResponse } from '@/types/status';
import { TaskStatus } from './TaskStatus';

const transition: any = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.22
};

const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
    x: hoveredRect.left - navRect.left,
    y: hoveredRect.top - navRect.top,
    width: hoveredRect.width,
    height: hoveredRect.height
});

const TabContent = ({ content }: { content: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="py-7"
        >
            {content}
        </motion.div>
    );
};

const Tabs = ({
    tabs,
    selectedTabIndex,
    setSelectedTab
}: {
    tabs: {
        label: string;
        value: string;
        disabled?: boolean;
        tooltip?: string;
        disabledTooltip?: string;
    }[];
    selectedTabIndex: number;
    setSelectedTab: (input: [number, number]) => void;
}) => {
    const [buttonRefs, setButtonRefs] = React.useState<Array<HTMLButtonElement | null>>([]);

    React.useEffect(() => {
        setButtonRefs((prev) => prev.slice(0, tabs.length));
    }, [tabs.length]);

    const navRef = React.useRef<HTMLDivElement>(null);
    const navRect = navRef.current?.getBoundingClientRect();

    const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();
    const isSelectedTabDisabled = tabs[selectedTabIndex]?.disabled;

    const [hoveredTabIndex, setHoveredTabIndex] = React.useState<number | null>(null);
    const hoveredRect = buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

    return (
        <nav
            ref={navRef}
            className="relative z-0 flex gap-1 items-center justify-center py-2"
            onPointerLeave={() => setHoveredTabIndex(null)}
        >
            {tabs.map((item, i) => {
                const isActive = selectedTabIndex === i;
                const isDisabled = !!item.disabled;

                const buttonProps: any = {
                    ref: (el: HTMLButtonElement | null) => {
                        buttonRefs[i] = el;
                    },
                    variant: 'ghost',
                    className: cn(
                        'z-20',
                        isActive && !isDisabled ? 'font-medium' : 'text-muted-foreground',
                        isDisabled && 'cursor-not-allowed opacity-50'
                    ),
                    onPointerEnter: () => !isDisabled && setHoveredTabIndex(i),
                    onFocus: () => !isDisabled && setHoveredTabIndex(i),
                    onClick: (e: React.MouseEvent) => {
                        if (isDisabled) {
                            e.preventDefault();
                            return;
                        }
                        setSelectedTab([i, i > selectedTabIndex ? 1 : -1]);
                    },
                    onMouseDown: (e: React.MouseEvent) => {
                        if (isDisabled) {
                            e.preventDefault();
                        }
                    },
                    'aria-disabled': isDisabled
                };

                const buttonElement = <Button {...buttonProps}>{item.label}</Button>;
                const tooltipContent = isDisabled ? item.disabledTooltip : item.tooltip;

                if (tooltipContent) {
                    return (
                        <TooltipProvider key={item.value}>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
                                <TooltipContent >
                                    <p>{tooltipContent}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                }

                return React.cloneElement(buttonElement, { key: item.value });
            })}

            <AnimatePresence>
                {hoveredRect && navRect && (
                    <motion.div
                        key="hover"
                        className="absolute left-0 top-0 z-10"
                        initial={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
                        animate={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 1 }}
                        exit={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
                        transition={transition}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedRect && navRect && !isSelectedTabDisabled && (
                    <motion.div
                        className="absolute -bottom-0.5 left-0 z-30 h-[2px]  bg-primary"
                        initial={false}
                        animate={{
                            width: selectedRect.width,
                            x: `calc(${selectedRect.left - navRect.left}px)`,
                            opacity: 1
                        }}
                        transition={transition}
                    />
                )}
            </AnimatePresence>
        </nav>
    );
};

export function AnimatedTabs({
    tabs,
    status
}: {
    tabs: {
        label: string;
        value: string;
        content: React.ReactNode;
        disabled?: boolean;
        tooltip?: string;
        disabledTooltip?: string;
    }[];
    status: CcbaStatusResponse | null;
}) {
    const [hookProps] = React.useState({
        tabs: tabs,
        initialTabId: tabs.find((tab) => !tab.disabled)?.value || tabs[0]?.value || ''
    });

    const framer = useAnimatedTabs(hookProps);
    const selectedTabData = tabs.find((tab) => tab.value === framer.selectedTab?.value);

    return (
        <div className="w-full">
            <div className="relative flex w-full items-center  justify-between  border-b-2 dark:border-border border-border/40">
                <Tabs {...framer.tabProps} />
                
                
                <TaskStatus initialStatusData={status} />

            </div>
            <AnimatePresence mode="wait">
                {selectedTabData && (
                    <TabContent content={selectedTabData.content} key={selectedTabData.value} />
                )}
            </AnimatePresence>
        </div>
    );
}