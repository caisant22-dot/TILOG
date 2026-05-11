import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getRequiredModule, PUBLIC_ROUTES } from '@/config/routes'

// Rotas que, se logado-com-empresa acessar, são redirecionadas para /dashboard
const AUTH_ENTRY_ROUTES = ['/', '/login', '/onboarding', '/criar-conta']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  // Inicializa Supabase para ler cookies de sessão
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
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

  // Rotas públicas: ainda checamos se logado-com-empresa entrou em rota de "entrada"
  if (isPublic) {
    if (user) {
      const meta = user.app_metadata ?? {}
      const empresaId: string | null = meta.empresa_id ?? null
      const userRole: string = meta.user_role ?? 'anonymous'

      // Logado-com-empresa em rota de entrada → /dashboard
      if (
        empresaId &&
        AUTH_ENTRY_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
      ) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }

      // Superadmin sem empresa em qualquer rota pública (exceto /admin) → /admin
      if (
        !empresaId &&
        userRole === 'superadmin' &&
        !pathname.startsWith('/admin') &&
        pathname !== '/pesquisa' &&
        pathname !== '/precos' &&
        !pathname.startsWith('/for/')
      ) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }
    return response
  }

  // Rotas privadas: não autenticado → /login
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

  // Superadmin sem empresa → /admin
  if (isSuperadmin && !empresaId && !pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Não-superadmin sem empresa → /onboarding
  if (!empresaId && !isSuperadmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
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
