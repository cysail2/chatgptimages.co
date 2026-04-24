'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/library/ui/select';
import { LibraryFiltersProps } from './types';

export function LibraryFilters({
    topicOptions,
    modelOptions,
    activeTopicTag,
    setActiveTopicTag,
    activeModelLabel,
    setActiveModelLabel,
    statusFilter,
    setStatusFilter,
    groupBy,
    setGroupBy,
    dateSort,
    setDateSort,
}: LibraryFiltersProps) {
    return (
        <div className="flex flex-wrap gap-3 items-center">
            {topicOptions.length > 0 && (
                <Select
                    value={activeTopicTag === null ? 'all' : String(activeTopicTag)}
                    onValueChange={(value) =>
                        setActiveTopicTag(value === 'all' ? null : Number(value))
                    }
                >
                    <SelectTrigger className="h-9 w-[170px]">
                        <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        {topicOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {modelOptions.length > 0 && (
                <Select
                    value={activeModelLabel}
                    onValueChange={(value) => setActiveModelLabel(value)}
                >
                    <SelectTrigger className="h-9 w-[170px]">
                        <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Models</SelectItem>
                        {modelOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            <Select
                value={statusFilter}
                onValueChange={(value) =>
                    setStatusFilter(value as 'all' | 'expiring' | 'failed')
                }
            >
                <SelectTrigger className="h-9 w-[170px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="expiring">Expiring Soon</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={groupBy}
                onValueChange={(value) => setGroupBy(value as 'date' | 'model')}
            >
                <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date">Group by Date</SelectItem>
                    <SelectItem value="model">Group by Model</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={dateSort}
                onValueChange={(value) => setDateSort(value as 'asc' | 'desc')}
            >
                <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
