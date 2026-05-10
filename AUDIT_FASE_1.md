# AUDIT_FASE_1.md — Tilog Schema Audit
**Data:** 2026-04-13  
**Executor:** Claude Code (Fase 1 — Fundação)  
**Projeto:** juojqdyevwfcjplrwhtp (TILOG APP, us-east-1)

---

## 1. Inventário de Tabelas (31 tabelas no schema `public`)

| Tabela | RLS Habilitado | Policies | Tenant-scoped (`empresa_id`) | Observações |
|--------|---------------|----------|------------------------------|-------------|
| `categorias_produto` | ✅ | ✅ 1 policy | ✅ | OK |
| `checklists_templates` | ✅ | ✅ 1 policy | ✅ | OK |
| `conclusoes_treinamento` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | Policy via subquery em `conteudos_treinamento` |
| `contas_pagar` | ✅ | ✅ 1 policy | ✅ | OK |
| `contas_receber` | ✅ | ✅ 1 policy | ✅ | OK |
| `conteudos_treinamento` | ✅ | ✅ 1 policy | ✅ | OK |
| `ebitda_ajustes` | ✅ | ✅ 1 policy | ✅ | OK |
| **`empresas`** | ❌ **CRÍTICO** | ❌ nenhuma | N/A (É a tabela raiz) | Tabela principal completamente aberta |
| `escala_semanal` | ✅ | ✅ 1 policy | ✅ | OK |
| `evento_escala` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | Policy via subquery em `eventos` |
| `evento_estoque_planejado` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | Policy via subquery em `eventos` |
| `eventos` | ✅ | ✅ 1 policy | ✅ | OK |
| `execucoes_checklist` | ✅ | ✅ 1 policy | ✅ | OK |
| `fichas_tecnicas` | ✅ | ✅ 1 policy | ✅ | OK |
| `fornecedores` | ✅ | ✅ 1 policy | ✅ | OK |
| **`funcionarios`** | ❌ **CRÍTICO** | ❌ nenhuma | ✅ | Dados de funcionários completamente expostos |
| `ingredientes_ficha` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | Policy via subquery em `fichas_tecnicas` |
| `inventarios` | ✅ | ✅ 1 policy | ✅ | OK |
| `itens_execucao_checklist` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | OK — isolamento herdado |
| `itens_inventario` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | OK — isolamento herdado |
| `itens_pedido_compra` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | OK — isolamento herdado |
| `itens_venda` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | OK — isolamento herdado |
| `lancamentos_financeiros` | ✅ | ✅ 1 policy | ✅ | OK |
| **`metricas_adm`** | ❌ **CRÍTICO** | ❌ nenhuma | ✅ | Dados administrativos expostos |
| `movimentacoes_estoque` | ✅ | ✅ 1 policy | ✅ | OK |
| **`ordem_servico`** | ❌ **CRÍTICO** | ❌ nenhuma | ✅ | OS de todos os clientes visíveis entre si |
| `pedidos_compra` | ✅ | ✅ 1 policy | ✅ | OK |
| **`produtos`** | ❌ **CRÍTICO** | ❌ nenhuma | ✅ | Catálogo de produtos aberto |
| `tarefas_checklist` | ✅ | ✅ 1 policy (join) | ❌ sem empresa_id direta | OK — isolamento herdado |
| `usuarios` | ✅ | ✅ 1 policy | ✅ | Ver observações abaixo |
| `vendas` | ✅ | ✅ 1 policy | ✅ | OK |

---

## 2. ⚠️ CRÍTICO — Tabelas com RLS Desabilitado

Estas 5 tabelas têm dados de cliente e estão **completamente abertas** para qualquer usuário autenticado (ou anônimo, dependendo da configuração do Supabase):

```
❌ empresas          — tabela raiz, sem nenhuma proteção
❌ funcionarios      — dados pessoais (nome, cargo, contato)
❌ metricas_adm      — métricas internas da plataforma
❌ ordem_servico     — ordens de serviço de todos os clientes
❌ produtos          — catálogo de produtos/serviços
```

**Impacto:** Um usuário autenticado qualquer consegue fazer `SELECT * FROM produtos` e ver os dados de TODAS as empresas.

---

## 3. Problemas nas Policies Existentes

### 3.1 Função `get_auth_empresa_id()` é VOLATILE — Problema de Performance

```sql
-- Implementação atual (VOLATILE = re-executada por linha)
CREATE OR REPLACE FUNCTION public.get_auth_empresa_id()
RETURNS uuid SECURITY DEFINER AS $$
  SELECT empresa_id FROM usuarios WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql;
```

**Problema:** `VOLATILE` significa que o Postgres executa essa função **uma vez por linha** no resultado. Em uma tabela com 10.000 registros, ela é chamada 10.000 vezes, cada uma com um lookup em `usuarios`.

