export const ROUTE_MODULE_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/cardapio': 'cardapio',
  '/estoque': 'estoque',
  '/estoque/perdas': 'estoque',
  '/financeiro': 'financeiro',
  '/financeiro/dre': 'financeiro',
  '/financeiro/contas-pagar': 'financeiro',
  '/financeiro/contas-receber': 'financeiro',
  '/pdv': 'pdv',
  '/checklist': 'checklist',
  '/checklist/execucao': 'checklist',
  '/escala': 'escala',
  '/eventos': 'eventos',
  '/treinamento': 'treinamento',
  '/ordem-servico': 'ordem_servico',
  '/ordem-servico/nova': 'ordem_servico',
  '/funcionarios': 'funcionarios',
  '/fornecedores': 'fornecedores',
  '/relatorios': 'relatorios',
  '/relatorios/dre': 'relatorios',
  '/configuracoes': 'configuracoes',
}

export function getRequiredModule(pathname: string): string | null {
  let best: string | null = null
  let bestLen = 0

  for (const [route, module] of Object.entries(ROUTE_MODULE_MAP)) {
    if (pathname.startsWith(route) && route.length > bestLen) {
      best = module
      bestLen = route.length
    }
  }

  return best
}

export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/acesso-negado',
  '/for',
  '/precos',
  '/pesquisa',
]
