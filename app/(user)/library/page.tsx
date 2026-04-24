'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUserInfo } from '@/library/providers';
import { Button } from '@/library/ui/button';
import { usePathname } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';
import { api } from '@/library/services/api';
import { WorkDetailDialog } from '@/library/components/profile';
import { GenerationHistoryItem } from '@/library/components/profile/types';
import { normalizeWorkItem } from '@/library/components/profile/normalization';
import { seedanceApi, wanApi } from '@/library/ai/registry';
import {
  useAudioPlayer,
  type AudioTrack,
} from '@/library/media/audio-player/AudioPlayerProvider';
import { presetVoiceOptions } from '@/library/ai/registry';

import {
  AudioWorkCard,
  VideoWorkCard,
  LibraryFilters,
  MobileFilterDialog,
  HISTORY_FETCH_SIZE,
  HISTORY_PAGE_SIZE,
  EXPIRING_SOON_DAYS,
  isAudioModel,
  getModelLabel,
  getTopicLabel,
  getExpiryTimestampMs,
  type StatusFilter,
  type GroupBy,
  type DateSort,
  type FilterOption,
} from './components';
import { stripModelVersion } from '@/library/lib/aimodel/utils';
import siteConfig from '@/data/site.json';
import type { SiteConfig } from '@/types/siteConfig';

