import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Link in Bio',
  description: 'Tu página de enlaces personalizada',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
