import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const userName = session.user?.email?.split('@')[0] || 'Admin';

  return <AdminLayout userName={userName}>{children}</AdminLayout>;
}
