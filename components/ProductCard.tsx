'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  link: string;
  onProductClick: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  link,
  onProductClick,
}: ProductCardProps) {
  const handleClick = () => {
    onProductClick(id);
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="
        group block bg-white rounded-2xl shadow-md hover:shadow-xl
        transition-all duration-300 overflow-hidden
        hover:scale-[1.02] hover:-translate-y-1
        animate-fade-in
      "
    >
      {imageUrl && (
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 flex-1">
            {name}
          </h3>
          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors ml-2 flex-shrink-0" />
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {price !== null && price !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              ${price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 group-hover:text-primary-600 transition-colors">
              Ver más →
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
