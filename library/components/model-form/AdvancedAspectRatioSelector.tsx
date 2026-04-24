"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/library/ui/label";
import { Input } from "@/library/ui/input";
import { Slider } from "@/library/ui/slider";
import { cn } from "@/library/lib/utils";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/library/ui/tooltip";

export interface AspectRatioOption {
    label: string;
    width: number;
    height: number;
    value?: string; // Optional value identifier (e.g. "16:9")
}

interface AdvancedAspectRatioSelectorProps {
    width: number;
    height: number;
    onDimensionsChange: (width: number, height: number) => void;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    minTotalPixels?: number;
    maxTotalPixels?: number;
    presets?: AspectRatioOption[];
    allowCustom?: boolean;
    hideHeader?: boolean;
}

const DEFAULT_PRESETS: AspectRatioOption[] = [
    { label: "1:1", width: 1, height: 1 },
    { label: "16:9", width: 16, height: 9 },
    { label: "9:16", width: 9, height: 16 },
    { label: "4:3", width: 4, height: 3 },
    { label: "3:4", width: 3, height: 4 },
    { label: "3:2", width: 3, height: 2 },
    { label: "2:3", width: 2, height: 3 },
];

export function AdvancedAspectRatioSelector({
    width,
    height,
    onDimensionsChange,
    minWidth = 1024,
    maxWidth = 4096,
    minHeight = 1024,
    maxHeight = 4096,
    minTotalPixels = 1024 * 1024,
    maxTotalPixels = 4096 * 4096,
    presets = DEFAULT_PRESETS,
    allowCustom = true,
    hideHeader = false,
}: AdvancedAspectRatioSelectorProps) {

    // Helper to calculate GCD for simplifying ratios
    const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
    };

    // Calculate current ratio string (e.g., "16:9") for highlighting
    const getCurrentRatioLabel = () => {
        // Try to match exact presets first (by ratio)
        const currentRatio = width / height;
        const tolerance = 0.01;

        const match = presets.find(p => {
            const pRatio = p.width / p.height;
            return Math.abs(currentRatio - pRatio) < tolerance;
        });

        if (match) return match.label;
        return "Custom";
    };

    const activeLabel = getCurrentRatioLabel();

    const handlePresetClick = (preset: AspectRatioOption) => {
        // When a preset is clicked, we need to find the "best" dimensions that fit the ratio 
        // and are close to standard sizes (like 1024, 2048 etc), 
        // but perhaps just setting a baseline dimension (e.g. based on current max dim) is better.
        // Actually, seedream usually has specific pixel counts for ratios.
        // However, this component is generic. 
        // Let's adopt a strategy: Keep the largest dimension close to the current max dimension, 
        // or a default standard like 2048 or 1024 depending on the range.

        // Strategy: Use a base size (e.g. 1024) and scale up.
        // Or better: try to match the "area" or a primary dimension of the current selection if possible, 
        // but defaulting to a safe resolution is often better.

        // Let's use a standard logic: 
        // If we are in "Seedream" context, the user might expect specific values.
        // But here we are generic.
        // Let's try to set the longer side to 1024 * X or similar?
        // Actually, usually presets imply a specific target resolution range.

        // Simple approach: Set based on a reference size, e.g. 2048 is common for Seedream.
        // Let's just pick a reasonable size that fits in min/max constraints.

        let targetW, targetH;
        if (preset.width >= preset.height) {
            targetW = 2048; // Default base?
            targetH = Math.round(targetW * (preset.height / preset.width));
        } else {
            targetH = 2048;
            targetW = Math.round(targetH * (preset.width / preset.height));
        }

        // Clamp to constraints
        if (targetW < minWidth) { targetW = minWidth; targetH = Math.round(targetW * (preset.height / preset.width)); }
        if (targetW > maxWidth) { targetW = maxWidth; targetH = Math.round(targetW * (preset.height / preset.width)); }
        if (targetH < minHeight) { targetH = minHeight; targetW = Math.round(targetH * (preset.width / preset.height)); }
        if (targetH > maxHeight) { targetH = maxHeight; targetW = Math.round(targetH * (preset.width / preset.height)); }

        // Ensure total pixels constraint
        let pixels = targetW * targetH;
        if (pixels > maxTotalPixels) {
            const scale = Math.sqrt(maxTotalPixels / pixels);
            targetW = Math.floor(targetW * scale);
            targetH = Math.floor(targetH * scale);
        }
        else if (pixels < minTotalPixels) {
            const scale = Math.sqrt(minTotalPixels / pixels);
            targetW = Math.ceil(targetW * scale);
            targetH = Math.ceil(targetH * scale);
        }

        // Align to multiples of 64 or 8 (common for AI)? Seedream often likes multiples of 64.
        // Let's round to nearest 64.
        targetW = Math.round(targetW / 64) * 64;
        targetH = Math.round(targetH / 64) * 64;

        // Re-clamp just in case
        targetW = Math.min(maxWidth, Math.max(minWidth, targetW));
        targetH = Math.min(maxHeight, Math.max(minHeight, targetH));

        onDimensionsChange(targetW, targetH);
    };

    return (
        <div className="space-y-4">
            {!hideHeader && (
                <div className="flex items-center gap-2">
                    <Label>Size</Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[280px]">
                                Adjust width and height.
                                Range: {minWidth} - {maxWidth} px.
                                Total Pixel Range: {Math.round(minTotalPixels / 1000000)}M - {Math.round(maxTotalPixels / 1000000)}M.
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}

            {/* Presets Grid */}
            <div className="flex flex-wrap gap-2">
                {presets.map((preset) => {
                    const isActive = activeLabel === preset.label;
                    return (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all",
                                isActive
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {/* Simple Ratio Icon */}
                            <span
                                className="block border border-current rounded-[1px] opacity-70"
                                style={{
                                    width: preset.width >= preset.height ? '14px' : `${14 * (preset.width / preset.height)}px`,
                                    height: preset.height >= preset.width ? '14px' : `${14 * (preset.height / preset.width)}px`
                                }}
                            />
                            {preset.label}
                        </button>
                    )
                })}
            </div>

            {/* Custom Sliders */}
            <div className="grid grid-cols-[80px_1fr_80px] gap-4 items-center">
                <span className="text-sm text-muted-foreground">Width</span>
                <Slider
                    value={[width]}
                    min={minWidth}
                    max={maxWidth}
                    step={64} // Step 64 is safe for most AI models
                    onValueChange={(vals) => onDimensionsChange(vals[0], height)}
                    className="flex-1"
                />
                <Input
                    type="number"
                    value={width}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) onDimensionsChange(val, height);
                    }}
                    className="h-8 text-center text-sm px-1"
                />
            </div>

            <div className="grid grid-cols-[80px_1fr_80px] gap-4 items-center">
                <span className="text-sm text-muted-foreground">Height</span>
                <Slider
                    value={[height]}
                    min={minHeight}
                    max={maxHeight}
                    step={64}
                    onValueChange={(vals) => onDimensionsChange(width, vals[0])}
                    className="flex-1"
                />
                <Input
                    type="number"
                    value={height}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) onDimensionsChange(width, val);
                    }}
                    className="h-8 text-center text-sm px-1"
                />
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
                <span>{width} × {height} px</span>
                <span>Range: {minWidth} - {maxWidth}</span>
            </div>
        </div>
    );
}
