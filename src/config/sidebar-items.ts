import type { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  label: string
  href: string
  icon: string
  module?: string
  children?: SidebarItem[]
}

export interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', module: 'dashboard' },
    ],
  },
  {
    title: 'Operação',
    items: [
      { label: 'PDV', href: '/pdv', icon: 'ShoppingCart', module: 'pdv' },
      { label: 'Cardápio', href: '/cardapio', icon: 'UtensilsCrossed', module: 'cardapio' },
      { label: 'Checklist', href: '/checklist', icon: 'ClipboardCheck', module: 'checklist' },
      { label: 'Eventos', href: '/eventos', icon: 'Calendar', module: 'eventos' },
      { label: 'Escala', href: '/escala', icon: 'Clock', module: 'escala' },
      { label: 'OS', href: '/ordem-servico', icon: 'Wrench', module: 'ordem_servico' },
    ],
  },
  {
    title: 'Estoque',
    items: [
      {
        label: 'Estoque',
        href: '/estoque',
        icon: 'Package',
        module: 'estoque',
        children: [
          { label: 'Visão geral', href: '/estoque', icon: 'Package' },
          { label: 'Perdas', href: '/estoque/perdas', icon: 'Trash2' },
        ],
      },
      { label: 'Fornecedores', href: '/fornecedores', icon: 'Truck', module: 'fornecedores' },
      { label: 'Fichas Técnicas', href: '/fichas-tecnicas', icon: 'BookOpen', module: 'fichas_tecnicas' },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      {
        label: 'Financeiro',
        href: '/financeiro',
        icon: 'DollarSign',
        module: 'financeiro',
        children: [
          { label: 'DRE', href: '/financeiro/dre', icon: 'BarChart2' },
          { label: 'Contas a Pagar', href: '/financeiro/contas-pagar', icon: 'CreditCard' },
          { label: 'Contas a Receber', href: '/financeiro/contas-receber', icon: 'TrendingUp' },
        ],
      },
    ],
  },
  {
    title: 'Pessoas',
    items: [
      { label: 'Funcionários', href: '/funcionarios', icon: 'Users', module: 'funcionarios' },
      { label: 'Treinamento', href: '/treinamento', icon: 'GraduationCap', module: 'treinamento' },
    ],
  },
  {
    title: 'Análise',
    items: [
      { label: 'Relatórios', href: '/relatorios', icon: 'BarChart', module: 'relatorios' },
    ],
  },
  {
    items: [
      { label: 'Configurações', href: '/configuracoes', icon: 'Settings', module: 'configuracoes' },
    ],
  },
]
