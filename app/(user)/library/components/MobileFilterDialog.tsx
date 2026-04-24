'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/library/ui/dialog';
import { Button } from '@/library/ui/button';
import { LibraryFiltersProps, FilterOption } from './types';

interface MobileFilterDialogProps extends LibraryFiltersProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MobileFilterDialog({
    open,
    onOpenChange,
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
}: MobileFilterDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-sm sm:hidden">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        Filters
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Refine your works list
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {topicOptions.length > 0 && (
                        <div>
                            <div className="text-xs text-muted-foreground mb-2">Topic</div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={activeTopicTag === null ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveTopicTag(null)}
                                >
                                    All
                                </Button>
                                {topicOptions.map((opt) => (
                                    <Button
                                        key={opt.value}
                                        variant={
                                            activeTopicTag === Number(opt.value) ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => setActiveTopicTag(Number(opt.value))}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {modelOptions.length > 0 && (
                        <div>
                            <div className="text-xs text-muted-foreground mb-2">Model</div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={activeModelLabel === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveModelLabel('all')}
                                >
                                    All
                                </Button>
                                {modelOptions.map((opt) => (
                                    <Button
                                        key={opt.value}
                                        variant={activeModelLabel === opt.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveModelLabel(opt.value)}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="text-xs text-muted-foreground mb-2">Status</div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'expiring' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('expiring')}
                            >
                                Expiring Soon
                            </Button>
                            <Button
                                variant={statusFilter === 'failed' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('failed')}
                            >
                                Failed
                            </Button>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground mb-2">Group by</div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={groupBy === 'date' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setGroupBy('date')}
                            >
                                Date
                            </Button>
                            <Button
                                variant={groupBy === 'model' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setGroupBy('model')}
                            >
                                Model
                            </Button>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground mb-2">Sort</div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={dateSort === 'desc' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setDateSort('desc')}
                            >
                                Newest
                            </Button>
                            <Button
                                variant={dateSort === 'asc' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setDateSort('asc')}
                            >
                                Oldest
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
