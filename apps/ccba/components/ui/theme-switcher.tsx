"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { useTheme } from "next-themes";
import { Icons } from "../shared/Icons";

const ThemeSwitcher = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>((props, ref) => {
    const { className, ...rest } = props;
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <button
            ref={ref}
            {...rest}
            className={cn(
                "  hover:bg-border hover:cursor-pointer text-muted-foreground  hover:text-accent-foreground relative flex size-[33px] items-center justify-center rounded-md p-[9px] transition-colors ",
                className,
            )}
            onClick={toggleTheme}
        >
            <Icons.toggletheme />
        </button>
    );
});

ThemeSwitcher.displayName = "ThemeSwitcher";

export { ThemeSwitcher };