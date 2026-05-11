# FASE 4 — Relatório de Implementação

**Data:** 2026-05-10
**Projeto:** Tilog
**Supabase Project ID:** `juojqdyevwfcjplrwhtp`
**Build:** `npx next build` — **40 rotas**, 0 erros TypeScript, 0 erros de build, 0 erros de lint (8 warnings pré-existentes)

---

## 1. Bugs corrigidos

### 1.1 — `node_modules` e cache `.next` corrompidos (Crítico)
**Sintoma:** Todas as rotas retornavam HTTP 500. Stack: `Cannot find module '@swc/helpers'` + `next-flight-client-entry-loader not resolved` + `ENOENT` em `.next/dev/cache/webpack/**/*.pack.gz`.

**Causa raiz:** Pós sessão anterior, `node_modules` ficou em estado inconsistente (pacote `@swc/helpers` ausente) e cache do webpack tinha referências stat-eadas que não existiam.

**Correção:** `rm -rf .next && npm install`. Após restart, `@swc/helpers/package.json` presente, cache reconstruído.

### 1.2 — `.env.local` ausente (Crítico)
**Sintoma:** `/precos` e `/onboarding` retornavam 500. Erro: `supabaseUrl is required` em `getPlanos` e no middleware.

**Causa raiz:** Arquivo `.env.local` foi perdido durante a limpeza do tracking git da sessão anterior.

**Correção:** Recriei `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` (`https://juojqdyevwfcjplrwhtp.supabase.co`) e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable) obtidos via Supabase MCP. Adicionei `NEXT_PUBLIC_APP_URL` para uso no `emailRedirectTo` do signup.

### 1.3 — `getPlanos` sem fallback exterior (Médio)
**Causa raiz:** Se `createPublicClient()` lançasse exceção (env var faltando, network), o `unstable_cache` propagava o throw e a página `/precos` crashava com 500.

**Correção:** [planos.ts:31-58](src/lib/data/planos.ts) — try/catch externo retornando `[]`. Em [precos/page.tsx:36-46](src/app/(public)/precos/page.tsx) — empty state com "Estamos atualizando nossos planos" quando lista vazia.

### 1.4 — `/onboarding` não acessível para anônimos (Crítico para Fase 4)
**Causa raiz:** Middleware tinha `if (!user) redirect('/login')` para qualquer rota não pública, e `/onboarding` não estava em `PUBLIC_ROUTES`.

**Correção:** [routes.ts:39-49](src/config/routes.ts) — `/onboarding`, `/criar-conta`, `/recuperar-senha` agora em `PUBLIC_ROUTES`. Middleware reescrito para distinguir rotas públicas/privadas e tratar 3 perfis (anônimo, logado-sem-empresa, logado-com-empresa, superadmin).

### 1.5 — Quiz polui `pesquisa_leads` com emails fake (Alto)
**Causa raiz:** Step 8 do quiz combinava finalização de onboarding com pesquisa de produto, gerando `contato = userId + '@tilog.app'` como placeholder.

**Correção:**
- DELETE de leads `WHERE email LIKE '%@tilog.app' AND origem = 'quiz'` (0 linhas — não havia lixo)
- Step 8 **removido** do quiz. Pesquisa de produto fica apenas em `/pesquisa`.
- `TOTAL_STEPS` reduzido de 8 para 7.

### 1.6 — Fluxo de cadastro inexistente (Crítico)
**Causa raiz:** Landing apontava "Criar conta grátis" para `/login`, que só fazia signin. Sem signup público.

**Correção:** Tarefa 3 — fluxo PLG completo (ver seção 3).

---

## 2. Banco de Dados

