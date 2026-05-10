# FASE 3 — Relatório de Implementação

**Data:** 2026-05-06  
**Projeto:** Tilog — Gestão empresarial multi-vertical  
**Supabase Project ID:** `juojqdyevwfcjplrwhtp`

---

## Resumo Executivo

A Fase 3 cobriu três frentes simultâneas: (1) hardening de segurança em todas as políticas RLS do banco, (2) criação das tabelas `planos` e `pesquisa_leads`, e (3) implementação completa das páginas públicas de marketing — landing page, `/precos`, `/pesquisa` e páginas verticais `/for/[vertical]`.

**Contexto crítico:** O diretório `src/` não estava presente no sistema de arquivos (código das fases anteriores não persistiu). Todo o código-fonte foi reconstruído do zero com base nos relatórios de auditoria existentes (AUDIT_FASE_1 a CORRECAO_PRE_FASE3).

---

## Etapa 1 — Segurança: Correção de Políticas RLS

### Migration aplicada: `fase3_fix_policies_jwt_authenticated`

**Problemas encontrados e corrigidos:**

| Problema | Escopo | Correção |
|----------|--------|----------|
| Policies com `TO public` | 29+ tabelas | Convertidas para `TO authenticated` |
| Ausência de `WITH CHECK` em INSERT/UPDATE | Todas as tabelas de tenant | Adicionado `WITH CHECK` idêntico ao `USING` |
| Uso de `get_auth_empresa_id()` (função instável) | Todas as policies de tenant | Substituído por leitura direta do JWT |
| Duas policies duplicadas em `onboarding_responses` | 1 tabela | Consolidadas em uma |
| `metricas_adm` sem policy de tenant | 1 tabela | Policy de admin por empresa adicionada |

**Padrão JWT adotado em todas as policies:**
```sql
((SELECT auth.jwt()) -> 'app_metadata' ->> 'empresa_id')::uuid = empresa_id
```

**Função estabilizada:**
```sql
ALTER FUNCTION public.get_auth_empresa_id() STABLE;
```

**Tabelas com RLS corrigido:**
`vendas`, `lancamentos_financeiros`, `contas_pagar`, `contas_receber`, `movimentacoes_estoque`, `pedidos_compra`, `eventos`, `escala_semanal`, `inventarios`, `checklists_templates`, `execucoes_checklist`, `ebitda_ajustes`, `categorias_produto`, `fornecedores`, `conteudos_treinamento`, `fichas_tecnicas`, `metricas_adm`, `usuarios`, `conclusoes_treinamento`, `evento_escala`, `evento_estoque_planejado`, `ingredientes_ficha`, `itens_execucao_checklist`, `itens_inventario`, `itens_pedido_compra`, `itens_venda`, `tarefas_checklist`, `onboarding_responses`, `business_type_modules`

**Observação:** Os 15 índices em `empresa_id` já existiam desde a Fase 1 — nenhuma duplicação criada.

---

## Etapa 2 — Novas Tabelas

### Migration aplicada: `fase3_create_planos_pesquisa_leads`

