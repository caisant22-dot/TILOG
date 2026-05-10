# AUDIT_FASE_2C — Onboarding Quiz

**Data:** 2026-04-15  
**Scope:** Fase 2C — Onboarding interativo (quiz de setup) para novos usuários

---

## 1. Estado atual do codebase

### Autenticação e sessão
| Item | Status | Observação |
|------|--------|------------|
| `TilogSession.empresaId` | ✅ Implementado | Pode ser `null` — base do fluxo de onboarding |
| `getSession()` / `requireSession()` | ✅ Implementado | Lê do JWT, zero DB queries |
| `session.userId` | ✅ Disponível | Necessário para o `QuizContainer` server component |

### Middleware atual
| Cenário | Comportamento atual | Comportamento desejado |
|---------|---------------------|------------------------|
| Anônimo → rota app | Redireciona `/login` | ✅ Mantém |
| Autenticado + `empresaId=null` → rota app | Passa (sem gating) | ⚠️ **Deve redirecionar `/onboarding`** |
| Autenticado + `empresaId=null` → `/login` | Redireciona `/dashboard` | ⚠️ **Deve redirecionar `/onboarding`** |
| Autenticado + `empresaId≠null` → `/onboarding` | Não tratado | **Deve redirecionar `/dashboard`** |
| Rota `/onboarding` | Não existe | **Criar como rota pública-autenticada** |

### Login page
- Login-only: sem signup (novo usuário criado manualmente via admin ou invite)
- Redirect hardcoded pra `/dashboard` (role ≠ `funcionario`)
- **Não precisa de signup flow** — o fluxo assume que usuário já existe em `auth.users`
- Redirect será corrigido pelo middleware (se `empresaId=null` → `/onboarding`)

### Supabase — tabelas existentes relevantes
| Tabela | Relevância |
|--------|------------|
| `empresas` | Destino final — `complete_onboarding` cria linha aqui |
| `usuarios` | Vincula usuário à empresa após onboarding |
| `verticals` | Mapeia `business_type` → `enabled_modules` |

**Tabelas a criar:**
- `onboarding_responses` — progresso do quiz
- `module_activation_rules` — regras por business_type

### Componentes UI disponíveis
| Componente | Path | Estado |
|------------|------|--------|
| `Button` | `@/components/ui/button` | ✅ Com `asChild`, `loading` state |
| `Input` | `@/components/ui/input` | ✅ Com `label`, `error`, `hint` |
| `FadeIn` | `@/components/motion/fade-in` | ✅ Motion wrapper |
| `AnimatePresence` | `@/components/motion/presence` | ✅ Re-export de `motion/react` |
| `RevealOnScroll` | `@/components/motion/reveal-on-scroll` | CSS-only, não relevante aqui |

### Diretórios a criar
```
src/app/onboarding/            → page.tsx + layout.tsx
src/components/onboarding/     → todos os sub-componentes do quiz
src/lib/onboarding/            → quiz-questions.ts
```

---

## 2. Migrations necessárias

### Migration 1: `onboarding_responses`
```sql
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(user_id),
  ...
);
```

### Migration 2: `module_activation_rules`
```sql
CREATE TABLE IF NOT EXISTS public.module_activation_rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_type text NOT NULL,
  enabled_modules text[] NOT NULL,
  vertical_slug text NOT NULL
);
```

### Migration 3: Lead scoring trigger
Trigger em `onboarding_responses` que calcula `lead_score` e `lead_status` automaticamente baseado nas respostas.

### Migration 4: RPC `complete_onboarding`
Função PostgreSQL que:
1. Cria linha na `empresas`
2. Cria/atualiza linha na `usuarios`
3. Ativa módulos baseado no `business_type`
4. Marca `onboarding_responses.is_completed = true`
5. Chama `set_claim` / JWT hook para atualizar `app_metadata`

---

## 3. Gaps identificados

| # | Gap | Impacto | Fix |
|---|-----|---------|-----|
| 1 | Middleware não redireciona `empresaId=null` | Alto | Adicionar check no middleware |
| 2 | `onboarding_responses` não existe | Bloqueador | Migration 1 |
| 3 | `complete_onboarding` RPC não existe | Bloqueador | Migration 4 |
| 4 | `module_activation_rules` não existe | Bloqueador | Migration 2 |
| 5 | `/onboarding` não existe | Bloqueador | Criar page + layout |
| 6 | Componentes onboarding inexistentes | Bloqueador | Criar todos |

---

## 4. Decisões de design

- **Sem signup flow**: login page não muda; onboarding é pós-signup (admin cria usuários)
- **Progresso persistido**: upsert em `onboarding_responses` a cada resposta
- **Auto-advance**: `single_select` avança automaticamente após 400ms
- **JWT refresh**: `supabase.auth.refreshSession()` logo após `complete_onboarding`
- **Retry em JWT**: 3 tentativas com backoff de 1s/2s/4s se refreshSession falhar
- **Motion**: usar `motion/react` diretamente no `QuizContainer` (client component)

---

## 5. Critérios de aceite auditados

Todos os critérios listados na spec são tecnicamente viáveis com a stack atual. Prosseguindo com a implementação.
