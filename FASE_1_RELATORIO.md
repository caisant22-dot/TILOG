# Fase 1 — Fundação Multi-Vertical: Relatório Final

**Data:** 2026-04-13  
**Status:** ✅ Concluído — build sem erros

---

## Resumo Executivo

A Fase 1 estabeleceu a infraestrutura de segurança e multi-tenancy do Tilog:

- RLS habilitado nas 5 tabelas que estavam expostas
- 15 índices de performance criados em `empresa_id`
- Schema multi-vertical com `verticals`, `modules` e feature flags em `empresas`
- Custom Access Token Hook injetando contexto no JWT (empresa, role, módulos, plano)
- Helpers tipados de sessão disponíveis em todo o server-side
- Middleware com module gating lendo do JWT (sem DB queries extras)

---

## Etapas Executadas

### Etapa 1 — Auditoria do Schema
- Inventário de 31 tabelas e seus status de RLS
- Descoberta: 5 tabelas críticas sem RLS (`empresas`, `funcionarios`, `metricas_adm`, `ordem_servico`, `produtos`)
- `get_auth_empresa_id()` marcada como VOLATILE (re-executada por linha)
- 15 tabelas sem índice em `empresa_id`
- Resultado: `AUDIT_FASE_1.md`

### Etapa 2 — Migration: RLS nas tabelas expostas
**Arquivo:** `supabase/migrations/20260413150000_enable_rls_phase1.sql`

- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` nas 5 tabelas
- Políticas JWT-based: `(SELECT auth.jwt()) -> 'app_metadata' ->> 'empresa_id'`
- Superadmin bypass em todas as tabelas
- `WITH CHECK` em INSERT/UPDATE para impedir escrita cross-tenant
- 15 índices `CREATE INDEX IF NOT EXISTS` em `empresa_id`

### Etapa 3 — Migration: Fundação Multi-Vertical
**Arquivo:** `supabase/migrations/20260413160000_multi_vertical_foundation.sql`

Tabelas criadas:
- `verticals` — 4 verticais: `food_service`, `varejo`, `manutencao`, `servicos_gerais`
- `modules` — 28 módulos com `slug`, `route`, `required_plan`, `category`, `sort_order`
- `module_activation_rules` — estrutura para regras automáticas (Fase 2)

Colunas adicionadas a `empresas`:
- `vertical_id UUID` → FK para `verticals`
- `enabled_modules TEXT[]` → feature flags da empresa
- `plan TEXT CHECK ('free','paid')` → plano atual
- `onboarding_answers JSONB` → respostas do quiz (Fase 2)
- `onboarding_completed_at TIMESTAMPTZ`
- `custom_fields JSONB`

Migração de dados:
- `plan` sincronizado com `status` existente
- Vertical `manutencao` atribuída às empresas de teste
- `enabled_modules` populado com os módulos padrão do vertical

### Etapa 4 — Migration: Custom Access Token Hook
**Arquivo:** `supabase/migrations/20260413170000_auth_hooks_and_helpers.sql`

- `custom_access_token_hook(event JSONB)` — STABLE SECURITY DEFINER
  - Injeta no JWT: `empresa_id`, `user_role`, `enabled_modules`, `plan`, `vertical`
  - GRANT exclusivo para `supabase_auth_admin`
- `has_module(required TEXT) RETURNS BOOLEAN` — STABLE SECURITY DEFINER
  - Helper para RLS e server-side checks
- `get_auth_empresa_id()` — atualizado de VOLATILE para STABLE

> ⚠️ **Ação manual necessária:** Ativar o hook no Supabase Dashboard  
> Authentication → Hooks → Custom Access Token Hook → `public.custom_access_token_hook`

### Etapa 5 — TypeScript Types
- `src/types/database.types.ts` regenerado via `npm run db:types`
- Inclui todas as tabelas, relacionamentos e funções RPC tipados

### Etapa 6 — Helpers de Sessão
**Arquivo:** `src/lib/auth/session.ts`

```typescript
export type UserRole = 'superadmin' | 'admin' | 'gestor' | 'funcionario' | 'anonymous'
export type Plan = 'free' | 'paid'

export interface TilogSession {
  userId: string
  email: string
  empresaId: string | null
  role: UserRole
  enabledModules: string[]
  plan: Plan
  vertical: string | null
}

getSession()       → TilogSession | null   // lê JWT, sem DB query
requireSession()   → TilogSession          // redireciona para /login
hasModule(slug)    → boolean
requireModule(slug) → TilogSession         // redireciona para /acesso-negado?module=
requireRole(...roles) → TilogSession       // redireciona para /acesso-negado
```

### Etapa 7 — Mapa de Rotas → Módulos
**Arquivo:** `src/config/routes.ts`

- `ROUTE_MODULE_MAP` — 29 rotas mapeadas para slugs de módulo
- `getRequiredModule(pathname)` — longest-prefix matching

### Etapa 8 — Middleware com Module Gating
**Arquivo:** `src/middleware.ts`

Lógica em camadas:
1. Rotas públicas (`/`, `/login`, `/acesso-negado`) — sem gating
2. Autenticação obrigatória — redireciona para `/login`
3. `/admin/*` — exclusivo para `superadmin`
4. Role guards — rotas de gestor/admin verificadas por role
5. **Module gating** — lê `enabled_modules` do JWT, redireciona para `/acesso-negado?module=<slug>`

Zero queries ao banco de dados — tudo lido do JWT.

### Etapa 9 — Página /acesso-negado
**Arquivo:** `src/app/acesso-negado/page.tsx`

- Lê `?module=` da query string
- Exibe mensagem contextual: "módulo não disponível" vs "acesso restrito"
- CTA para dashboard e configurações (quando module-gated)

---

## Arquitetura de Segurança Resultante

```
Request
  └── middleware.ts
        ├── JWT app_metadata (empresa_id, user_role, enabled_modules, plan)
        ├── Role guard (superadmin / admin / gestor / funcionario)
        └── Module gate → /acesso-negado?module=<slug>

Server Component
  └── requireSession() / requireModule() / requireRole()
        └── lê JWT via supabase.auth.getSession()

Database Query
  └── RLS Policy
        └── (SELECT auth.jwt()) -> 'app_metadata' ->> 'empresa_id'
              ├── Tenant isolation (empresa_id)
              └── Superadmin bypass
```

---

## Build

```
✓ Compiled successfully
✓ TypeScript (0 errors)
✓ 22 páginas geradas (estático + dinâmico)
```

---

## O Que Fica para Fase 2

| Item | Motivo |
|------|--------|
| Migrar políticas existentes para JWT | ~26 tabelas ainda usam `get_auth_empresa_id()` |
| Quiz de onboarding | Popula `onboarding_answers` + ativa módulos via `module_activation_rules` |
| `module_activation_rules` populadas | Fase 2 define as regras automáticas |
| `produtos` schema completo | Divergência com fichas_técnicas/inventário documentada |
| Testes de integração RLS | Validar isolamento cross-tenant com usuários reais |
