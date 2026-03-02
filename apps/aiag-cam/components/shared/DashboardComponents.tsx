"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Blur, BlurDelay } from "./MagicBlur";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function DashboardInnerLayout({ children, className }: any) {
  return (
    <Blur
      className={cn(
        "relative flex w-full flex-col space-y-10 px-4 py-10 md:px-24",
        className,
      )}
    >
      {children}
    </Blur>
  );
}

export function DashboardLayoutHeading({
  title,
  subtitle,
  children,
  icon,
}: any) {
  return (
    <>
      <DashboardInnerLayout>
        <div className="flex flex-col md:flex-row md:items-center gap-6 pb-2">
          <div className="bg-linear-to-br corner-squircle supports-corner-shape:rounded-[50%] from-primary/15 to-primary/5 border border-primary/10 p-4 md:p-5 rounded-2xl w-fit dark:shadow-sm backdrop-blur-sm transition-all duration-300 ">
            <span className="text-primary  text-2xl md:text-3xl flex items-center justify-center">
              {icon}
            </span>
          </div>
          <div className="space-y-1.5 flex-1">
            <h1 className="font-bold text-3xl md:text-4xl tracking-tighter text-foreground/90">
              {title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-4xl">
              {subtitle}
            </p>
          </div>
        </div>
        {children}
      </DashboardInnerLayout>
      <Separator />
    </>
  );
}

export const DashboardHeader = ({ title, subtitle }: any) => {
  return (
    <div className="max-w-xl">
      <h1 className="mb-2 font-normal text-2xl tracking-tight">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export function DashboardHeaderBlock({
  title,
  subtitle,
  buttonLabel,
  buttonHref,
}: any) {
  return (
    <BlurDelay className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {buttonLabel && (
        <Button asChild>
          <Link href={buttonHref}>
            <Plus />
            {buttonLabel}
          </Link>
        </Button>
      )}
    </BlurDelay>
  );
}
