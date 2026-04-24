import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverCmsApi } from '@/library/services/server-api';
import { getFrontendSiteConfig } from '@/library/services/frontend-data.server';
import Link from 'next/link';
import { Button } from '@/library/ui/button';
import { Footer } from '@/library/components/Footer';
import Image from 'next/image';
import siteConfigData from '@/data/site.json';

import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

// 根据返回的URL推断媒体类型
function inferGenType(mediaUrl?: string): 'video' | 'audio' | 'image' {
  if (!mediaUrl) return 'image';
  const candidate = mediaUrl.toLowerCase();

  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(candidate)) return 'video';
  if (/\.(mp3|wav|ogg|aac|m4a|flac|music)(\?|#|$)/i.test(candidate)) return 'audio';
  // Check for 'audios/' path segment which indicates audio content
  if (candidate.includes('/audios/')) return 'audio';
  if (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(candidate)) return 'image';

  // 默认按图片处理
  return 'image';
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfigData.site.url;

// 生成页面元数据（用于 Open Graph 标签）
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const opusDetail = await serverCmsApi.getOpusDetail(id);

  const siteConfig = await getFrontendSiteConfig();
  const siteName = siteConfig?.name || 'AI Generator';

  if (!opusDetail) {
    return {
      title: `Content Not Found | ${siteName}`,
    };
  }

  const mediaType = inferGenType(opusDetail.generate_image);

  // 使用原始图片作为缩略图，如果没有则使用生成的图片（如果是图片格式），否则使用默认分享图
  const getThumbnailUrl = () => {
    // 首先检查 origin_image 是否是图片格式
    if (opusDetail.origin_image && opusDetail.origin_image.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      return opusDetail.origin_image;
    }
    // 如果 origin_image 不是图片，检查 generate_image 是否是图片格式
    if (opusDetail.generate_image && inferGenType(opusDetail.generate_image) === 'image') {
      return opusDetail.generate_image;
    }
    // 如果都没有合适的图片，使用默认品牌分享图
    return `${siteUrl}/share-img.png`;
  };

  const thumbnailUrl = getThumbnailUrl();

  const description = `Check out this amazing AI-generated content! Create your own at ${siteUrl}`;

  return {
    title: `Amazing Content Created with ${siteName}`,
    description: description,
    openGraph: {
      title: `Amazing Content Created with ${siteName}`,
      description: description,
      type: mediaType === 'video' ? 'video.other' : (mediaType === 'audio' ? 'music.song' : 'website'),
      url: `${siteUrl}/share/${id}`,
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: `${mediaType === 'video' ? 'Video' : (mediaType === 'audio' ? 'Audio' : 'Image')} preview`,
        },
      ],
      ...(mediaType === 'video' ? [
        {
          url: opusDetail.generate_image,
          type: 'video/mp4',
        },
      ] : []),
      ...(mediaType === 'audio' ? [
        {
          url: opusDetail.generate_image,
          type: 'audio/mpeg',
        },
      ] : []),
    },
    alternates: {
      canonical: `${siteUrl}/share/${id}`,
    },
    twitter: {
      card: mediaType === 'video' ? 'player' : 'summary_large_image',
      title: `Amazing Content Created with ${siteName}`,
      description: description,
      images: [thumbnailUrl],
      ...(mediaType === 'video' ? {
        players: {
          playerUrl: opusDetail.generate_image,
          streamUrl: opusDetail.generate_image,
          width: 1280,
          height: 720,
        },
      } : {}),
      ...(mediaType === 'audio' ? {
        players: {
          playerUrl: opusDetail.generate_image,
          streamUrl: opusDetail.generate_image,
          width: 1280,
          height: 720, // Only if we had a dedicated player page, otherwise summary_large_image is often safer for audio if no dedicated player meta
        }
      } : {}),
    },
  };
}


