"use client";

import React from "react";
import Link from "next/link";
import { User, Library, LogOut } from "lucide-react";
import { cn } from "@/library/lib/utils";
import { useUserInfo } from "@/library/providers";
import { Avatar, AvatarFallback, AvatarImage } from "@/library/ui/avatar";
import { Button } from "@/library/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/library/ui/popover";
import { api } from "@/library/services/api";
import {
    MenuBarExtraItemProps,
    MENU_BAR_EXTRA_BUTTON_STYLES,
    MENU_BAR_EXTRA_POPOVER_STYLES,
    useHoverPopover,
    useMenuBarExtraStyles,
} from "./types";

/**
 * UserAccountExtra - Menu bar extra item for user profile
 * 
 * Shows user avatar that opens a dropdown menu on hover.
 * Menu includes: User info, My Account, Library, Sign Out.
 */
export function UserAccountExtra({ className }: MenuBarExtraItemProps) {
    const { signOut, userInfo } = useUserInfo();
    const { isOpen, setIsOpen, triggerProps, contentProps } = useHoverPopover();
    const { buttonColorClass } = useMenuBarExtraStyles();

    if (!userInfo) return null;

    const initials = userInfo.nickname
        ? userInfo.nickname.slice(0, 2).toUpperCase()
        : (userInfo.email?.[0] || 'U').toUpperCase();

    const handleSignOut = () => {
        api.auth.clearTokens();
        signOut();
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        MENU_BAR_EXTRA_BUTTON_STYLES.base,
                        isOpen ? MENU_BAR_EXTRA_BUTTON_STYLES.active : buttonColorClass,
                        "relative p-0 overflow-hidden", // Override padding for avatar
                        className
                    )}
                    title="User Account"
                    {...triggerProps}
                >
                    <Avatar className="h-full w-full">
                        <AvatarImage src={userInfo.avatar} alt={userInfo.nickname || userInfo.email || ''} />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(MENU_BAR_EXTRA_POPOVER_STYLES.content, "w-64 p-2 text-foreground")} // Wider content
                align="end" // Align right
                sideOffset={6}
                onOpenAutoFocus={(event) => event.preventDefault()}
                {...contentProps}
            >
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-3 border-b border-border/40 mb-1">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userInfo.avatar} alt={userInfo.nickname || userInfo.email || ''} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold text-sm truncate">
                            {userInfo.nickname || userInfo.email}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                            {userInfo.email}
                        </span>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col gap-0.5">
                    <Link href="/account" className="w-full">
                        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-9 px-3 font-normal cursor-pointer text-foreground hover:text-foreground">
                            <User className="h-4 w-4 text-muted-foreground" />
                            My Account
                        </Button>
                    </Link>

                    <Link href="/library" className="w-full">
                        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-9 px-3 font-normal cursor-pointer text-foreground hover:text-foreground">
                            <Library className="h-4 w-4 text-muted-foreground" />
                            Library
                        </Button>
                    </Link>

                    <div className="h-px bg-border/40 my-1 mx-1" />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 h-9 px-3 font-normal cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
