'use client';

import { Instagram, Youtube, Music } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialButtonsProps {
  links: SocialLink[];
  onLinkClick: (id: string) => void;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram,
  YouTube: Youtube,
  TikTok: Music,
  Twitter: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  LinkedIn: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Facebook: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

const socialColors: Record<string, string> = {
  Instagram: 'from-purple-600 to-pink-600',
  YouTube: 'from-red-600 to-red-700',
  TikTok: 'from-black to-gray-800',
  Twitter: 'from-blue-400 to-blue-600',
  LinkedIn: 'from-blue-600 to-blue-800',
  Facebook: 'from-blue-500 to-blue-700',
};

export function SocialButtons({ links, onLinkClick }: SocialButtonsProps) {
  if (links.length === 0) return null;

  return (
    <div className="flex justify-center gap-4 mb-8 animate-slide-up">
      {links.map((link) => {
        const Icon = socialIcons[link.platform] || Instagram;
        const colorClass = socialColors[link.platform] || 'from-gray-600 to-gray-800';

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick(link.id)}
            className={`
              bg-gradient-to-br ${colorClass}
              text-white p-4 rounded-full
              hover:scale-110 hover:shadow-xl
              transition-all duration-300
              flex items-center justify-center
            `}
            title={link.platform}
          >
            <Icon className="w-6 h-6" />
          </a>
        );
      })}
    </div>
  );
}