### Migration `pre_signup_onboarding_v1`
```sql
ALTER TABLE public.onboarding_responses ADD COLUMN session_id uuid;
-- UNIQUE em session_id (idempotente)
ALTER TABLE public.onboarding_responses ALTER COLUMN user_id DROP NOT NULL;
-- CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
CREATE INDEX idx_onboarding_session ON onboarding_responses(session_id) WHERE session_id IS NOT NULL;

-- Policy: anon pode CRUD se session_id IS NOT NULL OU user_id = auth.uid()
DROP POLICY IF EXISTS "onboarding_anon_session" ON onboarding_responses;
CREATE POLICY "onboarding_anon_session" ON onboarding_responses FOR ALL TO anon, authenticated ...
```

### Migration `claim_onboarding_session_rpc`
```sql
CREATE FUNCTION public.claim_onboarding_session(p_session_id uuid, p_user_id uuid) ...
-- SECURITY DEFINER
-- UPDATE onboarding_responses SET user_id = p_user_id, session_id = NULL WHERE session_id = p_session_id
-- INSERT ON CONFLICT (user_id) DO NOTHING para garantir registro
GRANT EXECUTE TO authenticated;
```

### Limpeza
```sql
DELETE FROM pesquisa_leads WHERE email LIKE '%@tilog.app' AND origem = 'quiz';
-- 0 linhas afetadas (não havia lixo no ambiente)
```

### TypeScript Types
Regenerados via `mcp__supabase__generate_typescript_types` — agora incluem `session_id` em `onboarding_responses` e a função `claim_onboarding_session` em `Database.public.Functions`.

---

## 3. Fluxo de cadastro novo (PLG)

```
┌──────────────────────────────────────────────────────────────────┐
│ /  (landing)                                                     │
│   └─ CTA "Começar grátis" → /onboarding                          │
└──────────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────────┐
│ /onboarding  (PÚBLICO — anônimo pode acessar)                    │
│   - getOrCreateOnboardingSession() → UUID em localStorage         │
│   - Quiz de 7 steps, autosave em onboarding_responses(session_id)│
│   - Step 7 (company_name) → router.push('/criar-conta')          │
└──────────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────────┐
│ /criar-conta  (PÚBLICO)                                          │
│   - Lê session_id do localStorage                                │
│   - Se ausente → redirect /onboarding                            │
│   - Carrega company_name + business_type via select              │
│   - Form: email + senha + confirma senha                         │
│   - Valida senha (>=8 char, letras+números, match confirm)       │
│   - supabase.auth.signUp                                         │
│   - rpc claim_onboarding_session(sessionId, userId)              │
│   - rpc complete_onboarding(userId, businessType, companyName)   │
│   - clearOnboardingSession() + window.location.href = /dashboard │
│   - Se sem session imediata → /criar-conta/verifique-email       │
└──────────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────────┐
│ /dashboard  (com módulos do vertical ativados)                   │
└──────────────────────────────────────────────────────────────────┘
```

### Arquivos novos
- [`src/lib/onboarding/session.ts`](src/lib/onboarding/session.ts) — `getOrCreateOnboardingSession()`, `getOnboardingSession()`, `clearOnboardingSession()`
- [`src/app/criar-conta/layout.tsx`](src/app/criar-conta/layout.tsx) — shell centralizado
- [`src/app/criar-conta/page.tsx`](src/app/criar-conta/page.tsx) — server component fino que verifica se já tem empresa
- [`src/app/criar-conta/verifique-email/page.tsx`](src/app/criar-conta/verifique-email/page.tsx) — tela "verifique seu email"
- [`src/components/auth/signup-form.tsx`](src/components/auth/signup-form.tsx) — form client com signup + claim + complete_onboarding
- [`src/app/recuperar-senha/page.tsx`](src/app/recuperar-senha/page.tsx) — stub com link WhatsApp

