import { GenerationHistoryItem } from '@/library/components/profile/types';
import { AudioTrack } from '@/library/media/audio-player/AudioPlayerProvider';

export interface AudioWorkItem {
    item: GenerationHistoryItem;
    track: AudioTrack;
}

export interface FilterOption {
    value: string;
    label: string;
}

export type StatusFilter = 'all' | 'expiring' | 'failed';
export type GroupBy = 'date' | 'model';
export type DateSort = 'desc' | 'asc';

export interface LibraryFiltersProps {
    topicOptions: FilterOption[];
    modelOptions: FilterOption[];
    activeTopicTag: number | null;
    setActiveTopicTag: (tag: number | null) => void;
    activeModelLabel: string;
    setActiveModelLabel: (label: string) => void;
    statusFilter: StatusFilter;
    setStatusFilter: (filter: StatusFilter) => void;
    groupBy: GroupBy;
    setGroupBy: (groupBy: GroupBy) => void;
    dateSort: DateSort;
    setDateSort: (sort: DateSort) => void;
}
