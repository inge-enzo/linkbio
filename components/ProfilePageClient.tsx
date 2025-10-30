'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { SocialButtons } from './SocialButtons';
import { SearchBar } from './SearchBar';
import { ProductCard } from './ProductCard';
import { ContentCard } from './ContentCard';
import { useDebounce } from '@/hooks/useDebounce';
import { useTracking } from '@/hooks/useTracking';

interface Profile {
  name: string;
  description?: string | null;
  photoUrl?: string | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  link: string;
}

interface Content {
  id: string;
  name: string;
  description?: string | null;
  link: string;
}

interface ProfilePageClientProps {
  userId: string;
  profile: Profile;
  socialLinks: SocialLink[];
  products: Product[];
  contents: Content[];
}

export function ProfilePageClient({
  userId,
  profile,
  socialLinks,
  products,
  contents,
}: ProfilePageClientProps) {
  const [productSearch, setProductSearch] = useState('');
  const [contentSearch, setContentSearch] = useState('');

  const debouncedProductSearch = useDebounce(productSearch, 500);
  const debouncedContentSearch = useDebounce(contentSearch, 500);

  const { trackPageView, trackClick, trackSearch } = useTracking({ userId });

  // Track page view on mount
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  // Track product search
  useEffect(() => {
    if (debouncedProductSearch) {
      trackSearch(debouncedProductSearch, 'product');
    }
  }, [debouncedProductSearch, trackSearch]);

  // Track content search
  useEffect(() => {
    if (debouncedContentSearch) {
      trackSearch(debouncedContentSearch, 'content');
    }
  }, [debouncedContentSearch, trackSearch]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const query = productSearch.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
  }, [products, productSearch]);

  // Filter contents
  const filteredContents = useMemo(() => {
    if (!contentSearch) return contents;
    const query = contentSearch.toLowerCase();
    return contents.filter(
      (content) =>
        content.name.toLowerCase().includes(query) ||
        content.description?.toLowerCase().includes(query)
    );
  }, [contents, contentSearch]);

  const handleSocialClick = (linkId: string) => {
    trackClick('social', linkId);
  };

  const handleProductClick = (productId: string) => {
    trackClick('product', productId);
  };

  const handleContentClick = (contentId: string) => {
    trackClick('content', contentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader
          name={profile.name}
          description={profile.description}
          photoUrl={profile.photoUrl}
        />

        {/* Social Links */}
        <SocialButtons links={socialLinks} onLinkClick={handleSocialClick} />

        {/* Products Section */}
        {products.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">
              Productos
            </h2>

            <SearchBar
              value={productSearch}
              onChange={setProductSearch}
              placeholder="Buscar productos..."
            />

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No se encontraron productos</p>
              </div>
            )}
          </section>
        )}

        {/* Contents Section */}
        {contents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">
              Contenido
            </h2>

            <SearchBar
              value={contentSearch}
              onChange={setContentSearch}
              placeholder="Buscar contenido..."
            />

            {filteredContents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredContents.map((content) => (
                  <ContentCard
                    key={content.id}
                    {...content}
                    onContentClick={handleContentClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No se encontró contenido</p>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {products.length === 0 && contents.length === 0 && socialLinks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No hay contenido disponible todavía</p>
          </div>
        )}
      </div>
    </div>
  );
}
