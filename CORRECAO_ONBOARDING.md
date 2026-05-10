# CORRECAO_ONBOARDING — 2026-05-09

## Diagnóstico encontrado

### `app_metadata` antes da correção (conta `caisant22@gmail.com`)
```json
{ "provider": "email", "providers": ["email"] }
```
**Faltavam:** `user_role`, `empresa_id`, `enabled_modules`, `plan`, `vertical`. JWT não tinha NENHUM claim do Tilog.

### Assinatura real da RPC `complete_onboarding`
```
(p_user_id uuid, p_company_name text, p_business_type text, p_onboarding_answers jsonb)
SECURITY DEFINER, owner=postgres
```
RPC já estava bem implementada (idempotência via `FOR UPDATE`, `EXCEPTION WHEN unique_violation` + `WHEN OTHERS`). Não precisou ser reescrita.

### Estado real do usuário no banco (antes)
```
auth.users.id           = 07f09c61-fe06-4ff2-899e-13684e22ca2d
public.usuarios.role    = superadmin
public.usuarios.empresa_id = c6f0118d-262d-430c-ac8d-e04540de3e6b  ← ÓRFÃ
public.empresas WHERE id = c6f0118d... → 0 linhas (FK órfã, empresa não existe)
```

### Hook `custom_access_token_hook`
- **Função existe** em `public` (`STABLE SECURITY DEFINER`)
- Lê `usuarios` e enriquece JWT com `empresa_id`, `user_role`, `enabled_modules`, `plan`, `vertical`
- **Estava DESATIVADO no Dashboard** — usuário ativou durante esta sessão

### Policies encontradas
- 38 tabelas com `rowsecurity = true` ✅
- `empresas` tinha `superadmin_all` (ALL) + `tenant_select` + `tenant_update`, **faltava `INSERT`** explícito
- Demais tabelas críticas (`usuarios`, `onboarding_responses`, `verticals`, `business_type_modules`, `funcionarios`, `metricas_adm`, `ordem_servico`, `produtos`) com RLS + bypass de superadmin corretos

### Bug no middleware (`src/middleware.ts`)
Superadmin sem empresa era redirecionado para `/onboarding` em vez de `/admin` — loop infinito após login.

---

## Correções aplicadas

### Banco de dados — migration `superadmin_support_and_empresas_insert_policy`
1. `ALTER TABLE public.usuarios ALTER COLUMN empresa_id DROP NOT NULL` — superadmins não precisam de empresa própria
2. `CREATE POLICY empresas_superadmin_insert ON empresas FOR INSERT TO authenticated WITH CHECK (user_role = 'superadmin')` — fecha a lacuna de INSERT explícito
3. `COMMENT ON COLUMN usuarios.empresa_id` — documenta NULL para superadmin

### Banco de dados — limpeza de dados
- `UPDATE public.usuarios SET empresa_id = NULL WHERE id = '07f09c61...'` — remove FK órfã para empresa inexistente
- `DELETE FROM public.onboarding_responses WHERE user_id = '07f09c61...'` — limpa progresso travado

### Código — `src/middleware.ts`
- Adicionada constante `isSuperadmin = userRole === 'superadmin'`
- Novo branch: superadmin sem empresa → `/admin` (antes do redirect para `/onboarding`)
- Branch existente de `/onboarding` agora só dispara para não-superadmin
- Lógica de `/admin/*` simplificada com `isSuperadmin`

### Código — `src/components/onboarding/quiz-container.tsx`
- Novo estado `completionError: string | null`
- `completeOnboarding`: log de erro real (`console.error`), mensagens humanas em `setCompletionError`, fallback de "empresa criada mas refresh falhou"
- Novo bloco JSX antes do step 8 — banner vermelho com mensagem + link "Tentar acessar o dashboard mesmo assim"

### Manual (feito pelo usuário)
- ✅ Custom Access Token Hook ativado no Dashboard

---

## Fluxo testado

### Build / Typecheck
- `npx tsc --noEmit` → 0 erros ✅
- Preview server sem erros nos logs ✅

### Visual
- `/onboarding` ainda renderiza step 1 (esperado — JWT antigo do usuário ainda em cache, sem `user_role`)
- Sem erros de console no preview

### Próximo teste (manual, requer ação do usuário)
1. **Logout completo** em `/login` ou via DevTools → Application → Cookies → limpar `sb-*`
2. Login novamente com `caisant22@gmail.com`
3. Hook agora ativo → JWT terá `user_role='superadmin'`, `empresa_id=null`
4. Middleware corrigido → redireciona `/` para `/admin` (não para `/onboarding`)
5. Verificar `/admin`, `/admin/leads`, `/admin/empresas`

### Para usuários NÃO-superadmin (fluxo normal)
- Login → middleware vê `empresa_id=null` + `user_role≠superadmin` → `/onboarding`
- Completa quiz → RPC cria empresa → `refreshSession` → JWT novo via hook → `/dashboard`
- Se RPC falhar, banner vermelho aparece com mensagem real do erro + opção de bypass

---

## O que ainda precisa ser feito

1. **Validação manual do fluxo end-to-end** — usuário fazer logout/login e confirmar que cai em `/admin` direto
2. **Criar usuário de teste não-superadmin** — para validar fluxo de onboarding completo (criar empresa + redirect para `/dashboard`)
3. **Limpar referência da empresa fantasma** `c6f0118d-262d-430c-ac8d-e04540de3e6b` — se aparecer em outras tabelas (logs, metrics), considerar cascade
4. **Discrepância step 6 vs 8** — RPC seta `current_step=6` ao concluir, mas quiz tem 8 steps. Não é bloqueante, mas vale alinhar (estética semântica)
5. **Cache do `getPlanos`** — quando o vertical/plan do superadmin mudar, considerar `revalidateTag('planos')`
6. **Remover `.env.local` do git** — initial commit incluiu `.env.local`, criar `.gitignore` antes de push para remoto

---

**Migrations aplicadas neste turno:** `superadmin_support_and_empresas_insert_policy`
**Arquivos editados:** `src/middleware.ts`, `src/components/onboarding/quiz-container.tsx`
**Build status:** 0 erros TypeScript