function LibraryPageContent() {
  const { track } = useAudioPlayer();
  const { userInfo, isLoadingUserInfo, isSignedIn, openSignIn } = useUserInfo();
  const userId = userInfo?.uuid;
  const isLoaded = !isLoadingUserInfo;
  const pathname = usePathname();
  const didHashScrollRef = useRef(false);

  const [historyList, setHistoryList] = useState<GenerationHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [activeTopicTag, setActiveTopicTag] = useState<number | null>(null);
  const [activeModelLabel, setActiveModelLabel] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [groupBy, setGroupBy] = useState<GroupBy>('date');
  const [dateSort, setDateSort] = useState<DateSort>('desc');
  const pollingTaskIds = useRef<Set<string>>(new Set());
  const [showManualLoad, setShowManualLoad] = useState(false);
  const [isDeletingAudio, setIsDeletingAudio] = useState<number | null>(null);
  const [audioMetaMap, setAudioMetaMap] = useState<
    Record<string, { name: string; avatar: string }[]>
  >({});

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedWorkDetail, setSelectedWorkDetail] =
    useState<GenerationHistoryItem | null>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const dedupeHistoryItems = useCallback((items: GenerationHistoryItem[]) => {
    const latestByTaskId = new Map<string, GenerationHistoryItem>();

    items.forEach((item) => {
      const key = item.task_id || `item-${item.id}`;
      const existing = latestByTaskId.get(key);
      if (!existing) {
        latestByTaskId.set(key, item);
        return;
      }

      const currentStamp = item.updated_at || item.created_at || 0;
      const existingStamp = existing.updated_at || existing.created_at || 0;
      if (currentStamp > existingStamp || (currentStamp === existingStamp && item.id > existing.id)) {
        latestByTaskId.set(key, item);
      }
    });

    return Array.from(latestByTaskId.values());
  }, []);

  // Fetch generation history
  useEffect(() => {
    const fetchGenerationHistory = async () => {
      if (!isLoaded || !userId) {
        setIsLoadingHistory(false);
        setHistoryList([]);
        return;
      }

      setIsLoadingHistory(true);
      setHistoryError(null);
      try {
        const result = await api.user.getUserOpusList(1, HISTORY_FETCH_SIZE);

        if (result.code === 200 && result.data) {
          setHistoryList(dedupeHistoryItems(result.data.list || []));
        } else {
          console.error(
            'Failed to fetch history:',
            result.msg || 'Unknown API error'
          );
          setHistoryList([]);
          setHistoryError(result.msg || 'Failed to fetch generation history');
        }
      } catch (error) {
        console.error('Failed to fetch generation history:', error);
        setHistoryError(
          error instanceof Error
            ? error.message
            : 'An unknown error occurred fetching history'
        );
        setHistoryList([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchGenerationHistory();
  }, [dedupeHistoryItems, isLoaded, userId]);

  // Build filter options
  const availableTopicTags = useMemo(() => {
    const tags = historyList
      .filter((item) => (item.topic_tag ?? 0) > 0)
      .map((item) => item.topic_tag as number);
    return Array.from(new Set(tags));
  }, [historyList]);

  const topicOptions: FilterOption[] = useMemo(
    () =>
      availableTopicTags.map((tag) => ({
        value: String(tag),
        label: getTopicLabel(tag),
      })),
    [availableTopicTags]
  );

  const availableModelLabels = useMemo(() => {
    const labels = historyList
      .map((item) => {
        const raw = getModelLabel(item.model);
        return raw ? stripModelVersion(raw) : null;
      })
      .filter((label): label is string => !!label);
    return Array.from(new Set(labels)).sort((a, b) => a.localeCompare(b));
  }, [historyList]);

  const modelOptions: FilterOption[] = useMemo(
    () =>
      availableModelLabels.map((label) => ({
        value: label,
        label,
      })),
    [availableModelLabels]
  );

  // Expiring check
  const isExpiringSoon = useCallback((item: GenerationHistoryItem) => {
    const expiryMs = getExpiryTimestampMs(item.created_at);
    if (!expiryMs) return false;
    const diffMs = expiryMs - Date.now();
    return diffMs > 0 && diffMs <= EXPIRING_SOON_DAYS * 24 * 60 * 60 * 1000;
  }, []);

  // Filter history
  const filteredHistory = useMemo(() => {
    return historyList
      .filter((item) => (activeTopicTag ? item.topic_tag === activeTopicTag : true))
      .filter((item) => {
        if (activeModelLabel === 'all') return true;
        const raw = getModelLabel(item.model);
        if (!raw) return false;
        const stripped = stripModelVersion(raw);
        return stripped === activeModelLabel;
      })
      .filter((item) => {
        if (statusFilter === 'failed') return item.status === -1;
        if (statusFilter === 'expiring') {
          return item.status !== -1 && isExpiringSoon(item);
        }
        return item.status !== -1;
      });
  }, [activeModelLabel, activeTopicTag, historyList, statusFilter, isExpiringSoon]);

  // Separate audio and video
  const audioHistory = useMemo(
    () =>
      filteredHistory.filter(
        (item) => isAudioModel(item.model) && (item.quality_image || item.generate_image)
      ),
    [filteredHistory]
  );

  const videoHistory = useMemo(
    () => filteredHistory.filter((item) => !isAudioModel(item.model)),
    [filteredHistory]
  );

  // Audio metadata
  useEffect(() => {
    if (audioHistory.length === 0) {
      setAudioMetaMap((prev) => (Object.keys(prev).length === 0 ? prev : {}));
      return;
    }

    const newMeta: Record<string, { name: string; avatar: string }[]> = {};

    audioHistory.forEach((item) => {
      let speakersFound = false;
      if (item.size_image) {
        try {
          const parsedSpeakers = JSON.parse(item.size_image);
          if (Array.isArray(parsedSpeakers) && parsedSpeakers.length > 0) {
            const meta = parsedSpeakers.map((speaker) => {
              const presetName = speaker.preset;
              const audioUrl = speaker.audio_url;
              let matchedOption;

              if (!audioUrl) {
                matchedOption = ((presetVoiceOptions || []) as any[]).find(
                  (option) => option.preset === presetName
                );
              } else {
                matchedOption = ((presetVoiceOptions || []) as any[]).find(
                  (option) => option.audio_url === audioUrl
                );
              }

              if (matchedOption) {
                return {
                  name: matchedOption.label,
                  avatar: matchedOption.avatar || '/speaker/Default.jpeg',
                };
              }

              return {
                name: presetName ? presetName.split('[')[0].trim() : 'Custom Voice',
                avatar: '/speaker/custom.jpg',
              };
            });

            newMeta[item.task_id] = meta;
            speakersFound = true;
          }
        } catch (err) {
          console.warn('Failed to parse size_image for task', item.task_id, err);
        }
      }

      if (!speakersFound && typeof window !== 'undefined') {
        const key = `vibevoice_meta_${item.task_id}`;
        const stored = window.localStorage.getItem(key);
        if (stored) {
          try {
            newMeta[item.task_id] = JSON.parse(stored);
          } catch (err) {
            console.warn('Failed to parse metadata from local storage', err);
          }
        }
      }
    });

    setAudioMetaMap(newMeta);
  }, [audioHistory]);

  // Build audio items
  const audioItems = useMemo(
    () =>
      audioHistory.flatMap((item) => {
        const unifiedItem = normalizeWorkItem(item);
        const variants =
          unifiedItem?.workType === 'audio' && unifiedItem.variantItems.length > 0
            ? unifiedItem.variantItems
            : [
                {
                  url: item.quality_image || item.generate_image,
                },
              ];
        const artist = stripModelVersion(getModelLabel(item.model) || 'Audio');
        const fallbackTitle = item.prompt
          ? item.prompt.slice(0, 60)
          : `Audio ${item.task_id}`;

        return variants
          .filter((variant) => !!variant.url)
          .map((variant, index) => ({
            item,
            track: {
              id: `audio-${item.id}-${variant.id || index}`,
              title:
                variant.title ||
                (variants.length > 1
                  ? `${fallbackTitle} · V${index + 1}`
                  : fallbackTitle),
              artist,
              src: variant.url,
              cover: variant.coverUrl || unifiedItem?.coverUrl || item.origin_image,
              speakers: audioMetaMap[item.task_id],
            } as AudioTrack,
          }));
      }),
    [audioHistory, audioMetaMap]
  );

  const sortedAudioItems = useMemo(() => {
    const dir = dateSort === 'asc' ? 1 : -1;
    return [...audioItems].sort((a, b) => {
      const aTime = a.item.created_at || 0;
      const bTime = b.item.created_at || 0;
      return aTime === bTime ? 0 : aTime > bTime ? dir : -dir;
    });
  }, [audioItems, dateSort]);

  // Sort and paginate video history
  const sortedHistory = useMemo(() => {
    const items = [...videoHistory];
    const dir = dateSort === 'asc' ? 1 : -1;
    items.sort((a, b) => {
      const aTime = a.created_at || 0;
      const bTime = b.created_at || 0;
      return aTime === bTime ? 0 : aTime > bTime ? dir : -dir;
    });
    return items;
  }, [dateSort, videoHistory]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedHistory.length / HISTORY_PAGE_SIZE)),
    [sortedHistory.length]
  );

  const paginatedHistory = useMemo(() => {
    return sortedHistory.slice(0, currentPage * HISTORY_PAGE_SIZE);
  }, [currentPage, sortedHistory]);

  const groupedHistory = useMemo(() => {
    const groups = new Map<string, GenerationHistoryItem[]>();
    paginatedHistory.forEach((item) => {
      const key =
        groupBy === 'model'
          ? stripModelVersion(getModelLabel(item.model) || 'Other')
          : new Date(item.created_at * 1000).toISOString().slice(0, 10);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    });

    const keys = Array.from(groups.keys());
    if (groupBy === 'model') {
      keys.sort((a, b) => a.localeCompare(b));
    } else {
      keys.sort((a, b) => (a > b ? 1 : -1));
      if (dateSort === 'desc') keys.reverse();
    }

    return keys.map((key) => ({ label: key, items: groups.get(key)! }));
  }, [dateSort, groupBy, paginatedHistory]);

  const totalWorkCount = sortedHistory.length + sortedAudioItems.length;

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeModelLabel, activeTopicTag, dateSort, groupBy, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Infinite scroll
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    if (totalPages <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setShowManualLoad(false);
        setCurrentPage((prev) => {
          if (prev >= totalPages) return prev;
          return prev + 1;
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [totalPages]);

  useEffect(() => {
    if (currentPage >= totalPages) {
      setShowManualLoad(false);
      return;
    }
    const id = window.setTimeout(() => {
      setShowManualLoad(true);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [currentPage, totalPages]);

  // Refresh history
  const refreshHistory = useCallback(() => {
    const fetchGenerationHistory = async () => {
      if (!isLoaded || !userId) {
        return;
      }

      setIsLoadingHistory(true);
      setHistoryError(null);
      try {
        const result = await api.user.getUserOpusList(1, HISTORY_FETCH_SIZE);

        if (result.code === 200 && result.data) {
          setHistoryList(dedupeHistoryItems(result.data.list || []));
        } else {
          console.error(
            'Failed to fetch history:',
            result.msg || 'Unknown API error'
          );
          setHistoryList([]);
          setHistoryError(result.msg || 'Failed to fetch generation history');
        }
      } catch (error) {
        console.error('Failed to fetch generation history:', error);
        setHistoryError(
          error instanceof Error
            ? error.message
            : 'An unknown error occurred fetching history'
        );
        setHistoryList([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchGenerationHistory();
  }, [dedupeHistoryItems, isLoaded, userId]);

  // Poll pending tasks
  useEffect(() => {
    const pending = historyList.filter(
      (item) => item.status === 0 && item.task_id
    );
    if (pending.length === 0) return;

    pending.forEach((item) => {
      const taskId = item.task_id;
      if (!taskId || pollingTaskIds.current.has(taskId)) return;
      const label = getModelLabel(item.model);
      if (!label?.startsWith('Wan ')) return;

      pollingTaskIds.current.add(taskId);

      const pollTask = async () => {
        if (!wanApi) return;
        let completed = false;

        try {
          const result = await wanApi.checkTaskStatus(taskId);
          completed = result.status === 1 || result.status === -1;
        } catch (pollError) {
          console.error('Polling task failed:', pollError);
        } finally {
          pollingTaskIds.current.delete(taskId);
          if (completed) {
            refreshHistory();
          }
        }
      };

      pollTask();
    });
  }, [historyList, refreshHistory]);

  // Hash scroll
  useEffect(() => {
    if (didHashScrollRef.current) return;
    if (!isLoaded) return;
    if (typeof window === 'undefined') return;
    if (window.location.hash !== '#generation-history-section') return;

    const scrollToAnchor = () => {
      const el = document.getElementById('generation-history-section');
      if (!el) return false;
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      return true;
    };

    const didScroll = scrollToAnchor();
    if (didScroll) {
      didHashScrollRef.current = true;
      return;
    }

    const id = window.setTimeout(() => {
      if (scrollToAnchor()) {
        didHashScrollRef.current = true;
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, [isLoaded]);

  // Handlers
  const handleOpenDetailDialog = (item: GenerationHistoryItem) => {
    setSelectedWorkDetail(item);
    setIsDetailDialogOpen(true);
  };

  const handleAudioDownload = async (event: React.MouseEvent, audioTrack: AudioTrack) => {
    event.stopPropagation();
    const safeTitle = audioTrack.title
      .replace(/[^\w\s-]+/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
    const filename = safeTitle ? `${safeTitle}.mp3` : 'vibevoice-audio.mp3';

    try {
      const response = await fetch(audioTrack.src);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download audio via blob:', error);
      // Fallback to original method
      const link = document.createElement('a');
      link.href = audioTrack.src;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAudioDelete = async (event: React.MouseEvent, opusId: number) => {
    event.stopPropagation();
    if (!userId) return;
    if (!window.confirm('Delete this audio?')) return;
    setIsDeletingAudio(opusId);
    try {
      const result = await api.user.deleteOpus(opusId);
      if (result.code === 200) {
        refreshHistory();
      }
    } catch (err) {
      console.error('Failed to delete audio:', err);
    } finally {
      setIsDeletingAudio(null);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex-grow py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <ReloadIcon className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
            <p className="text-gray font-inter">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Sign in required
  if (!isSignedIn) {
    return (
      <div className="flex-grow py-12 px-6">
        <div className="container mx-auto max-w-lg">
          <div className="bg-card rounded-2xl p-8 text-center shadow-custom border border-border">
            <h1 className="text-2xl font-bold mb-4 text-card-foreground">
              Library
            </h1>
            <p className="mb-6 text-muted-foreground">
              Please sign in to view your library
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => openSignIn({ forceRedirectUrl: pathname || '/' })}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div id="generation-history-section" className="mb-4 scroll-mt-24">
            <div className="flex justify-end items-center">
              <Button
                onClick={refreshHistory}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isLoadingHistory}
              >
                {isLoadingHistory ? (
                  <>
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <ReloadIcon className="h-4 w-4" />
                    <span>Refresh</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Works are retained for 6 months. Please download and save promptly.
            </p>
            {historyError && (
              <p className="text-sm text-red-500 mt-2">{historyError}</p>
            )}
          </div>

          {/* Filters */}
          <div className="mb-4">
            <div className="flex items-center justify-between sm:hidden">
              <div className="text-sm font-semibold text-muted-foreground">
                Filters
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                Filter
              </Button>
            </div>

            <div className="hidden sm:block">
              <LibraryFilters
                topicOptions={topicOptions}
                modelOptions={modelOptions}
                activeTopicTag={activeTopicTag}
                setActiveTopicTag={setActiveTopicTag}
                activeModelLabel={activeModelLabel}
                setActiveModelLabel={setActiveModelLabel}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                groupBy={groupBy}
                setGroupBy={setGroupBy}
                dateSort={dateSort}
                setDateSort={setDateSort}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <div className="text-xs text-muted-foreground">{totalWorkCount} works</div>

            {/* Audio items */}
            {sortedAudioItems.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-muted-foreground" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedAudioItems.map(({ item, track: audioTrack }) => (
                    <AudioWorkCard
                      key={audioTrack.id}
                      item={item}
                      audioTrack={audioTrack}
                      isDeleting={isDeletingAudio === item.id}
                      onDownload={handleAudioDownload}
                      onDelete={handleAudioDelete}
                      onOpenDetail={handleOpenDetailDialog}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Video items */}
            {groupedHistory.length > 0 ? (
              groupedHistory.map((group) => (
                <div key={group.label} className="space-y-3">
                  <div className="text-sm font-semibold text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {group.items.map((item) => (
                      <VideoWorkCard
                        key={item.id}
                        item={item}
                        onOpenDetail={handleOpenDetailDialog}
                        showModelLabel={activeModelLabel === 'all' && groupBy !== 'model'}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : sortedAudioItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                No works yet.
              </div>
            ) : null}

            {/* Load more */}
            {currentPage < totalPages && (
              <div ref={loadMoreRef} className="flex justify-center py-6">
                {!showManualLoad && (
                  <div className="text-xs text-muted-foreground">Loading more...</div>
                )}
              </div>
            )}

            {showManualLoad && currentPage < totalPages && (
              <div className="flex justify-center pb-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowManualLoad(false);
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                >
                  Load more
                </Button>
              </div>
            )}
          </div>

          {/* Detail Dialog */}
          <WorkDetailDialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
            item={selectedWorkDetail}
            onDeleteSuccess={refreshHistory}
          />

          {/* Mobile Filter Dialog */}
          <MobileFilterDialog
            open={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
            topicOptions={topicOptions}
            modelOptions={modelOptions}
            activeTopicTag={activeTopicTag}
            setActiveTopicTag={setActiveTopicTag}
            activeModelLabel={activeModelLabel}
            setActiveModelLabel={setActiveModelLabel}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            dateSort={dateSort}
            setDateSort={setDateSort}
          />
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return <LibraryPageContent />;
}
