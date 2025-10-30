import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  description: z.string().max(200, 'La descripción no puede exceder 200 caracteres').optional().nullable(),
  photoUrl: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'La plataforma es requerida'),
  url: z.string().url('URL inválida'),
  order: z.number().int().min(0).optional(),
});

export const socialLinksArraySchema = z.array(socialLinkSchema);

export type ProfileInput = z.infer<typeof profileSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