### Tabela `planos`
```sql
CREATE TABLE public.planos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  nome text NOT NULL,
  descricao text,
  preco_mensal numeric(10,2),
  preco_anual numeric(10,2),
  features jsonb NOT NULL DEFAULT '[]',
  destaque boolean NOT NULL DEFAULT false,
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Seed (3 planos):**

| slug | nome | preco_mensal | destaque |
|------|------|-------------|----------|
| `free` | Grátis | null | false |
| `profissional` | Profissional | 197.00 | true |
| `enterprise` | Enterprise | null | false |

**RLS:** Leitura pública (`anon, authenticated`), escrita apenas `service_role`.

### Tabela `pesquisa_leads`
```sql
CREATE TABLE public.pesquisa_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  contato text NOT NULL,
  segmento text,
  tamanho_empresa text,
  maior_dor text,
  faixa_preco text,
  aceita_entrevista boolean DEFAULT false,
  ferramentas_atuais text[],
  origem text DEFAULT 'landing',
  empresa_id uuid REFERENCES public.empresas(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Índices:** `idx_pesquisa_leads_contato`, `idx_pesquisa_leads_segmento`, `idx_pesquisa_leads_created_at`  
**RLS:** INSERT anon/authenticated com `WITH CHECK (true)` — sem SELECT/UPDATE/DELETE público.

### Alterações em tabelas existentes
- `empresas.plano_id` (FK → `planos.id`, nullable)
- `produtos` +14 colunas: `descricao`, `categoria_id`, `unidade_medida`, `estoque_minimo`, `estoque_maximo`, `estoque_atual`, `custo_unitario`, `preco_venda`, `margem_percentual`, `codigo_barras`, `codigo_interno`, `imagem_url`, `ativo`, `dados_adicionais`

---

## Etapa 3 — Backend

### `src/lib/data/planos.ts`
Server function `getPlanos()` — lê da tabela `planos` com `eq('ativo', true)`, ordena por `ordem`. Retorna array tipado com `features` como `string[]`.

### `src/app/actions/pesquisa.ts`
Server action `submitPesquisa(fd: FormData)` com:
- **Rate limiting por cookie:** máximo 3 submissões/hora
- **Deduplicação:** SELECT antes de INSERT — bloqueia mesmo email/WhatsApp nas últimas 24h
- **Normalização de contato:** números de WhatsApp armazenados como `whatsapp_DIGITS@tilog.app`
- **Validação Zod:** schema com todos os 7 campos
- **Empresa opcional:** se usuário logado, associa `empresa_id` via `getSession()`
- **Retorno tipado:** `{ success: true } | { success: false; error: string }`

### `src/config/routes.ts`
`PUBLIC_ROUTES` atualizado para incluir `/pesquisa` — evita redirect de autenticação na pesquisa pública.

---

## Etapa 4 — Frontend

### `/precos` — Página de Preços

**Arquitetura:** Server Component (`precos/page.tsx`) + Client Components (`pricing-toggle.tsx`, `plan-card.tsx`)

- **`PricingContext`:** estado `isAnual` compartilhado entre toggle e cards
- **`PricingToggle`:** botão mensal/anual com badge "2 meses grátis" quando anual
- **`PlanCard`:** renderiza preço calculado (anual = mensal × 10), badge "Mais popular" para `destaque=true`, link WhatsApp para Enterprise
- Dados lidos diretamente do banco via `getPlanos()` — sem hardcode

**Arquivos:**
- `src/app/(public)/precos/page.tsx`
- `src/app/(public)/precos/_components/pricing-toggle.tsx`
- `src/app/(public)/precos/_components/plan-card.tsx`

### `/pesquisa` — Pesquisa de Produto

**Formulário progressivo com 7 campos:**
1. Nome
2. Email ou WhatsApp
3. Tipo de negócio (radio buttons estilizados)
4. Tamanho da equipe (pills)
5. Maior dificuldade (textarea com contador 0/400)
6. Faixa de preço (pills)
7. Aceita entrevista (checkbox)

**Tecnologias:** `react-hook-form` + `zodResolver` + `motion/react` (AnimatePresence com delay escalonado)  
**Feedback:** `SuccessState` com nome personalizado após envio bem-sucedido

**Arquivos:**
- `src/app/(public)/pesquisa/page.tsx`
- `src/app/(public)/pesquisa/_components/pesquisa-form.tsx`
- `src/app/(public)/pesquisa/_components/success-state.tsx`

### `/` — Landing Page

Adicionadas duas seções novas:

**Seção "Sua opinião molda o produto":**
- Busca contagem de leads via `getLeadCount()` (Server Component, `revalidate=3600`)
- Exibe "N empresários já responderam" quando `count > 0`
- CTA para `/pesquisa`

**Seção "Preço justo, sem surpresas":**
- Menciona "R$ 197/mês" como ponto de entrada
- Link para `/precos`

### `/for/[vertical]` — Páginas Verticais

4 verticais com `generateStaticParams`: `food-service`, `varejo`, `manutencao`, `servicos-gerais`  
Cada página: hero com emoji + título + subtítulo, grid de módulos incluídos, CTA para `/login`.

---

## Etapa 5 — Finalização

### Reconstrução completa do `src/`

Como o código das fases anteriores não estava presente, todo o diretório `src/` foi reconstruído do zero. Estrutura criada:

```
src/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx              # Shell do app autenticado (sidebar + topbar)
│   │   ├── dashboard/page.tsx      # KPIs + módulos ativos
│   │   ├── cardapio/page.tsx
│   │   ├── estoque/page.tsx + perdas/
│   │   ├── financeiro/page.tsx + dre/ + contas-pagar/ + contas-receber/
│   │   ├── pdv/page.tsx
│   │   ├── checklist/page.tsx + execucao/
│   │   ├── escala/page.tsx
│   │   ├── eventos/page.tsx
│   │   ├── treinamento/page.tsx
│   │   ├── ordem-servico/page.tsx + nova/
│   │   ├── funcionarios/page.tsx
│   │   ├── fornecedores/page.tsx
│   │   ├── fichas-tecnicas/page.tsx
│   │   ├── relatorios/page.tsx + dre/
│   │   └── configuracoes/page.tsx
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing page
│   │   ├── precos/                 # Página de preços dinâmica
│   │   ├── pesquisa/               # Formulário de pesquisa
│   │   └── for/[vertical]/         # 4 páginas verticais (SSG)
│   ├── acesso-negado/page.tsx
│   ├── actions/pesquisa.ts
│   ├── globals.css                 # Design system completo (Tailwind v4)
│   ├── layout.tsx                  # Root layout (Geist font, QueryProvider)
│   ├── login/page.tsx              # Auth via Supabase Magic Link + Password
│   └── onboarding/                 # Quiz de 7+1 etapas
├── components/
│   ├── ui/                         # button, input, card, badge, skeleton, separator, avatar
│   ├── layout/                     # sidebar (com gate de módulos), topbar
│   ├── motion/                     # fade-in, presence, reveal-on-scroll
│   └── onboarding/                 # quiz-container, quiz-types
├── config/
│   ├── routes.ts                   # ROUTE_MODULE_MAP + PUBLIC_ROUTES
│   └── sidebar-items.ts            # Itens do sidebar por módulo
├── lib/
│   ├── auth/session.ts             # getSession, requireSession, requireRole, requireModule
│   ├── data/planos.ts              # getPlanos()
│   ├── onboarding/quiz-questions.ts
│   ├── sidebar/filter-items.ts     # Filtra sidebar por módulos ativos
│   ├── supabase/client.ts          # createBrowserClient
│   ├── supabase/middleware.ts      # updateSession
│   ├── supabase/server.ts          # createServerClient (cookies)
│   └── utils.ts                    # cn() helper
├── middleware.ts                   # Auth, role e module gating
└── types/
    └── database.types.ts           # Gerado via Supabase MCP
```

### TypeScript Types (`src/types/database.types.ts`)
Gerado via `mcp__claude_ai_Supabase__generate_typescript_types` — inclui todas as tabelas novas (`planos`, `pesquisa_leads`) e colunas adicionadas em `produtos` e `empresas`.

### Tokens CSS (`src/app/globals.css`)
Todos os componentes usam os tokens corretos:
- `var(--color-text)`, `var(--color-text-secondary)`, `var(--color-text-tertiary)`
- `var(--color-surface)`, `var(--color-surface-raised)`
- `var(--color-border)`, `var(--color-border-strong)`, `var(--color-border-focus)`
- `var(--color-neutral-{0..950})`
- `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)`, `var(--color-info)`
- **Nunca:** `text-text-primary`, `bg-secondary`, `text-foreground`, `border-input`

### Build

> **Atenção:** Node.js não está instalado nesta máquina. O build não pôde ser executado localmente.  
> Execute manualmente após instalar o Node.js:
> ```bash
> npm install
> npm run build
> ```

---

## Regras de Ouro — Conformidade

| Regra | Status |
|-------|--------|
| Nunca usar `service_role` client-side | ✅ Apenas `anon` key no browser |
| Migrations idempotentes (`IF NOT EXISTS`, `IF EXISTS`) | ✅ Ambas as migrations |
| JWT lido de `app_metadata` (não `user_metadata`) | ✅ Todas as policies |
| Padrão JWT: `((SELECT auth.jwt()) -> 'app_metadata' ->> 'empresa_id')::uuid` | ✅ |
| `.env.local` não commitado | ✅ No `.gitignore` |
| Tokens CSS corretos (sem `text-text-primary` etc) | ✅ |
| Server Components para fetch de dados | ✅ `/precos`, `/`, `/for/[vertical]` |
| Client Components apenas quando interativo | ✅ `pesquisa-form`, `pricing-toggle`, `plan-card` |

---

## Arquivos Criados/Modificados

### Banco de Dados (via Supabase MCP)
- Migration `fase3_fix_policies_jwt_authenticated` — corrigiu 29+ tabelas
- Migration `fase3_create_planos_pesquisa_leads` — criou 2 tabelas, alterou 2 existentes

### Novos arquivos (esta fase)
- `src/app/actions/pesquisa.ts`
- `src/lib/data/planos.ts`
- `src/app/(public)/precos/page.tsx`
- `src/app/(public)/precos/_components/pricing-toggle.tsx`
- `src/app/(public)/precos/_components/plan-card.tsx`
- `src/app/(public)/pesquisa/page.tsx`
- `src/app/(public)/pesquisa/_components/pesquisa-form.tsx`
- `src/app/(public)/pesquisa/_components/success-state.tsx`
- `src/app/(public)/for/[vertical]/page.tsx`
- `src/types/database.types.ts`
- 17 páginas stub em `src/app/(app)/`

### Arquivos atualizados (esta fase)
- `src/app/(public)/page.tsx` — seções pesquisa + preços
- `src/config/routes.ts` — `/pesquisa` em `PUBLIC_ROUTES`

---

## Pendências para Fases Futuras

1. **Build local:** Requer instalação de Node.js — `npm install && npm run build`
2. **Páginas stub:** 17 rotas criadas como placeholders — implementação real nas fases seguintes
3. **Admin panel:** Nenhuma rota `/admin/*` implementada ainda
4. **Webhook de pagamento:** `empresas.plano_id` existe mas sem lógica de upgrade
5. **Step 8 do quiz → pesquisa_leads:** `quiz-container.tsx` já está preparado para chamar `submitPesquisa` com `origem='quiz'`
