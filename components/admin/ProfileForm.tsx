'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { User, Camera, Loader2, Save } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ProfileFormProps {
  initialData: {
    name: string;
    description?: string | null;
    photoUrl?: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [photoUrl, setPhotoUrl] = useState(initialData.photoUrl || '');
  const [previewUrl, setPreviewUrl] = useState(initialData.photoUrl || '');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      addToast('Solo se permiten imágenes', 'error');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('La imagen es muy grande. Máximo 5MB', 'error');
      return;
    }

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al subir imagen');
      }

      const { url } = await response.json();
      setPhotoUrl(url);
      addToast('Imagen subida correctamente', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      addToast(error instanceof Error ? error.message : 'Error al subir imagen', 'error');
      setPreviewUrl(photoUrl); // Revertir preview
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('El nombre es requerido');
      isValid = false;
    } else if (name.length > 100) {
      setNameError('El nombre es muy largo (máximo 100 caracteres)');
      isValid = false;
    } else {
      setNameError('');
    }

    if (description && description.length > 200) {
      setDescriptionError('La descripción es muy larga (máximo 200 caracteres)');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          photoUrl: photoUrl || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar perfil');
      }

      addToast('Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Save error:', error);
      addToast(error instanceof Error ? error.message : 'Error al guardar perfil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const charCount = description.length;
  const charLimit = 200;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {/* Profile Photo */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="relative">
            {previewUrl ? (
              <div className="relative w-24 h-24">
                <Image
                  src={previewUrl}
                  alt={name}
                  fill
                  className="rounded-full object-cover border-4 border-gray-100"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-gray-600" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Foto de Perfil
            </h3>
            <p className="text-sm text-gray-600">
              JPG, PNG o WebP. Máximo 5MB
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) validateForm();
              }}
              onBlur={validateForm}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                nameError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Tu nombre"
              maxLength={101}
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600">{nameError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <span className={`text-xs ${charCount > charLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/{charLimit}
              </span>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (descriptionError) validateForm();
              }}
              onBlur={validateForm}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none ${
                descriptionError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Cuéntale a tus visitantes sobre ti..."
              maxLength={201}
            />
            {descriptionError && (
              <p className="mt-1 text-sm text-red-600">{descriptionError}</p>
            )}
          </div>

          {/* Preview Box */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Vista Previa
            </h4>
            <div className="bg-white rounded-lg p-4 text-center">
              {previewUrl ? (
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <h5 className="font-semibold text-gray-800 mb-1">
                {name || 'Tu nombre'}
              </h5>
              <p className="text-sm text-gray-600">
                {description || 'Tu descripción aparecerá aquí'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving || isUploading}
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
              type="button"
              onClick={() => {
                setName(initialData.name || '');
                setDescription(initialData.description || '');
                setPhotoUrl(initialData.photoUrl || '');
                setPreviewUrl(initialData.photoUrl || '');
                setNameError('');
                setDescriptionError('');
              }}
              disabled={isSaving || isUploading}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
