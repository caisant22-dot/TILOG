# CORRECAO_PRE_FASE3 — Relatório de correções antes da Fase 3

**Data:** 2026-04-15  
**Build:** `npx next build` — 0 erros TypeScript, 29 páginas compiladas

---

## Problemas corrigidos

### 1. RPC `complete_onboarding` falhava com `unique_violation`

**Causa raiz:**  
A tabela `empresas` tem `UNIQUE(email)`. O RPC tentava `INSERT INTO empresas (email, ...) VALUES (p_email, ...)` onde `p_email` vinha do JWT do usuário. Em execuções repetidas (recarregamento de página, retry manual) ou quando dois usuários compartilhavam o mesmo e-mail de teste, o INSERT lançava `unique_violation` e a função abortava sem criar vínculo.

**O que foi corrigido:**  
- Adicionado bloco `EXCEPTION WHEN unique_violation` com fallback: se o e-mail já existe, gera endereço UUID (`user_id::text || '@tilog.app'`) e reinsere.  
- Adicionado **idempotency check** no início da RPC: se o usuário já possui `empresa_id` em `public.usuarios`, retorna os dados existentes sem reexecutar nenhum INSERT.  
- Trocado `UPDATE onboarding_responses SET is_completed = true` por `INSERT ... ON CONFLICT DO UPDATE` — cobre o caso em que a linha ainda não existe (registro sem progresso salvo).

```sql
-- Idempotency check
SELECT empresa_id INTO v_empresa_id FROM public.usuarios WHERE id = p_user_id;
IF v_empresa_id IS NOT NULL THEN
  -- retorna dados já existentes sem reprocessar
END IF;

-- Unique email guard
BEGIN
  INSERT INTO empresas (email, ...) VALUES (p_email, ...) RETURNING id INTO v_empresa_id;
EXCEPTION WHEN unique_violation THEN
  INSERT INTO empresas (email, ...) VALUES (p_user_id::text || '@tilog.app', ...)
    RETURNING id INTO v_empresa_id;
END;
```

---

### 2. Loop infinito após completar o quiz

**Causa raiz:**  
Ao finalizar o quiz, `router.push('/dashboard')` era chamado antes do JWT ser atualizado. O middleware lia `app_metadata.empresa_id = null` (JWT antigo ainda em cookie), redirecionava para `/onboarding`, que no `useEffect` de restauração detectava `is_completed = true` e chamava `router.replace('/dashboard')` novamente — criando um loop infinito.

**O que foi corrigido:**  
No `QuizContainer.useEffect` de restauração, quando `data.is_completed === true`:

```typescript
// Antes — causava loop:
router.replace('/dashboard');

// Depois — força reload completo para buscar JWT atualizado:
await supabase.auth.refreshSession();
window.location.href = '/dashboard';
```

`window.location.href` dispara uma navegação completa (não client-side), fazendo o browser buscar novos cookies de sessão com o JWT já atualizado antes de o middleware avaliar a rota.

---

### 3. `router.push('/dashboard')` após login não redirecionava

**Causa raiz:**  
O código original usava `router.refresh()` após o login bem-sucedido. `router.refresh()` revalida os Server Components da página atual (`/login`) mas não navega — o usuário ficava preso na tela de login sem feedback.

**O que foi corrigido:**  
```typescript
// Antes:
router.refresh();

// Depois:
router.push('/dashboard'); // middleware decide: onboarding ou dashboard
```

Após signup com sessão imediata (e-mail de confirmação desabilitado):
```typescript
if (signupData.session) {
  router.push('/onboarding');
} else {
  setSignupDone(true); // mostra tela de verificação
}
```

---

### 4. Link "Voltar para o site" ausente / inoperante

**Causa raiz:**  
O botão era renderizado com `<button onClick={() => router.back()}>`. Em acesso direto à URL `/login` (sem histórico anterior), `router.back()` não tinha para onde voltar — o link ficava invisível ou não funcionava.

**O que foi corrigido:**  
Substituído por ancora HTML simples:
```tsx
<a href="/" className="fixed top-4 left-4 ...">
  ← Voltar para o site
</a>
```

Âncora sempre navega para `/` independentemente do histórico.

---

### 5. React error #143 no build estático de `/for/[vertical]`

**Causa raiz:**  
`Button` com `asChild=true` renderizava `<Slot>{null}{children}</Slot>`. `React.Children.count([null, element])` retorna 2 → `SlotClone` chamava `React.Children.only(null)` → lançava erro #143 (`react.react-server.production.js`) durante a prerenderização estática.

**O que foi corrigido em `src/components/ui/button.tsx`:**  
Split dos caminhos de render:
```tsx
if (asChild) {
  return (
    <Comp ref={ref} className={sharedClass} {...props}>
      {children}  {/* Slot recebe SOMENTE children — sem spinner null */}
    </Comp>
  );
}

return (
  <button ref={ref} disabled={disabled || loading} className={sharedClass} {...props}>
    {loading && <svg className="animate-spin ...">...</svg>}
    {children}
  </button>
);
```

---

### 6. `RevealOnScroll` causava erro SSR com `motion/react`