**Correto:** Usar `(SELECT auth.jwt()) -> 'app_metadata' ->> 'empresa_id'` (lê do JWT em cache) ou declarar a função como `STABLE`.

### 3.2 Todas as Policies Usam Role `{public}` em Vez de `{authenticated}`

```sql
-- Atual (errado)
CREATE POLICY "..." ON public.vendas
  FOR ALL TO public USING (...);

-- Correto
CREATE POLICY "..." ON public.vendas
  FOR ALL TO authenticated USING (...);
```

`public` inclui o role `anon` (usuários não autenticados). Funcionalmente seguro porque `auth.uid()` retorna NULL para anon e `get_auth_empresa_id()` retornaria NULL, mas é semanticamente incorreto e pode causar vazamentos em edge cases.

### 3.3 Policies `FOR ALL` Sem `WITH CHECK` — Risco de INSERT Bypass

```sql
-- Atual: sem with_check
CREATE POLICY "Vendas access policy" ON public.vendas
  FOR ALL TO public
  USING (empresa_id = get_auth_empresa_id());
```

Sem `WITH CHECK`, um usuário pode fazer `INSERT INTO vendas (empresa_id, ...) VALUES ('uuid-de-outra-empresa', ...)` e o banco **aceita** o INSERT (a cláusula USING não bloqueia INSERT). O dado fica "invisível" pelo SELECT (preso pela policy), mas existe no banco.

### 3.4 Nenhuma Policy de Superadmin Bypass

Nenhuma tabela tem uma policy do tipo:
```sql
CREATE POLICY "superadmin_all" ON public.<tabela>
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'user_role') = 'superadmin');
```

**Impacto:** O superadmin (caisant22@gmail.com) atualmente é exceção porque `get_auth_empresa_id()` retorna o `empresa_id` do próprio usuário na tabela `usuarios`. Mas se o superadmin não tiver `empresa_id` na tabela, retorna NULL e ele não vê nada. A migration do Fase 1 vai corrigir isso com policies explícitas.

### 3.5 Policy de `usuarios` Usa `empresa_id` — Bloqueia Cross-Company Admin

```sql
-- Atual
USING (empresa_id = get_auth_empresa_id())
```

O superadmin não consegue ver usuários de outras empresas. Precisa de bypass.

---

## 4. Inconsistências de Schema

### 4.1 ⚠️ CONFLITO CRÍTICO — Tabela `produtos` Schema Divergente

A tabela `produtos` foi **recriada** com schema simplificado (Fase "plus" anterior):

```
-- Schema atual no banco (simplificado)
id, empresa_id, nome, descricao, preco, categoria, ativo, created_at
```

Mas o schema original esperado pelo restante do sistema tinha:
```
codigo_interno, codigo_barras, categoria_id, unidade_medida, fator_conversao,
quantidade_atual, estoque_minimo, estoque_maximo, custo_unitario, preco_venda,
data_validade, fornecedor_id, item_cardapio, updated_at
```

**Tabelas que referenciam `produtos.id` e esperam o schema rico:**
- `fichas_tecnicas.produto_id`
- `ingredientes_ficha.insumo_id` (insumo = produto)
- `itens_inventario.produto_id`
- `itens_pedido_compra.produto_id`
- `itens_venda.produto_id`
- `movimentacoes_estoque.produto_id`
- `conteudos_treinamento.produto_id`

**Consequência:** O módulo de estoque, PDV, fichas técnicas, inventário e treinamento não funcionarão corretamente com o schema simplificado. Isso é **fora do escopo da Fase 1** (não corrigiremos aqui), mas está documentado.

### 4.2 `empresas.status` Conflito Semântico com `plan`

Coluna `status` atual tem `CHECK (status IN ('gratuito', 'pagante', 'cancelado', 'trial'))`. Isso mistura dois conceitos:
- **Estado da conta** (`ativo`, `cancelado`)
- **Plano de assinatura** (`gratuito`, `pagante`, `trial`)

Na Fase 1 vamos adicionar a coluna `plan TEXT` separada (`free`/`paid`), tornando `status` redundante a longo prazo. Na Fase 2 ou 3 deveria ser refatorado para separar `account_status` de `plan`.

### 4.3 `usuarios.id` Não Tem FK Explícita para `auth.users`

A tabela `usuarios` usa `id` como PK que deve ser o mesmo UUID do `auth.users.id`, mas não há constraint de FK declarada:

```sql
-- Não existe:
id UUID REFERENCES auth.users(id) ON DELETE CASCADE
```

Se um usuário for deletado do auth, o registro em `usuarios` fica órfão. Toda a função `get_auth_empresa_id()` e o hook dependem dessa integridade.

### 4.4 `funcionarios` ≠ `usuarios` — Dois Conceitos de "Pessoa"

