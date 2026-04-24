'use client';

import React from 'react';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';
import { Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '@/library/media/audio-player/AudioPlayerProvider';

interface AudioExample {
  id: string;
  title: string;
  tags: string[];
  lyrics?: string;
  audioUrl: string;
  language: string;
}

export const AudioExamples = ({ node, selectedNodeId }: ComponentProps) => {
  const { heading, title, summary, examples = [], className } = node.props || {};
  const isSelected = selectedNodeId === node.id;
  
  const { track, isPlaying, togglePlay, playTrack } = useAudioPlayer();

  const handlePlayPause = (example: AudioExample) => {
    // If the current track is this example
    if (track?.src === example.audioUrl) {
      togglePlay();
    } else {
      // Play new track
      playTrack({
        id: example.id,
        title: example.title,
        artist: example.language, // Using language as artist for now as per design
        src: example.audioUrl,
      });
    }
  };

  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <section 
      id={node.id}
      data-node-id={node.id}
      className={cn('py-20 bg-background scroll-mt-20', className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200')}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {(heading || title) && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center font-poppins text-foreground">
              {heading || title}
            </h2>
          )}
          {summary && (
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              {summary}
            </p>
          )}
          
          <div className="space-y-6 mt-12">
            {examples.map((example: AudioExample, index: number) => {
              const isCurrentTrack = track?.src === example.audioUrl;
              const isExamplePlaying = isCurrentTrack && isPlaying;
              
              return (
                <div
                  key={example.id}
                  className={cn(
                    "bg-card rounded-xl border p-6 hover:shadow-lg transition-all duration-300",
                    isCurrentTrack ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                          {example.language}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground">
                          {example.title}
                        </h3>
                      </div>
                      
                      {example.tags && example.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {example.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {example.lyrics && (
                        <details className="mt-3">
                          <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                            Click to view lyrics
                          </summary>
                          <div className="mt-2 p-3 bg-muted/50 rounded text-sm text-muted-foreground whitespace-pre-line">
                            {example.lyrics}
                          </div>
                        </details>
                      )}
                    </div>
                    
                    {/* Right: Play Button (Global Player Control) */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handlePlayPause(example)}
                        className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 shrink-0",
                          isExamplePlaying
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                        )}
                        aria-label={isExamplePlaying ? "Pause" : "Play"}
                      >
                        {isExamplePlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