export default async function ShareVideoPage({ params }: { params: Promise<{ id: string }> }) {
  // 获取视频详情
  const { id } = await params;
  const opusDetail = await serverCmsApi.getOpusDetail(id);
  const siteConfig = await getFrontendSiteConfig();
  const siteName = siteConfig?.name || 'AI Generator';

  console.log('Opus Detail:', JSON.stringify(opusDetail, null, 2));

  // 如果视频不存在或状态不正确，显示 404
  if (!opusDetail || opusDetail.status !== 1) {
    notFound();
  }

  const mediaType = inferGenType(opusDetail.generate_image);

  return (

    <div className="flex-grow py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Title - Dynamic based on media type */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-3">
            {mediaType === 'audio' ? 'Amazing AI-Generated Audio' : 'Amazing AI-Generated Video'}
          </h1>
          <p className="text-muted-foreground text-lg">
            Created with {siteName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Player & Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-xl p-4 md:p-6">
              {/* Media Player Container */}
              <div className="aspect-video bg-card border border-border rounded-xl overflow-hidden flex items-center justify-center relative bg-muted/30">
                {mediaType === 'video' ? (
                  <video
                    src={opusDetail.generate_image}
                    controls
                    className="w-full h-full object-contain"
                    playsInline
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : mediaType === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    {/* Audio Visualization Animation */}
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                      <div className="flex items-center gap-1.5 h-12">
                        <div className="w-1.5 bg-primary rounded-full animate-music-bar" style={{ height: '40%', animationDelay: '-0.3s' }}></div>
                        <div className="w-1.5 bg-primary rounded-full animate-music-bar" style={{ height: '80%', animationDelay: '-0.15s' }}></div>
                        <div className="w-1.5 bg-primary rounded-full animate-music-bar" style={{ height: '100%' }}></div>
                        <div className="w-1.5 bg-primary rounded-full animate-music-bar" style={{ height: '70%', animationDelay: '-0.15s' }}></div>
                        <div className="w-1.5 bg-primary rounded-full animate-music-bar" style={{ height: '50%', animationDelay: '-0.3s' }}></div>
                      </div>
                    </div>
                    <audio
                      src={opusDetail.generate_image}
                      controls
                      className="w-full max-w-md"
                      controlsList="nodownload"
                    >
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                ) : (
                  <Image
                    src={opusDetail.generate_image}
                    alt="Generated content"
                    width={1280}
                    height={720}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                )}
              </div>

              {/* Primary CTA */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link href="/" className="flex-1">
                  <Button className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/20 transition-all duration-300">
                    Create Your Own Content
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Details Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">

              {/* Model Info */}
              {opusDetail.model && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Model</h3>
                  <p className="font-medium text-foreground">{opusDetail.model}</p>
                </div>
              )}

              {/* Prompt */}
              {opusDetail.prompt && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Prompt</h3>
                  <div className="bg-muted/30 rounded-lg p-3 text-sm text-foreground/90 italic border border-border/50">
                    "{opusDetail.prompt}"
                  </div>
                </div>
              )}

              {/* Original Media (if exists) */}
              {opusDetail.origin_image && (opusDetail.origin_image.startsWith('http') || opusDetail.origin_image.startsWith('/')) && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Original Media</h3>
                  <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
                    {/\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(opusDetail.origin_image) ? (
                      <div className="p-3">
                        <audio src={opusDetail.origin_image} controls className="w-full h-8" />
                      </div>
                    ) : /\.(mp4|webm|mov)$/i.test(opusDetail.origin_image) ? (
                      <video src={opusDetail.origin_image} controls className="w-full max-h-32 object-contain" />
                    ) : (
                      <Image
                        src={opusDetail.origin_image}
                        alt="Original Input"
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary CTA Card */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10 p-6 text-center">
              <h3 className="font-bold text-lg mb-2 text-foreground">Inspired?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join thousands of creators using {siteName} to generate stunning {mediaType === 'audio' ? 'audio' : 'video'} content.
              </p>
              <Link href="/">
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary">
                  Try for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
