'use client';

import { useState } from 'react';
import { Instagram, Youtube, Music, Loader2, Save, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

interface SocialLinksManagerProps {
  initialLinks: SocialLink[];
}

const PLATFORMS = [
  { name: 'Instagram', icon: Instagram, color: 'from-purple-600 to-pink-600' },
  { name: 'TikTok', icon: Music, color: 'from-black to-gray-800' },
  { name: 'YouTube', icon: Youtube, color: 'from-red-600 to-red-700' },
];

export function SocialLinksManager({ initialLinks }: SocialLinksManagerProps) {
  const { addToast } = useToast();
  const [links, setLinks] = useState<Record<string, string>>(() => {
    const linkMap: Record<string, string> = {};
    initialLinks.forEach((link) => {
      linkMap[link.platform] = link.url;
    });
    return linkMap;
  });

  const [linkIds, setLinkIds] = useState<Record<string, string>>(() => {
    const idMap: Record<string, string> = {};
    initialLinks.forEach((link) => {
      idMap[link.platform] = link.id;
    });
    return idMap;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (platform: string, url: string) => {
    setLinks((prev) => ({ ...prev, [platform]: url }));

    // Validar en tiempo real
    if (url && !validateUrl(url)) {
      setErrors((prev) => ({ ...prev, [platform]: 'URL inválida' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[platform];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Validar todos los campos
    const newErrors: Record<string, string> = {};
    Object.entries(links).forEach(([platform, url]) => {
      if (url && !validateUrl(url)) {
        newErrors[platform] = 'URL inválida';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Por favor corrige los errores', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Eliminar links vacíos y crear/actualizar los demás
      const promises = PLATFORMS.map(async (platform, index) => {
        const url = links[platform.name];
        const linkId = linkIds[platform.name];

        if (!url && linkId) {
          // Eliminar si existe pero está vacío
          await fetch(`/api/social-links/${linkId}`, {
            method: 'DELETE',
          });
          return null;
        } else if (url && linkId) {
          // Actualizar existente
          return {
            id: linkId,
            url,
            order: index,
          };
        } else if (url && !linkId) {
          // Crear nuevo
          const response = await fetch('/api/social-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform: platform.name,
              url,
              order: index,
            }),
          });
          const newLink = await response.json();
          // Guardar el ID
          setLinkIds((prev) => ({ ...prev, [platform.name]: newLink.id }));
          return newLink;
        }
        return null;
      });

      const results = await Promise.all(promises);
      const linksToUpdate = results.filter((link) => link !== null && 'id' in link);

      if (linksToUpdate.length > 0) {
        await fetch('/api/social-links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ links: linksToUpdate }),
        });
      }

      addToast('Redes sociales actualizadas correctamente', 'success');
    } catch (error) {
      console.error('Save error:', error);
      addToast('Error al guardar redes sociales', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (platform: string) => {
    const linkId = linkIds[platform];
    if (!linkId) {
      // Solo limpiar el campo
      setLinks((prev) => ({ ...prev, [platform]: '' }));
      return;
    }

    setDeletingId(linkId);
    try {
      const response = await fetch(`/api/social-links/${linkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar');
      }

      // Limpiar estado
      setLinks((prev) => {
        const newLinks = { ...prev };
        delete newLinks[platform];
        return newLinks;
      });

      setLinkIds((prev) => {
        const newIds = { ...prev };
        delete newIds[platform];
        return newIds;
      });

      addToast('Red social eliminada', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      addToast('Error al eliminar red social', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="space-y-4 mb-6">
        {PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          const url = links[platform.name] || '';
          const error = errors[platform.name];
          const linkId = linkIds[platform.name];
          const isDeleting = deletingId === linkId;

          return (
            <div
              key={platform.name}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{platform.name}</h3>
                  <p className="text-sm text-gray-500">
                    {url ? 'Configurado' : 'No configurado'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de {platform.name}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(platform.name, e.target.value)}
                      placeholder={`https://${platform.name.toLowerCase()}.com/tu-perfil`}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {url && (
                      <>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => handleDelete(platform.name)}
                          disabled={isDeleting}
                          className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving || Object.keys(errors).length > 0}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
        <button
          onClick={() => {
            const initialLinkMap: Record<string, string> = {};
            initialLinks.forEach((link) => {
              initialLinkMap[link.platform] = link.url;
            });
            setLinks(initialLinkMap);
            setErrors({});
          }}
          disabled={isSaving}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
