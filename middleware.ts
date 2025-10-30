import { auth } from '@/lib/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/admin/dashboard');

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
