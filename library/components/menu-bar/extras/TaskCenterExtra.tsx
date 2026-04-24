"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { Layers } from "lucide-react";
import { cn } from "@/library/lib/utils";
import { useTaskCenter } from "@/library/providers/TaskCenterProvider";
import { Button } from "@/library/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/library/ui/popover";
import { TaskCenterDropdown } from "@/library/components/task-center/TaskCenterDropdown";
import {
    MenuBarExtraItemProps,
    MENU_BAR_EXTRA_BUTTON_STYLES,
    MENU_BAR_EXTRA_POPOVER_STYLES,
    useMenuBarExtraStyles,
} from "./types";

/**
 * TaskCenterExtra - Menu bar extra item for task center
 * 
 * Shows a layers icon that opens the task center dropdown on hover.
 * Shows a badge indicator when there are pending tasks.
 * 
 * Visibility should be controlled externally by the parent component.
 */
export function TaskCenterExtra({ className }: MenuBarExtraItemProps) {
    const { tasks, isOpen, setOpen } = useTaskCenter();
    const { buttonColorClass } = useMenuBarExtraStyles();
    const pendingCount = tasks.filter((t) => t.status === "pending").length;

    // We implement hover behavior manually to sync with global state from useTaskCenter
    // This allows the task center to be opened programmatically (e.g. after task creation)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const closeDelay = 150;

    const handleMouseEnter = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setOpen(true);
    }, [setOpen]);

    const handleMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, closeDelay);
    }, [setOpen, closeDelay]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleClick = useCallback((e: React.SyntheticEvent) => {
        if (isOpen) {
            e.preventDefault();
        }
    }, [isOpen]);

    const triggerProps = {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: handleClick,
        onPointerDown: handleClick,
    };

    const contentProps = {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };

    return (
        <Popover open={isOpen} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        MENU_BAR_EXTRA_BUTTON_STYLES.base,
                        "relative",
                        isOpen
                            ? MENU_BAR_EXTRA_BUTTON_STYLES.active
                            : buttonColorClass,
                        className
                    )}
                    title="Task Center"
                    {...triggerProps}
                >
                    <Layers className={MENU_BAR_EXTRA_BUTTON_STYLES.icon} />
                    {pendingCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={MENU_BAR_EXTRA_POPOVER_STYLES.content}
                align={MENU_BAR_EXTRA_POPOVER_STYLES.align}
                sideOffset={MENU_BAR_EXTRA_POPOVER_STYLES.sideOffset}
                {...contentProps}
            >
                <TaskCenterDropdown />
            </PopoverContent>
        </Popover>
    );
}
