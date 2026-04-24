"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GlobalVolumeContextType {
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
    toggleMute: () => void;
    unmuteForUserPlayback: () => void;
    /** The ID of the component that currently has exclusive audio priority */
    activeExclusivePlayerId: string | null;
    /** Request or release exclusive audio priority */
    requestExclusiveAudio: (id: string | null) => void;
}

const GlobalVolumeContext = createContext<GlobalVolumeContextType | undefined>(undefined);

export function GlobalVolumeProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMutedState] = useState(true);
    const [activeExclusivePlayerId, setActiveExclusivePlayerId] = useState<string | null>(null);

    // Sync with localStorage if available
    useEffect(() => {
        const saved = localStorage.getItem("global-mute");
        if (saved !== null) {
            setIsMutedState(saved === "true");
        }
    }, []);

    const setIsMuted = (muted: boolean) => {
        setIsMutedState(muted);
        localStorage.setItem("global-mute", muted.toString());
    };

    const toggleMute = () => {
        const next = !isMuted;
        setIsMutedState(next);
        localStorage.setItem("global-mute", next.toString());
    };

    const unmuteForUserPlayback = () => {
        if (!isMuted) return;
        setIsMutedState(false);
        localStorage.setItem("global-mute", "false");
    };

    const requestExclusiveAudio = (id: string | null) => {
        setActiveExclusivePlayerId(id);
    };

    return (
        <GlobalVolumeContext.Provider value={{
            isMuted,
            setIsMuted,
            toggleMute,
            unmuteForUserPlayback,
            activeExclusivePlayerId,
            requestExclusiveAudio
        }}>
            {children}
        </GlobalVolumeContext.Provider>
    );
}

export function useGlobalVolume() {
    const context = useContext(GlobalVolumeContext);
    if (context === undefined) {
        throw new Error("useGlobalVolume must be used within a GlobalVolumeProvider");
    }
    return context;
}