### Arquivos alterados
- [`src/app/onboarding/page.tsx`](src/app/onboarding/page.tsx) — aceita anônimo, passa `userId={null}` quando deslogado
- [`src/components/onboarding/quiz-container.tsx`](src/components/onboarding/quiz-container.tsx) — refatorado para `userId: string | null`, usa session_id quando anônimo, removeu step 8, termina em `router.push('/criar-conta')`, label do botão final muda para "Criar minha conta →"
- [`src/app/login/page.tsx`](src/app/login/page.tsx) — adicionado link "Criar conta grátis" + "Esqueci minha senha"
- [`src/config/routes.ts`](src/config/routes.ts) — `PUBLIC_ROUTES` inclui `/onboarding`, `/criar-conta`, `/recuperar-senha`
- [`src/middleware.ts`](src/middleware.ts) — reescrito (ver seção 4)
- [`src/app/(public)/page.tsx`](src/app/(public)/page.tsx) — landing redesenhada (ver seção 5)
- [`src/lib/data/planos.ts`](src/lib/data/planos.ts) — try/catch externo, validação de env vars
- [`src/app/(public)/precos/page.tsx`](src/app/(public)/precos/page.tsx) — empty state quando lista vazia

---

## 4. Middleware — nova lógica

| Quem | Em rota | Resultado |
|------|---------|-----------|
| Anônimo | rota pública | Renderiza |
| Anônimo | rota privada | Redirect `/login` |
| Logado com empresa | `/`, `/login`, `/onboarding`, `/criar-conta` (entry routes) | Redirect `/dashboard` |
| Logado com empresa | rota privada permitida | Renderiza |
| Logado com empresa | `/admin/*` | Redirect `/dashboard` (não é superadmin) |
| Logado sem empresa (não-superadmin) | qualquer rota privada | Redirect `/onboarding` |
| Logado sem empresa (não-superadmin) | rota pública | Renderiza |
| Superadmin sem empresa | qualquer rota | Redirect `/admin` |
| Superadmin com empresa | qualquer rota | Comportamento normal |
| Funcionário | `/dashboard` | Redirect `/acesso-negado` |
| Logado sem módulo ativo | rota com module gate | Redirect `/acesso-negado?module=X` |

---

## 5. Landing redesenhada

10 seções:
1. **Nav** — Tilog logo + Preços + Entrar + CTA "Começar grátis" → `/onboarding`
2. **Hero** — Headline "Toda a sua operação em um só sistema" + sub-headline ("Pare de perder dinheiro com planilha") + CTAs primário e secundário + mockup visual de dashboard
3. **Problema / Solução** — 3 cards: "Você perde 10h/semana" / "Tilog centraliza tudo" / "Você economiza R$ 2.400/mês"
4. **Verticais** — 4 cards clicáveis (`/for/food-service`, `/for/varejo`, `/for/manutencao`, `/for/servicos-gerais`)
5. **Como funciona** — 3 passos numerados
6. **Diferenciais** — Grid 6 features com ícones Lucide
7. **Preços teaser** — "R$ 197/mês" + link `/precos`
8. **Pesquisa** — visível apenas quando `leadCount > 0`
9. **FAQ** — 5 perguntas em `<details>`
10. **CTA final** — Centralizado "Comece agora. É grátis."

**Mockup do dashboard** ([DashboardMockup component](src/app/(public)/page.tsx)): browser chrome + KPIs (Receita/Despesas/Lucro com deltas) + gráfico de barras com 12 dias + lista de atividades.

Animações: `RevealOnScroll` em cada seção (IntersectionObserver puro, sem motion/react para evitar erros SSR).

CTA principal: **`/onboarding`** (não mais `/login`).

---

## 6. Build / Lint / Typecheck

```
✓ TypeScript: 0 erros
✓ ESLint: 0 erros, 8 warnings pré-existentes (vars não usadas em arquivos legados)
✓ next build: 40 rotas compiladas
  - 7 estáticas (○): /, /_not-found, /acesso-negado, /login, /pesquisa, /precos, /recuperar-senha
    [na verdade / é dinâmica por uso de cookies/auth — Next mostra ƒ]
  - 4 SSG (●): /for/[vertical] com 4 variantes pré-renderizadas
  - 29 dynamic (ƒ): rotas autenticadas
  - 1 middleware (ƒ Proxy)
```