**Causa raiz:**  
`motion/react` v12 com `useScroll`/`useMotionValue` durante SSR das páginas de marketing lançava o mesmo erro #143 no prerender.

**O que foi corrigido em `src/components/motion/reveal-on-scroll.tsx`:**  
Removida dependência de `motion/react`. Substituído por `IntersectionObserver` com CSS transitions via inline styles:
```tsx
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      observer.unobserve(el);
    }
  }, { threshold: 0.1 });
  observer.observe(el);
}, []);
```

---

## Cenários de navegação — PASS/FAIL

| # | Quem | Destino | Resultado esperado | Status |
|---|------|---------|-------------------|--------|
| 1 | Anônimo | `/` | Renderiza marketing | ✅ PASS |
| 2 | Anônimo | `/precos` | Renderiza marketing | ✅ PASS |
| 3 | Anônimo | `/login` | Renderiza login | ✅ PASS |
| 4 | Anônimo | `/dashboard` | Redirect → `/login` | ✅ PASS |
| 5 | Anônimo | `/onboarding` | Redirect → `/login` | ✅ PASS |
| 6 | Auth sem empresa | `/` | Redirect → `/onboarding` | ✅ PASS |
| 7 | Auth sem empresa | `/login` | Redirect → `/onboarding` | ✅ PASS |
| 8 | Auth sem empresa | `/dashboard` | Redirect → `/onboarding` | ✅ PASS |
| 9 | Auth sem empresa | `/onboarding` | Renderiza quiz | ✅ PASS |
| 10 | Auth com empresa (admin) | `/` | Redirect → `/dashboard` | ✅ PASS |
| 11 | Auth com empresa (admin) | `/login` | Redirect → `/dashboard` | ✅ PASS |
| 12 | Auth com empresa (admin) | `/onboarding` | Redirect → `/dashboard` | ✅ PASS |
| 13 | Auth com empresa (funcionario) | `/login` | Redirect → `/checklist` | ✅ PASS |
| 14 | Auth com empresa (funcionario) | `/dashboard` | Redirect → `/acesso-negado` | ✅ PASS |
| 15 | Auth com empresa (admin) | `/admin/*` | Redirect → `/dashboard` | ✅ PASS |
| 16 | Superadmin | `/admin/*` | Renderiza admin | ✅ PASS |

---

## Mockups do browser-mockup.tsx — conteúdo implementado

### Dashboard
- **4 KPI cards**: RECEITA, DESPESAS, LUCRO, PEDIDOS com deltas coloridos (↑↓)
- **Gráfico de barras**: 12 meses (Jan–Dez) com barras SVG proporcionais + labels de valor
- **Gráfico donut**: fatias SVG para Alimentação/Bebidas/Delivery com legenda
- **Tabela de dados**: cabeçalho + 5 linhas com nome, valor, quantidade, status badge colorido

### Cardápio
- **Tabs de categoria**: Entradas / Pratos / Sobremesas / Bebidas
- **Grid de pratos**: 6 cards com placeholder de imagem, nome, descrição, preço
- **Matriz BCG**: grade 2×2 (Estrela/Interrogação/Vaca Leiteira/Abacaxi) com exemplo de item

### Estoque
- **3 KPI cards**: Itens em estoque, Valor total, Itens críticos
- **Tabela detalhada**: produto, categoria, barra de progresso de nível, quantidade, valor, badge de status (OK/Baixo/Alerta)

### Ordem de Serviço
- **3 cards de contagem**: Abertas / Em Andamento / Concluídas
- **Lista de OS**: 5 linhas com número, cliente, tipo de serviço, badge de status colorido (Aberto/Em andamento/Concluído)

### Escala
- **Cards resumo da semana**: total de turnos, total de horas, tamanho da equipe
- **Grade de turnos**: 5 colaboradores × 7 dias, blocos preenchidos (escuro) ou vazio — representação visual de presença

### PDV
- **Painel esquerdo**: grid 6 produtos com nome e preço, botões de adicionar ao pedido
- **Painel direito**: lista de itens do pedido, subtotal, taxa de serviço (10%), total destacado, botão "Cobrar" em preto

---

## Build status

```
Route (app)
├ ○ /                   (Static)
├ ● /for/[vertical]     (SSG — 4 variantes pré-renderizadas)
├ ○ /login              (Static)
├ ƒ /onboarding         (Dynamic)
└ ... 25 outras rotas

✓ 29 páginas compiladas
✓ 0 erros TypeScript
✓ 0 erros de build
```

---

## Critérios de aceite

- [x] `complete_onboarding` RPC idempotente e sem `unique_violation`
- [x] Loop `/onboarding` → `/dashboard` eliminado via `window.location.href`
- [x] `router.push` após login e signup funcionam corretamente
- [x] Link "Voltar para o site" usa `<a href="/">` — sempre funcional
- [x] React error #143 resolvido — `Button asChild` não passa null para Slot
- [x] `RevealOnScroll` sem `motion/react` — sem erro SSR
- [x] 16 cenários de navegação validados manualmente
- [x] 6 variantes de browser mockup com conteúdo esquemático detalhado
- [x] `npx next build` — 29 páginas, 0 erros TypeScript
- [x] `CORRECAO_PRE_FASE3.md` entregue
