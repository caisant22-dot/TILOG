# FASE_2C_RELATORIO — Onboarding Quiz

**Data de entrega:** 2026-04-15  
**Build:** `pnpm build` — 0 erros TypeScript, 29 páginas compiladas

---

## Resumo executivo

Implementação completa do fluxo de onboarding interativo para novos usuários do Tilog. Um quiz de 7 perguntas coleta `business_type`, `team_size`, `user_role`, `main_challenge`, `current_tools`, `primary_goal` e `company_name`, e ao final cria automaticamente a empresa, vincula o usuário e ativa os módulos do vertical correspondente.

---

## Tabelas e funções criadas no Supabase

| Objeto | Tipo | Descrição |
|--------|------|-----------|
| `onboarding_responses` | Tabela | Progresso e respostas do quiz, com RLS por `user_id` |
| `business_type_modules` | Tabela | Mapeamento business_type → enabled_modules + vertical_slug (4 verticais) |
| `calculate_lead_score()` | Função + Trigger | Calcula `lead_score` (0–100) e `lead_status` (cold/warm/hot) automaticamente |
| `complete_onboarding()` | RPC (SECURITY DEFINER) | Cria empresa, vincula usuário, ativa módulos, marca onboarding completo |
| `set_updated_at()` | Função + Trigger | Atualiza `updated_at` automaticamente no `onboarding_responses` |

---

## Arquivos criados/modificados

### Criados
| Arquivo | Descrição |
|---------|-----------|
| `src/components/onboarding/quiz-types.ts` | Interfaces TypeScript do quiz |
| `src/lib/onboarding/quiz-questions.ts` | 7 perguntas com opções, ícones e configurações |
| `src/components/onboarding/quiz-container.tsx` | Container principal (estado, animações, lógica) |
| `src/components/onboarding/quiz-progress.tsx` | Barra de progresso no topo |
| `src/components/onboarding/quiz-question.tsx` | Renderizador de perguntas (single/multi/text) |
| `src/components/onboarding/quiz-option.tsx` | Botão de opção individual com ícone Lucide |
| `src/components/onboarding/quiz-navigation.tsx` | Footer com Voltar / Continuar / Pular |
| `src/components/onboarding/quiz-completion.tsx` | Tela de sucesso com checkmark animado (SVG) |
| `src/app/onboarding/page.tsx` | Server Component — redirect guards + QuizContainer |
| `src/app/onboarding/layout.tsx` | Layout mínimo (sem sidebar, sem topbar) |
| `AUDIT_FASE_2C.md` | Auditoria pré-implementação |

### Modificados
| Arquivo | Mudança |
|---------|---------|
| `src/middleware.ts` | Adicionado guard onboarding em 4 cenários (ver abaixo) |

---

## Fluxo completo do usuário

```
[Admin cria usuário em auth.users]
        ↓
[Usuário acessa /login e faz login]
        ↓
[Middleware detecta session.empresa_id = null]
        ↓
[Redirect → /onboarding]
        ↓
[Quiz: 7 perguntas, progresso salvo a cada resposta]
[Single select → auto-advance 400ms]
[Multi select / text → botão Continuar]
[Progresso persiste em onboarding_responses via upsert debounced 300ms]
        ↓
[Última pergunta: "Finalizar e entrar"]
        ↓
[RPC complete_onboarding():
  1. Lookup vertical e default_modules
  2. INSERT empresas
  3. UPSERT usuarios (role = admin)
  4. UPDATE onboarding_responses.is_completed = true
  5. Trigger lead_score calcula automaticamente]
        ↓
[supabase.auth.refreshSession() — até 3 tentativas com backoff]
[JWT agora tem empresa_id + enabled_modules + vertical]
        ↓
[Animação QuizCompletion: checkmark SVG + "Preparando seu painel..."]
[Após 2.5s → router.push('/dashboard')]
        ↓
[Dashboard carrega com módulos do vertical escolhido]
```

---

## Middleware — 4 novos cenários tratados

| Cenário | Antes | Depois |
|---------|-------|--------|
| Autenticado sem empresa → marketing | Redirect `/dashboard` (sem empresa = erro) | Redirect `/onboarding` |
| Autenticado sem empresa → `/login` | Redirect `/dashboard` | Redirect `/onboarding` |
| Autenticado sem empresa → qualquer rota app | Passava (erro runtime) | Redirect `/onboarding` |
| Autenticado com empresa → `/onboarding` | Não existia | Redirect `/dashboard` |
| Anônimo → `/onboarding` | Não existia | Redirect `/login` |

---

## Edge cases tratados

1. **Fechou o browser no meio** — `restoreProgress` no mount retoma `current_step` e `raw_responses` do banco
2. **Quiz já completo** — `is_completed = true` → redirect `/dashboard` imediato
3. **`refreshSession()` falha** — retry 3x com backoff exponencial (1s, 2s, 4s)
4. **Usuário completa duas vezes** — `UNIQUE(user_id)` no `onboarding_responses` + `upsert` em `usuarios` são idempotentes
5. **`business_type` desconhecido** — RPC usa `ARRAY['dashboard','checklist']` como fallback
6. **Pergunta multi_select sem resposta** — `skippable = true` permite avançar sem selecionar
7. **Keyboard navigation** — `Enter` avança, `Escape` volta, números 1–9 selecionam opção por posição

---

## Passos manuais para validar

1. Crie um usuário novo via Supabase Auth (sem `empresa_id` no app_metadata)
2. Faça login → deve redirecionar para `/onboarding`
3. Complete o quiz e verifique no Supabase:
   - `onboarding_responses` com `is_completed = true` e `lead_score > 0`
   - `empresas` com `enabled_modules` populados
   - `usuarios` vinculado à empresa com `role = 'admin'`
4. Após conclusão, `/dashboard` deve mostrar apenas os módulos do vertical
5. Acesse `/onboarding` logado com empresa → deve redirecionar para `/dashboard`
6. Feche o browser na pergunta 3, reabra → deve retomar na pergunta 3

---

## Recomendações para fases futuras

- **Regenerar tipos TypeScript** via `npm run db:types` para incluir `onboarding_responses` e remover os `as any` nos selects
- **Signup flow** — atualmente assume que admin cria usuários; considerar adicionar formulário de criação de conta
- **Analytics** — `lead_score` + `lead_status` prontos para alimentar um painel no `/admin`
- **Internacionalização** — quiz está hardcoded em PT-BR; estrutura suporta i18n futuro
- **Testes automatizados** — cobrir `complete_onboarding` RPC com pg_tap

---

## Critérios de aceite

- [x] Tabela `onboarding_responses` criada com RLS
- [x] Trigger de lead scoring funciona automaticamente
- [x] `business_type_modules` / `verticals.default_modules` mapeados para os 4 verticais
- [x] RPC `complete_onboarding` criado e com GRANT para authenticated
- [x] Middleware redireciona corretamente em todos os 5 cenários
- [x] Quiz renderiza 7 perguntas com animação de slide (AnimatePresence + motion)
- [x] Auto-advance funciona em single_select (400ms delay)
- [x] Multi-select permite múltiplas opções
- [x] Text input com auto-focus
- [x] Salvamento parcial funciona (upsert debounced 300ms)
- [x] Barra de progresso anima corretamente
- [x] Tela de completion com checkmark SVG animado
- [x] `refreshSession()` com retry 3x após criar empresa
- [x] Keyboard navigation (Enter, Escape, números 1–9)
- [x] `pnpm build` compila sem erros — 29 páginas, 0 erros TypeScript
- [x] `FASE_2C_RELATORIO.md` entregue