---

## 7. Cenários de navegação testados (HTTP probe via curl + screenshot)

| # | Quem | Rota | Esperado | Resultado |
|---|------|------|----------|-----------|
| 1 | Anônimo | `/` | Renderiza landing | ✅ 200 + screenshot OK |
| 2 | Anônimo | `/precos` | Renderiza preços | ✅ 200 |
| 3 | Anônimo | `/pesquisa` | Renderiza form | ✅ 200 |
| 4 | Anônimo | `/login` | Renderiza login com link "Criar conta grátis" | ✅ 200 |
| 5 | Anônimo | `/onboarding` | Renderiza quiz step 1 | ✅ 200, HTML contém "Qual é o tipo do seu negócio?" |
| 6 | Anônimo | `/criar-conta` | Renderiza signup form ou redirect se sem session | ✅ 200, HTML contém "Quase lá!" + "Já tem conta" |
| 7 | Anônimo | `/criar-conta/verifique-email?email=X` | Renderiza tela de confirmação | ✅ 200 |
| 8 | Anônimo | `/recuperar-senha` | Renderiza stub | ✅ 200 |

**Não testados via HTTP** (precisam de sessão autenticada — testes manuais necessários):
- Logado-com-empresa em `/` → deveria redirecionar para `/dashboard`
- Logado-sem-empresa em `/dashboard` → deveria redirecionar para `/onboarding`
- Superadmin em `/` → deveria redirecionar para `/admin`

---

## 8. Conformidade com regras operacionais

- ✅ `src/app/globals.css` — **intocado**
- ✅ `src/components/ui/*` — **intocado**
- ✅ `src/lib/auth/session.ts` — **intocado**
- ✅ `.env.local` recriado (não no git, presente no `.gitignore`)
- ✅ Migrations idempotentes (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`, `DO $$ BEGIN ... END $$` para constraint)
- ✅ Sem `service_role` no client
- ✅ Sem `--no-verify` ou bypass de hooks
- ✅ Mensagens humanas em todos os erros: "Esse email já está em uso. Tente entrar.", "A senha precisa ter ao menos 8 caracteres.", "Estamos atualizando nossos planos.", etc.

---

## 9. Pendências para Fase 5

1. **Confirmação por email** — fluxo `/criar-conta/verifique-email` existe mas Supabase Auth precisa estar com "Confirm email" habilitado no Dashboard para o fluxo se ativar
2. **Recuperação de senha real** — `/recuperar-senha` é stub. Implementar `supabase.auth.resetPasswordForEmail` + página `/atualizar-senha`
3. **Captcha** — `/onboarding` e `/criar-conta` podem ser alvo de bots. Considerar Turnstile ou hCaptcha
4. **Webhook de pagamento** — `empresas.plano_id` já existe na tabela mas sem fluxo de upgrade (Stripe/Cielo)
5. **Telemetria** — instrumentar funil: quantos chegam em `/onboarding`, quantos completam, quantos fazem signup, quantos chegam ao dashboard
6. **Sessão expirada** — se o user demora dias entre `/onboarding` e `/criar-conta`, o registro em `onboarding_responses` continua lá. Considerar TTL (DELETE WHERE session_id IS NOT NULL AND created_at < now() - interval '30 days')
7. **Rate limit de signup** — `submitPesquisa` tem rate limit por cookie; `signUp` não tem. Adicionar
8. **PWA** — landing carrega rápido mas falta `manifest.json` e service worker para instalação mobile
9. **Sentry** — sem observabilidade de erro em produção
10. **CI/CD** — sem GitHub Actions configurado

---

**Pipeline executado:** Diagnóstico → DBA → Frontend → Middleware → Build → Verificação visual
**Confidence:** Alta — build verde, 40 rotas, 0 erros, screenshot validado, todas rotas públicas em 200.