O sistema tem duas tabelas para pessoas:
- `funcionarios` — funcionários operacionais (não têm login)
- `usuarios` — usuários com acesso ao sistema (têm login)

Isso é correto conceitualmente, mas há risco de duplicidade de dados (mesma pessoa em ambas as tabelas sem vínculo). A Fase 2 deveria considerar um campo `usuario_id` opcional em `funcionarios`.

### 4.5 Inconsistência de Nomenclatura: `data_entrada` vs `data_admissao`

- `usuarios.data_entrada` (TEXT nullable)
- `funcionarios.data_admissao` (DATE)

Mesmo conceito (data de ingresso na empresa), tipos e nomes diferentes.

### 4.6 Colunas sem Índice em Tabelas de Alta Consulta

Tabelas tenant-scoped sem índice em `empresa_id`:

| Tabela | Status |
|--------|--------|
| `vendas` | ❌ sem índice em empresa_id |
| `lancamentos_financeiros` | ❌ sem índice em empresa_id |
| `contas_pagar` | ❌ sem índice em empresa_id |
| `contas_receber` | ❌ sem índice em empresa_id |
| `movimentacoes_estoque` | ❌ sem índice em empresa_id |
| `pedidos_compra` | ❌ sem índice em empresa_id |
| `eventos` | ❌ sem índice em empresa_id |
| `escala_semanal` | ❌ sem índice em empresa_id |
| `inventarios` | ❌ sem índice em empresa_id |
| `checklists_templates` | ❌ sem índice em empresa_id |
| `execucoes_checklist` | ❌ sem índice em empresa_id |
| `ebitda_ajustes` | ❌ sem índice em empresa_id |
| `categorias_produto` | ❌ sem índice em empresa_id |
| `fornecedores` | ❌ sem índice em empresa_id |
| `conteudos_treinamento` | ❌ sem índice em empresa_id |

Com RLS habilitado e políticas baseadas em `empresa_id`, **cada SELECT vai fazer um seq scan** nessas tabelas. Para clientes com volume de dados, isso vai degradar rapidamente.

---

## 5. Funções Existentes

| Função | Tipo | Problema |
|--------|------|---------|
| `get_auth_empresa_id()` | `VOLATILE`, `SECURITY DEFINER` | Deveria ser `STABLE`. Performance crítica em RLS. |
| `set_updated_at()` | trigger function | OK |

---

## 6. Resumo Executivo dos Achados

### Críticos (bloqueiam segurança multi-tenant)
1. **5 tabelas sem RLS** — `empresas`, `funcionarios`, `metricas_adm`, `ordem_servico`, `produtos`
2. **Nenhuma policy de superadmin bypass** — superadmin pode ficar bloqueado
3. **Policies `FOR ALL` sem `WITH CHECK`** — permite INSERT em empresa alheia (dado fica invisível mas existe)

### Altos (degradam segurança ou performance)
4. **`get_auth_empresa_id()` VOLATILE** — re-executa por linha, N+1 no banco
5. **Policies aplicadas a `{public}`** — inclui role anon desnecessariamente
6. **Sem FK `usuarios.id` → `auth.users.id`** — risco de dados órfãos

### Médios (impactam consistência)
7. **Schema de `produtos` divergente** do esperado pelo restante do sistema
8. **`empresas.status` mistura semântica** de estado de conta com plano
9. **15 tabelas sem índice em `empresa_id`** — performance vai degradar com volume

### Baixos (manutenibilidade)
10. **`data_entrada` vs `data_admissao`** — inconsistência de nomenclatura
11. **`funcionarios` sem vínculo com `usuarios`** — risco de duplicidade de dados

---

## 7. O Que Será Corrigido na Fase 1

- ✅ Habilitar RLS nas 5 tabelas críticas
- ✅ Criar policies JWT-based com superadmin bypass
- ✅ Criar tabelas `verticals`, `modules`, `module_activation_rules`
- ✅ Evoluir `empresas` com colunas de feature flags
- ✅ Criar `custom_access_token_hook`
- ✅ Criar `has_module()`
- ✅ Índices em `empresa_id` nas tabelas críticas

## 8. O Que NÃO Será Corrigido na Fase 1 (Ver Relatório Final)

- ❌ Migrar policies existentes de `get_auth_empresa_id()` para JWT (escopo Fase 2)
- ❌ Adicionar `WITH CHECK` nas policies existentes (escopo Fase 2)
- ❌ Reconstruir schema rico de `produtos` (escopo Fase 2)
- ❌ Separar `empresas.status` de `plan` (escopo Fase 3)
- ❌ FK explícita `usuarios.id` → `auth.users.id` (requer análise de impacto)
- ❌ Vincular `funcionarios` a `usuarios` (escopo Fase 2)
