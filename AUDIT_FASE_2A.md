# Auditoria Visual — Fase 2A

**Data:** 2026-04-14

---

## 1. Componentes existentes em `src/components/`

| Arquivo | Tipo | O que faz | Destino |
|---|---|---|---|
| `Sidebar.tsx` | Client | Sidebar fixa 260px, fundo azul escuro (#00226B), links hardcoded sem filtragem por módulo | **SUBSTITUIR** pela nova sidebar hover-expand |
| `Topbar.tsx` | Client | Header 64px branco, título da página, busca, notificações, avatar azul | **SUBSTITUIR** pela nova topbar mínima |
| `AdBanner.tsx` | Client | Banner descartável com CTA de upgrade, fundo azul/gradiente | **ATUALIZAR** tokens para neutros |
| `UpgradeModal.tsx` | Client | Modal de upgrade com lista de benefícios, ícone azul | **ATUALIZAR** tokens para neutros |
| `AnimatedSection.tsx` | Client | Wrapper IntersectionObserver para animações CSS | **MANTER** (adaptar animações para novo sistema) |

**Não existe** `src/components/ui/` — nenhum primitivo (Button, Input, Card...) implementado.

---

## 2. Design tokens atuais (`globals.css`)

**Versão Tailwind**: v4 (`@import "tailwindcss"`)

### Tokens a remover:
- `--color-primary`: `#00226B` (azul escuro)
- `--color-primary-dark`: `#001A52`
- `--color-secondary`: `#467BF0` (azul médio)
- `--color-secondary-light`: `#6B9AFF`
- `--color-primary-light`: `#E8EFFF`
- `--color-background`: `#F0F4FA` (fundo azulado)
- `--color-sidebar`: `#00226B`
- `--color-sidebar-dark`: `#001A52`
- `--color-accent`: `#467BF0`
- `--color-accent-dark`: `#00226B`
- `--font-outfit` / `--font-sans: "Outfit"` (fonte a ser removida)

### Tokens funcionais a preservar (com novos valores):
- `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-danger`, `--color-success`, `--color-warning`

### Keyframes a preservar → renomear para sistema novo:
- `fadeInUp`, `fadeIn`, `slideInLeft`, `slideInRight`, `scaleIn` — manter
- `shimmer` — manter (útil para skeleton)
- `float`, `pulse-glow` — **REMOVER** (decorativos, não alinhados com o novo estilo)

### Classes utilitárias a preservar:
- `.animate-fade-in-up`, `.animate-fade-in`, `.animate-slide-in-left`, `.animate-slide-in-right`, `.animate-scale-in`
- `.scrollbar-thin` — adaptar para cores neutras

---

## 3. Tipografia atual

| Token | Valor atual | Ação |
|---|---|---|
| Família | `Outfit` (Google Fonts via `next/font`) | **REMOVER** |
| Variável | `--font-outfit`, `--font-sans: "Outfit"` | **SUBSTITUIR** por Geist |
| Import | `import { Outfit } from "next/font/google"` em `layout.tsx` | **REMOVER** |

---

## 4. `src/app/layout.tsx` (root)

- Importa `Outfit` do Google Fonts
- Aplica `${outfit.variable} antialiased font-sans` no `<body>`
- Tem `QueryProvider` wrapper
- **Ação**: remover Outfit, adicionar GeistSans + GeistMono

---

## 5. Layout autenticado

- **Rota group real**: `src/app/(app)/` (spec menciona `(dashboard)` — mas o projeto usa `(app)`)
- **Layout**: `src/app/(app)/layout.tsx` — server component, chama `getSession`, renderiza `<Sidebar>` + `<Topbar>`
- Sidebar é fixada em `w-[260px] ml-[260px]` (sempre visível, sem colapso)
- **Ação**: atualizar layout para nova estrutura com sidebar recolhível

---

## 6. Dependências — estado atual

```json
{
  "lucide-react": "✓ instalado",
  "motion": "✗ ausente — instalar",
  "clsx": "✗ ausente — instalar",
  "tailwind-merge": "✗ ausente — instalar",
  "geist": "✗ ausente — instalar"
}
```

---

## 7. shadcn/ui

**Não instalado.** Nenhum arquivo em `src/components/ui/`. Os primitivos serão criados do zero.

---

## 8. Páginas existentes no grupo `(app)`

| Rota | Arquivo | Status visual |
|---|---|---|
| `/dashboard` | `dashboard/page.tsx` | Usa cores azuis e `bg-primary` — atualizar |
| `/cardapio` | `cardapio/page.tsx` | Usa tokens antigos |
| `/configuracoes` | `configuracoes/page.tsx` | Usa tokens antigos |
| `/estoque` | `estoque/page.tsx` | Usa tokens antigos |
| `/estoque/perdas` | `estoque/perdas/page.tsx` | Usa tokens antigos |
| `/financeiro/dre` | `financeiro/dre/page.tsx` | Usa tokens antigos |
| Demais | — | Placeholder/esqueleto |

---

## 9. Conflitos e decisões

| Conflito | Decisão |
|---|---|
| Spec usa grupo `(dashboard)`, projeto usa `(app)` | Manter `(app)` — renomear o grupo quebraria todas as rotas |
| `Sidebar.tsx` e `Topbar.tsx` já existem na raiz de `components/` | Mover para `components/layout/` e reescrever completamente |
| `AdBanner.tsx` e `UpgradeModal.tsx` usam cores azuis | Atualizar tokens ao invés de reescrever — lógica está correta |
| `AnimatedSection.tsx` usa classes CSS customizadas | Manter, adaptar para respeitar `prefers-reduced-motion` |

---

## 10. Itens fora do escopo desta fase (não tocar)

- `src/app/login/page.tsx`
- `src/app/page.tsx` (landing)
- `src/app/(app)/admin/*`
- Qualquer quiz ou onboarding
