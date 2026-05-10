# Auditoria Visual — Fase 2B (Landing Page + Marketing)

**Data:** 2026-04-14

---

## 1. Estado atual de rotas marketing

| Rota | Estado | Ação |
|---|---|---|
| `src/app/page.tsx` | `redirect('/login')` — redireciona diretamente | **SUBSTITUIR** por `(marketing)/page.tsx` |
| `src/app/(marketing)/` | Não existe | **CRIAR** |
| `src/components/marketing/` | Não existe | **CRIAR** |
| `src/lib/marketing/` | Não existe | **CRIAR** |

---

## 2. Middleware atual

`src/middleware.ts` não lista `/` nas rotas públicas. Qualquer rota não autenticada redireciona para `/login`, incluindo `/`. Precisa ser atualizado para:
- `/` → pública (anônimo) / redireciona pra `/dashboard` (autenticado)
- `/for/*` → pública / redireciona pra `/dashboard` (autenticado)
- `/precos` → pública / redireciona pra `/dashboard` (autenticado)

---

## 3. Dependências ausentes

| Pacote | Necessário para | Ação |
|---|---|---|
| `@radix-ui/react-dropdown-menu` | MarketingNav dropdown "Para você" | **INSTALAR** |

---

## 4. Primitivos disponíveis (Fase 2A)

- `Button`, `Card`, `Badge`, `Tooltip`, `Separator`, `Skeleton`, `Avatar` — todos em `src/components/ui/`
- `typography` tokens em `src/lib/typography.ts`
- `cn()` em `src/lib/utils.ts`
- Motion wrappers em `src/components/motion/`

---

## 5. Decisões de implementação

| Item | Decisão |
|---|---|
| Root `src/app/page.tsx` | Substituído pelo novo `(marketing)/page.tsx`. O `src/app/page.tsx` é deletado (Next.js serve `(marketing)/page.tsx` para a rota `/`). |
| Dropdown nav | Implementado com `@radix-ui/react-dropdown-menu` |
| FAQ | `<details>/<summary>` HTML nativo — sem JS adicional |
| `RevealOnScroll` | Novo wrapper client em `src/components/motion/reveal-on-scroll.tsx` |
| `BrowserMockup` | Server Component com SVG/CSS puro, 6 variants |
| WhatsApp helper | `src/lib/scheduling/whatsapp.ts` |
| Vertical content | `src/lib/marketing/verticals.ts` |

---

## 6. TODOs pós-Fase 2B

- `/termos`, `/privacidade`, `/lgpd` — páginas linkadas no footer, retornam 404. Criar na Fase 3.
- Lighthouse scores só podem ser medidos rodando `pnpm dev` com o browser.
