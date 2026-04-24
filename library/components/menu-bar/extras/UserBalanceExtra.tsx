"use client";

import React, { useEffect, useState, useRef } from "react";
import { Coins, Gift, Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/library/lib/utils";
import { useUserInfo } from "@/library/providers";
import { Button } from "@/library/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/library/ui/popover";
import { api } from "@/library/services/api";
import { PointsLogDialog } from "@/library/components/profile/PointsLogDialog";
import {
    MenuBarExtraItemProps,
    MENU_BAR_EXTRA_BUTTON_STYLES,
    MENU_BAR_EXTRA_POPOVER_STYLES,
    useHoverPopover,
    useMenuBarExtraStyles,
} from "./types";

interface TimesLogItem {
    id: number;
    user_id: number;
    change_type: string;
    use_limit: number;
    created_at: number;
}

const formatTimestamp = (timestamp: number): string => {
    if (!timestamp) return "N/A";
    try {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
            }).format(date);
        }
    } catch (e) {
        return "N/A";
    }
};

const formatChangeType = (changeType: string): string => {
    const typeMap: Record<string, string> = {
        buy_package: "Purchase",
        create_task_free: "Free Gen",
        create_task: "Generation",
        month_free: "Monthly",
        register_give: "Welcome",
        invite_reward: "Invite",
        daily_check: "Check-in",
        refund: "Refund",
    };
    return typeMap[changeType] || changeType;
};

/** Delay before pre-fetching points log (ms) - avoid competing with initial render */
const PREFETCH_DELAY = 3000;

/**
 * UserBalanceExtra - Menu bar extra item for user balance with points log dropdown
 * 
 * Shows user's credit balance or trial vouchers.
 * Pre-fetches points log data after a delay to ensure data is ready when popover opens.
 * Hovering opens a popover with recent points transaction history.
 * Clicking "View All" opens the full points log dialog.
 */
export function UserBalanceExtra({ className }: MenuBarExtraItemProps) {
    const { userInfo, isLoadingUserInfo, isSignedIn, refreshUserInfo } = useUserInfo();
    const { isOpen, setIsOpen, triggerProps, contentProps } = useHoverPopover();
    const { buttonColorClass } = useMenuBarExtraStyles();
    const [pointsLog, setPointsLog] = useState<TimesLogItem[]>([]);
    const [isLoadingLog, setIsLoadingLog] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [showFullDialog, setShowFullDialog] = useState(false);
    const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hasUserInfo = !!userInfo;
    const freeTimes = userInfo?.free_times ?? 0;
    const shouldShowTrial =
        isSignedIn && hasUserInfo && userInfo.level === 0 && freeTimes > 0;

    // Fetch points log helper
    const fetchPointsLog = async () => {


        setIsLoadingLog(true);
        setHasFetched(true);
        try {
            const result = await api.user.getTimesLog(1, 5);
            if (result.code === 200 && result.data) {
                setPointsLog(result.data.list || []);
            }
        } catch (error) {
            console.error("Failed to fetch points log:", error);
        } finally {
            setIsLoadingLog(false);
        }
    };

    // Pre-fetch points log after delay (avoid competing with initial render)
    useEffect(() => {
        if (!isSignedIn || !hasUserInfo || hasFetched) return;

        prefetchTimeoutRef.current = setTimeout(() => {
            fetchPointsLog();
        }, PREFETCH_DELAY);

        return () => {
            if (prefetchTimeoutRef.current) {
                clearTimeout(prefetchTimeoutRef.current);
            }
        };
    }, [isSignedIn, hasUserInfo, hasFetched]);

    // If popover opens, fetch points log and refresh user balance
    useEffect(() => {
        if (isOpen && isSignedIn) {
            // Refresh user balance to ensure it's up to date
            refreshUserInfo();

            if (prefetchTimeoutRef.current) {
                clearTimeout(prefetchTimeoutRef.current);
            }
            fetchPointsLog();
        }
        //@ts-ignore
    }, [isOpen, isSignedIn]);

    // Don't render if not signed in
    if (!isSignedIn) {
        return null;
    }

    const iconSize = MENU_BAR_EXTRA_BUTTON_STYLES.icon;
    const balance = userInfo?.total_credits ?? 0;

    // Loading state - only show if we have no data at all
    if (!hasUserInfo) {
        return (
            <div className={cn("flex items-center gap-1 text-sm", buttonColorClass, className)}>
                <span className="w-4 h-4 rounded-full bg-current opacity-30 animate-pulse" />
                <span className="opacity-70">...</span>
            </div>
        );
    }

    const handleViewAll = () => {
        setIsOpen(false);
        setShowFullDialog(true);
    };

    return (
        <>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            "h-8 px-2 rounded-full transition-colors gap-1 cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0",
                            isOpen
                                ? MENU_BAR_EXTRA_BUTTON_STYLES.active
                                : buttonColorClass,
                            className
                        )}
                        title={shouldShowTrial ? "Trial Vouchers" : "Points Balance"}
                        {...triggerProps}
                    >
                        {shouldShowTrial ? (
                            <>
                                <Gift className={iconSize} />
                                <span className="text-sm">{freeTimes}</span>
                            </>
                        ) : (
                            <>
                                <Coins className={iconSize} />
                                <span className="text-sm">{balance}</span>
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className={cn(
                        MENU_BAR_EXTRA_POPOVER_STYLES.content,
                        "w-72 p-0"
                    )}
                    align="end"
                    sideOffset={MENU_BAR_EXTRA_POPOVER_STYLES.sideOffset}
                    {...contentProps}
                >
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-foreground">
                                    {shouldShowTrial ? "Trial Vouchers" : "Points Balance"}
                                </h4>
                                <p className="text-2xl font-bold text-foreground">
                                    {shouldShowTrial ? freeTimes : balance}
                                </p>
                            </div>
                            {shouldShowTrial ? (
                                <Gift className="h-8 w-8 text-primary/60" />
                            ) : (
                                <Coins className="h-8 w-8 text-primary/60" />
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-border/50 mb-3" />

                        {/* Recent Transactions */}
                        <div>
                            <h5 className="text-xs font-medium text-muted-foreground mb-2">
                                Recent Activity
                            </h5>

                            {isLoadingLog && pointsLog.length === 0 ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : pointsLog.length > 0 ? (
                                <div className={cn("space-y-2 relative transition-opacity duration-200", isLoadingLog ? "opacity-60" : "opacity-100")}>
                                    {pointsLog.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-foreground">
                                                    {formatChangeType(item.change_type)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTimestamp(item.created_at)}
                                                </span>
                                            </div>
                                            <span
                                                className={cn(
                                                    "font-medium",
                                                    item.use_limit > 0
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                )}
                                            >
                                                {item.use_limit > 0 ? "+" : ""}
                                                {item.use_limit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-3">
                                    No recent activity
                                </p>
                            )}
                        </div>
                    </div>

                    {/* View All Button */}
                    <div className="border-t border-border/50">
                        <Button
                            variant="ghost"
                            className="w-full h-10 rounded-none rounded-b-2xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 justify-between px-4"
                            onClick={handleViewAll}
                        >
                            <span>View All</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Full Points Log Dialog */}
            <PointsLogDialog
                open={showFullDialog}
                onOpenChange={setShowFullDialog}
                userId={userInfo?.uuid}
                isLoaded={hasUserInfo}
            />
        </>
    );
}
