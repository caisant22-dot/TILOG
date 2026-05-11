# DIAGNOSTICO_BUGS — Tarefa 1 da Fase 4

**Data:** 2026-05-10
**Dev server:** http://localhost:3000 (webpack, sem Turbopack)

---

## Bug 1 — Todas as rotas retornavam HTTP 500

### Sintoma
Após o último deploy, `/`, `/precos`, `/pesquisa`, `/login`, `/onboarding` todas retornavam 500. Erro `Cannot find module '@swc/helpers/package.json'` e `next-flight-client-entry-loader: Module not found`.

### Causa raiz
1. `node_modules` foi descartado / sub-instalado: pacote `@swc/helpers` ausente
2. Cache `.next/dev/cache/webpack/**/0.pack.gz` corrompido após `git rm --cached -r .next` na sessão anterior — webpack tentava `stat` em arquivos inexistentes

### Correção
```bash
rm -rf .next
npm install
```
Após restart do dev server, `@swc/helpers/package.json` presente.

---

## Bug 2 — `/precos` em 500 após reinstalação

### Sintoma
`/precos` retornava 500 mesmo com dependências instaladas. Stack:
```
Error: supabaseUrl is required.
  at createPublicClient (src/lib/data/planos.ts:23:30)
  at getPlanos.revalidate (src/lib/data/planos.ts:32:22)
  at PrecosPage (src/app/(public)/precos/page.tsx:13:18)
```

### Causa raiz
**Arquivo `.env.local` ausente.** `process.env.NEXT_PUBLIC_SUPABASE_URL` retornava `undefined` → o cliente Supabase falhava na inicialização. Mesma causa do erro em `/onboarding` no middleware.

O `.env.local` provavelmente foi removido durante a limpeza do tracking git (`git rm --cached .env.local`) — o comando deveria preservar o arquivo no disco, mas em algum momento foi sobrescrito ou perdido.

### Correção
1. Recriei `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` obtidos via Supabase MCP (`get_project_url`, `get_publishable_keys`)
2. Restart do dev server

### Hardening adicional (Tarefa 7)
Mesmo com env vars presentes, o `getPlanos()` em `src/lib/data/planos.ts` **não tem try/catch externo**. Se o `createPublicClient()` lançar (env var inválida, network, etc) o `unstable_cache` propaga o erro e a página crasha. Vou adicionar fallback `return []` na Tarefa 7.

---

## Bug 3 — `/onboarding` redireciona para `/login` para usuário anônimo (CRÍTICO para Fase 4)

### Sintoma
`curl /onboarding` deslogado → 307 → `/login`.

### Causa raiz
`src/middleware.ts:36-40`:
```typescript
if (!user) {
  url.pathname = '/login'
  return NextResponse.redirect(url)
}
```
A regra atual é "rota app exige login". Mas `/onboarding` precisa ser **público** no novo fluxo PLG (usuário responde quiz antes de criar conta).

### Correção
Tarefa 5 — adicionar `/onboarding` em `PUBLIC_ROUTES` + permitir anônimo no `/onboarding`.

---

## Bug 4 — Fluxo de cadastro inexistente

### Sintoma
Landing → "Criar conta grátis" → `/login` (só faz signin, não signup). Não há rota `/criar-conta`.

### Causa raiz
O `LandingPage` (`src/app/(public)/page.tsx:60`) tem `<Link href="/login">Criar conta grátis</Link>`. Mas `/login` só tem o form de `signInWithPassword`. Não há fluxo de signup público.

### Correção
Tarefas 3 e 4 — criar `/criar-conta` (signup form), atualizar landing para apontar para `/onboarding`, atualizar `/login` com link "Criar conta grátis".

---

## Bug 5 — Onboarding polui `pesquisa_leads`

### Sintoma
Em `src/components/onboarding/quiz-container.tsx:147`, step 8 submete `submitPesquisa` com `contato = userId + '@tilog.app'` (email fake). Resultado: a tabela `pesquisa_leads` recebe leads com emails inválidos `@tilog.app`.

### Causa raiz
O step 8 do quiz combina duas coisas que não deviam estar juntas: (1) finalização do onboarding e (2) pesquisa de produto opcional. O email do usuário ainda não foi coletado nesse momento, então o código gera um fake.

### Correção
Tarefa 3 — REMOVER step 8 do quiz. Pesquisa de produto fica em `/pesquisa` separada, com email/WhatsApp coletado de verdade.

Tarefa 2.3 — DELETE leads com `email LIKE '%@tilog.app' AND origem = 'quiz'`.

---

## Bug 6 — Landing fraca de conversão (não bloqueante mas crítico)

### Sintoma
Hero genérico, CTA "Criar conta grátis" leva ao lugar errado, faltam:
- Mockup visual do produto
- Seção problema/solução
- Seção "Como funciona" (3 passos)
- Diferenciais detalhados
- CTA final centralizado

### Causa raiz
Página foi criada como MVP de marketing na Fase 3, faltava trabalhar copy e estrutura.

### Correção
Tarefa 6 — landing redesenhada com 10 seções (nav, hero+mockup, problema/solução, verticais, como funciona, diferenciais, preços teaser, FAQ, CTA final, footer).

---

## Resumo

| # | Bug | Severidade | Tarefa |
|---|-----|-----------|--------|
| 1 | `node_modules`/cache `.next` corrompidos | Crítico | Tarefa 1 ✅ |
| 2 | `.env.local` ausente | Crítico | Tarefa 1 ✅ |
| 3 | `/onboarding` não público | Crítico | Tarefa 5 |
| 4 | Fluxo de cadastro inexistente | Crítico | Tarefas 3+4 |
| 5 | Quiz polui `pesquisa_leads` | Alto | Tarefas 2.3+3 |
| 6 | Landing fraca | Médio | Tarefa 6 |
| 7 | `getPlanos` sem fallback exterior | Médio | Tarefa 7 |
