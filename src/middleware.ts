import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getRequiredModule, PUBLIC_ROUTES } from '@/config/routes'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rota pública: libera sem verificação
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
  if (isPublic) return NextResponse.next()

  // Inicializa Supabase para ler cookies de sessão
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Não autenticado → /login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const meta = user.app_metadata ?? {}
  const empresaId: string | null = meta.empresa_id ?? null
  const userRole: string = meta.user_role ?? 'anonymous'
  const enabledModules: string[] = meta.enabled_modules ?? []
  const isSuperadmin = userRole === 'superadmin'

  // Superadmin sem empresa → /admin (não passa pelo onboarding)
  if (isSuperadmin && !empresaId && !pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Autenticado sem empresa (não-superadmin) → /onboarding
  if (!empresaId && !isSuperadmin && !pathname.startsWith('/onboarding')) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  // Autenticado com empresa → sai do onboarding
  if (empresaId && pathname.startsWith('/onboarding')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // /admin/* → somente superadmin
  if (pathname.startsWith('/admin')) {
    if (!isSuperadmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    return response
  }

  // Role guard: /dashboard → admin ou superior
  if (pathname.startsWith('/dashboard') && userRole === 'funcionario') {
    const url = request.nextUrl.clone()
    url.pathname = '/acesso-negado'
    return NextResponse.redirect(url)
  }

  // Module gating
  const requiredModule = getRequiredModule(pathname)
  if (requiredModule && !enabledModules.includes(requiredModule)) {
    const url = request.nextUrl.clone()
    url.pathname = '/acesso-negado'
    url.searchParams.set('module', requiredModule)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
