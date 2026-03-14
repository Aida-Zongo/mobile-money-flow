import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const protectedRoutes = [
    '/dashboard',
    '/expenses', 
    '/budgets',
    '/statistics',
    '/admin'
  ];
  
  const authRoutes = ['/login', '/register'];
  
  const isProtected = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Laisse passer — la vérification se fait côté client
  // avec useEffect dans chaque page protégée
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
