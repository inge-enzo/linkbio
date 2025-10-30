'use client';

import { ExternalLink, Youtube, Instagram as InstagramIcon } from 'lucide-react';
import { useState } from 'react';

interface ContentCardProps {
  id: string;
  name: string;
  description?: string | null;
  link: string;
  onContentClick: (id: string) => void;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractInstagramId(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([^/?#&]+)/,
    /instagram\.com\/reel\/([^/?#&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function ContentCard({
  id,
  name,
  description,
  link,
  onContentClick,
}: ContentCardProps) {
  const [showEmbed, setShowEmbed] = useState(false);

  const youtubeId = extractYouTubeId(link);
  const instagramId = extractInstagramId(link);
  const hasEmbed = !!(youtubeId || instagramId);

  const handleClick = (e: React.MouseEvent) => {
    if (!showEmbed && hasEmbed) {
      e.preventDefault();
      setShowEmbed(true);
    } else {
      onContentClick(id);
    }
  };

  return (
    <div
      className="
        bg-white rounded-2xl shadow-md hover:shadow-xl
        transition-all duration-300 overflow-hidden
        hover:scale-[1.02] hover:-translate-y-1
        animate-fade-in
      "
    >
      {/* Embed Preview */}
      {showEmbed && youtubeId && (
        <div className="relative w-full aspect-video bg-gray-100">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={name}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {showEmbed && instagramId && (
        <div className="relative w-full bg-gray-100 p-4 flex items-center justify-center min-h-[400px]">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={`https://www.instagram.com/p/${instagramId}/`}
            data-instgrm-version="14"
          />
          <script async src="//www.instagram.com/embed.js" />
        </div>
      )}

      {/* Content Info */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block p-5 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {youtubeId && (
                <Youtube className="w-5 h-5 text-red-600" />
              )}
              {instagramId && (
                <InstagramIcon className="w-5 h-5 text-pink-600" />
              )}
              <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
                {name}
              </h3>
            </div>

            {description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}

            <div className="flex items-center gap-2">
              {hasEmbed && !showEmbed && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                  Click para vista previa
                </span>
              )}
              <span className="text-sm text-gray-500 group-hover:text-primary-600 transition-colors">
                Ver contenido →
              </span>
            </div>
          </div>

          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors ml-3 flex-shrink-0" />
        </div>
      </a>
    </div>
  );
}
