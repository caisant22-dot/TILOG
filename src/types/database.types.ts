export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          ip_address: string | null
          payload: Json | null
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          payload?: Json | null
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          payload?: Json | null
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      business_type_modules: {
        Row: {
          business_type: string
          enabled_modules: string[]
          id: string
          vertical_slug: string
        }
        Insert: {
          business_type: string
          enabled_modules: string[]
          id?: string
          vertical_slug: string
        }
        Update: {
          business_type?: string
          enabled_modules?: string[]
          id?: string
          vertical_slug?: string
        }
        Relationships: []
      }
      categorias_produto: {
        Row: {
          created_at: string | null
          empresa_id: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      checklists_templates: {
        Row: {
          created_at: string | null
          empresa_id: string
          id: string
          nome: string
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          tipo?: string | null
        }
        Relationships: []
      }
      conclusoes_treinamento: {
        Row: {
          conteudo_id: string
          created_at: string | null
          id: string
          usuario_id: string
        }
        Insert: {
          conteudo_id: string
          created_at?: string | null
          id?: string
          usuario_id: string
        }
        Update: {
          conteudo_id?: string
          created_at?: string | null
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conclusoes_treinamento_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos_treinamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conclusoes_treinamento_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_pagar: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          descricao: string
          empresa_id: string
          fornecedor_id: string | null
          id: string
          pedido_compra_id: string | null
          status: string
          usuario_id: string | null
          valor: number
          vencimento: string
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string | null
          descricao: string
          empresa_id: string
          fornecedor_id?: string | null
          id?: string
          pedido_compra_id?: string | null
          status: string
          usuario_id?: string | null
          valor: number
          vencimento: string
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string | null
          descricao?: string
          empresa_id?: string
          fornecedor_id?: string | null
          id?: string
          pedido_compra_id?: string | null
          status?: string
          usuario_id?: string | null
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_pagar_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_receber: {
        Row: {
          cliente_nome: string
          created_at: string | null
          data_recebimento: string | null
          descricao: string
          empresa_id: string
          id: string
          status: string
          usuario_id: string | null
          valor: number
          vencimento: string
          venda_id: string | null
        }
        Insert: {
          cliente_nome: string
          created_at?: string | null
          data_recebimento?: string | null
          descricao: string
          empresa_id: string
          id?: string
          status: string
          usuario_id?: string | null
          valor: number
          vencimento: string
          venda_id?: string | null
        }
        Update: {
          cliente_nome?: string
          created_at?: string | null
          data_recebimento?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          status?: string
          usuario_id?: string | null
          valor?: number
          vencimento?: string
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudos_treinamento: {
        Row: {
          arquivo_url: string | null
          categoria: string | null
          corpo: string | null
          created_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          produto_id: string | null
          tempo_estimado_min: number | null
          tipo: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          arquivo_url?: string | null
          categoria?: string | null
          corpo?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          produto_id?: string | null
          tempo_estimado_min?: number | null
          tipo: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          arquivo_url?: string | null
          categoria?: string | null
          corpo?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          produto_id?: string | null
          tempo_estimado_min?: number | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ebitda_ajustes: {
        Row: {
          amortizacao: number | null
          ano: number
          created_at: string | null
          depreciacao: number | null
          empresa_id: string
          id: string
          mes: number
          updated_at: string | null
        }
        Insert: {
          amortizacao?: number | null
          ano: number
          created_at?: string | null
          depreciacao?: number | null
          empresa_id: string
          id?: string
          mes: number
          updated_at?: string | null
        }
        Update: {
          amortizacao?: number | null
          ano?: number
          created_at?: string | null
          depreciacao?: number | null
          empresa_id?: string
          id?: string
          mes?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          account_status: string
          ativo: boolean | null
          cidade: string | null
          cnpj: string | null
          conversao_prevista: boolean | null
          custom_fields: Json
          data_cadastro: string | null
          email: string
          enabled_modules: string[]
          endereco: string | null
          estado: string | null
          id: string
          nome_empresa: string
          num_funcionarios: number | null
          observacoes: string | null
          onboarding_answers: Json
          onboarding_completed_at: string | null
          plan: string
          plano_id: string | null
          responsavel: string
          segmento: string | null
          sistema_personalizado: boolean | null
          status: string
          telefone: string | null
          ultimo_acesso: string | null
          vertical_id: string | null
        }
        Insert: {
          account_status?: string
          ativo?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          conversao_prevista?: boolean | null
          custom_fields?: Json
          data_cadastro?: string | null
          email: string
          enabled_modules?: string[]
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_empresa: string
          num_funcionarios?: number | null
          observacoes?: string | null
          onboarding_answers?: Json
          onboarding_completed_at?: string | null
          plan?: string
          plano_id?: string | null
          responsavel: string
          segmento?: string | null
          sistema_personalizado?: boolean | null
          status: string
          telefone?: string | null
          ultimo_acesso?: string | null
          vertical_id?: string | null
        }
        Update: {
          account_status?: string
          ativo?: boolean | null
          cidade?: string | null
          cnpj?: string | null
          conversao_prevista?: boolean | null
          custom_fields?: Json
          data_cadastro?: string | null
          email?: string
          enabled_modules?: string[]
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_empresa?: string
          num_funcionarios?: number | null
          observacoes?: string | null
          onboarding_answers?: Json
          onboarding_completed_at?: string | null
          plan?: string
          plano_id?: string | null
          responsavel?: string
          segmento?: string | null
          sistema_personalizado?: boolean | null
          status?: string
          telefone?: string | null
          ultimo_acesso?: string | null
          vertical_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresas_vertical_id_fkey"
            columns: ["vertical_id"]
            isOneToOne: false
            referencedRelation: "verticals"
            referencedColumns: ["id"]
          },
        ]
      }
      escala_semanal: {
        Row: {
          created_at: string | null
          data: string
          empresa_id: string
          funcao: string | null
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          data: string
          empresa_id: string
          funcao?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          data?: string
          empresa_id?: string
          funcao?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escala_semanal_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      evento_escala: {
        Row: {
          evento_id: string
          funcao: string | null
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          usuario_id: string
        }
        Insert: {
          evento_id: string
          funcao?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          usuario_id: string
        }
        Update: {
          evento_id?: string
          funcao?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_escala_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_escala_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      evento_estoque_planejado: {
        Row: {
          evento_id: string
          id: string
          produto_id: string
          quantidade_comprar: number | null
          quantidade_estoque: number | null
          quantidade_por_convidado: number | null
          quantidade_total: number | null
        }
        Insert: {
          evento_id: string
          id?: string
          produto_id: string
          quantidade_comprar?: number | null
          quantidade_estoque?: number | null
          quantidade_por_convidado?: number | null
          quantidade_total?: number | null
        }
        Update: {
          evento_id?: string
          id?: string
          produto_id?: string
          quantidade_comprar?: number | null
          quantidade_estoque?: number | null
          quantidade_por_convidado?: number | null
          quantidade_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "evento_estoque_planejado_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          created_at: string | null
          data: string
          empresa_id: string
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          local: string | null
          nome: string
          num_convidados: number | null
          observacoes: string | null
          status: string
          tipo: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          empresa_id: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          local?: string | null
          nome: string
          num_convidados?: number | null
          observacoes?: string | null
          status: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          empresa_id?: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          local?: string | null
          nome?: string
          num_convidados?: number | null
          observacoes?: string | null
          status?: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      execucoes_checklist: {
        Row: {
          concluido_em: string | null
          created_at: string | null
          empresa_id: string
          evento_id: string | null
          id: string
          status: string
          template_id: string
          turno: string | null
          usuario_id: string
        }
        Insert: {
          concluido_em?: string | null
          created_at?: string | null
          empresa_id: string
          evento_id?: string | null
          id?: string
          status: string
          template_id: string
          turno?: string | null
          usuario_id: string
        }
        Update: {
          concluido_em?: string | null
          created_at?: string | null
          empresa_id?: string
          evento_id?: string | null
          id?: string
          status?: string
          template_id?: string
          turno?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "execucoes_checklist_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execucoes_checklist_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklists_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execucoes_checklist_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      fichas_tecnicas: {
        Row: {
          created_at: string | null
          empresa_id: string
          foto_url: string | null
          id: string
          modo_preparo: string | null
          produto_id: string
          rendimento: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          foto_url?: string | null
          id?: string
          modo_preparo?: string | null
          produto_id: string
          rendimento?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          foto_url?: string | null
          id?: string
          modo_preparo?: string | null
          produto_id?: string
          rendimento?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          ativo: boolean | null
          cnpj: string | null
          contato: string | null
          created_at: string | null
          email: string | null
          empresa_id: string
          id: string
          nome: string
          prazo_entrega_dias: number | null
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cnpj?: string | null
          contato?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          nome: string
          prazo_entrega_dias?: number | null
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string | null
          contato?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          prazo_entrega_dias?: number | null
          telefone?: string | null
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          created_at: string | null
          data_admissao: string | null
          email: string | null
          empresa_id: string
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          data_admissao?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          data_admissao?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredientes_ficha: {
        Row: {
          ficha_tecnica_id: string
          id: string
          insumo_id: string
          quantidade: number
          unidade: string
        }
        Insert: {
          ficha_tecnica_id: string
          id?: string
          insumo_id: string
          quantidade: number
          unidade: string
        }
        Update: {
          ficha_tecnica_id?: string
          id?: string
          insumo_id?: string
          quantidade?: number
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredientes_ficha_ficha_tecnica_id_fkey"
            columns: ["ficha_tecnica_id"]
            isOneToOne: false
            referencedRelation: "fichas_tecnicas"
            referencedColumns: ["id"]
          },
        ]
      }
      inventarios: {
        Row: {
          aprovado_em: string | null
          created_at: string | null
          empresa_id: string
          id: string
          status: string
          usuario_id: string | null
        }
        Insert: {
          aprovado_em?: string | null
          created_at?: string | null
          empresa_id: string
          id?: string
          status: string
          usuario_id?: string | null
        }
        Update: {
          aprovado_em?: string | null
          created_at?: string | null
          empresa_id?: string
          id?: string
          status?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_execucao_checklist: {
        Row: {
          concluido: boolean | null
          concluido_em: string | null
          concluido_por: string | null
          execucao_id: string
          id: string
          tarefa_id: string
        }
        Insert: {
          concluido?: boolean | null
          concluido_em?: string | null
          concluido_por?: string | null
          execucao_id: string
          id?: string
          tarefa_id: string
        }
        Update: {
          concluido?: boolean | null
          concluido_em?: string | null
          concluido_por?: string | null
          execucao_id?: string
          id?: string
          tarefa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_execucao_checklist_concluido_por_fkey"
            columns: ["concluido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_execucao_checklist_execucao_id_fkey"
            columns: ["execucao_id"]
            isOneToOne: false
            referencedRelation: "execucoes_checklist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_execucao_checklist_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas_checklist"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_inventario: {
        Row: {
          ajuste_aplicado: boolean | null
          id: string
          inventario_id: string
          produto_id: string
          quantidade_contada: number | null
          quantidade_sistema: number
          variacao: number | null
        }
        Insert: {
          ajuste_aplicado?: boolean | null
          id?: string
          inventario_id: string
          produto_id: string
          quantidade_contada?: number | null
          quantidade_sistema: number
          variacao?: number | null
        }
        Update: {
          ajuste_aplicado?: boolean | null
          id?: string
          inventario_id?: string
          produto_id?: string
          quantidade_contada?: number | null
          quantidade_sistema?: number
          variacao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_inventario_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "inventarios"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido_compra: {
        Row: {
          custo_unitario: number
          id: string
          pedido_id: string
          produto_id: string | null
          quantidade: number
          subtotal: number
        }
        Insert: {
          custo_unitario: number
          id?: string
          pedido_id: string
          produto_id?: string | null
          quantidade: number
          subtotal: number
        }
        Update: {
          custo_unitario?: number
          id?: string
          pedido_id?: string
          produto_id?: string | null
          quantidade?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_compra_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_venda: {
        Row: {
          custo_unitario: number
          id: string
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Insert: {
          custo_unitario: number
          id?: string
          preco_unitario: number
          produto_id?: string | null
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Update: {
          custo_unitario?: number
          id?: string
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          subtotal?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_venda_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_financeiros: {
        Row: {
          categoria_financeira: string | null
          conta_bancaria: string | null
          created_at: string | null
          data: string
          descricao: string
          empresa_id: string
          forma_pagamento: string | null
          id: string
          observacoes: string | null
          tipo: string
          usuario_id: string | null
          valor: number
          venda_id: string | null
        }
        Insert: {
          categoria_financeira?: string | null
          conta_bancaria?: string | null
          created_at?: string | null
          data: string
          descricao: string
          empresa_id: string
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          tipo: string
          usuario_id?: string | null
          valor: number
          venda_id?: string | null
        }
        Update: {
          categoria_financeira?: string | null
          conta_bancaria?: string | null
          created_at?: string | null
          data?: string
          descricao?: string
          empresa_id?: string
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          tipo?: string
          usuario_id?: string | null
          valor?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_financeiros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_adm: {
        Row: {
          created_at: string | null
          empresa_id: string
          id: string
          mes_referencia: string
          nota_engajamento: number | null
          num_acessos: number | null
          receita_estimada: number | null
          total_os_abertas: number | null
          total_os_concluidas: number | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: string
          id?: string
          mes_referencia: string
          nota_engajamento?: number | null
          num_acessos?: number | null
          receita_estimada?: number | null
          total_os_abertas?: number | null
          total_os_concluidas?: number | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: string
          id?: string
          mes_referencia?: string
          nota_engajamento?: number | null
          num_acessos?: number | null
          receita_estimada?: number | null
          total_os_abertas?: number | null
          total_os_concluidas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_adm_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      module_activation_rules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          modules_to_activate: string[]
          name: string
          priority: number
          rule_condition: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          modules_to_activate: string[]
          name: string
          priority?: number
          rule_condition: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          modules_to_activate?: string[]
          name?: string
          priority?: number
          rule_condition?: Json
        }
        Relationships: []
      }
      modules: {
        Row: {
          category: string
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean
          required_plan: string
          route: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          category: string
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean
          required_plan?: string
          route?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          category?: string
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          required_plan?: string
          route?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      movimentacoes_estoque: {
        Row: {
          created_at: string | null
          custo_unitario: number | null
          empresa_id: string
          evento_id: string | null
          id: string
          motivo: string | null
          produto_id: string
          quantidade: number
          referencia_id: string | null
          referencia_tipo: string | null
          tipo: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          custo_unitario?: number | null
          empresa_id: string
          evento_id?: string | null
          id?: string
          motivo?: string | null
          produto_id: string
          quantidade: number
          referencia_id?: string | null
          referencia_tipo?: string | null
          tipo: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          custo_unitario?: number | null
          empresa_id?: string
          evento_id?: string | null
          id?: string
          motivo?: string | null
          produto_id?: string
          quantidade?: number
          referencia_id?: string | null
          referencia_tipo?: string | null
          tipo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          business_type: string | null
          company_name: string | null
          completed_at: string | null
          created_at: string
          current_step: number
          current_tools: string[] | null
          id: string
          is_completed: boolean
          lead_score: number
          lead_status: string
          main_challenge: string | null
          primary_goal: string | null
          raw_responses: Json
          session_id: string | null
          team_size: string | null
          updated_at: string
          user_id: string | null
          user_role_answer: string | null
        }
        Insert: {
          business_type?: string | null
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: number
          current_tools?: string[] | null
          id?: string
          is_completed?: boolean
          lead_score?: number
          lead_status?: string
          main_challenge?: string | null
          primary_goal?: string | null
          raw_responses?: Json
          session_id?: string | null
          team_size?: string | null
          updated_at?: string
          user_id?: string | null
          user_role_answer?: string | null
        }
        Update: {
          business_type?: string | null
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          current_step?: number
          current_tools?: string[] | null
          id?: string
          is_completed?: boolean
          lead_score?: number
          lead_status?: string
          main_challenge?: string | null
          primary_goal?: string | null
          raw_responses?: Json
          session_id?: string | null
          team_size?: string | null
          updated_at?: string
          user_id?: string | null
          user_role_answer?: string | null
        }
        Relationships: []
      }
      ordem_servico: {
        Row: {
          cliente_final: string | null
          data_abertura: string | null
          data_conclusao: string | null
          descricao: string
          empresa_id: string
          funcionario_id: string | null
          id: string
          observacoes: string | null
          status: string | null
          valor: number | null
        }
        Insert: {
          cliente_final?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          descricao: string
          empresa_id: string
          funcionario_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          valor?: number | null
        }
        Update: {
          cliente_final?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          descricao?: string
          empresa_id?: string
          funcionario_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ordem_servico_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_servico_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_compra: {
        Row: {
          created_at: string | null
          data_prevista_entrega: string | null
          empresa_id: string
          evento_id: string | null
          fornecedor_id: string | null
          id: string
          status: string
          usuario_id: string | null
          valor_total: number
        }
        Insert: {
          created_at?: string | null
          data_prevista_entrega?: string | null
          empresa_id: string
          evento_id?: string | null
          fornecedor_id?: string | null
          id?: string
          status: string
          usuario_id?: string | null
          valor_total?: number
        }
        Update: {
          created_at?: string | null
          data_prevista_entrega?: string | null
          empresa_id?: string
          evento_id?: string | null
          fornecedor_id?: string | null
          id?: string
          status?: string
          usuario_id?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_compra_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_compra_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pesquisa_leads: {
        Row: {
          aceita_entrevista: boolean | null
          created_at: string | null
          destaque_landing: boolean | null
          email: string
          empresa_id: string | null
          faixa_preco: string | null
          ferramentas_atuais: string[] | null
          id: string
          maior_dor: string
          nome: string
          origem: string | null
          pagaria_por: string | null
          segmento: string
          tamanho_empresa: string | null
          whatsapp: string | null
        }
        Insert: {
          aceita_entrevista?: boolean | null
          created_at?: string | null
          destaque_landing?: boolean | null
          email: string
          empresa_id?: string | null
          faixa_preco?: string | null
          ferramentas_atuais?: string[] | null
          id?: string
          maior_dor: string
          nome: string
          origem?: string | null
          pagaria_por?: string | null
          segmento: string
          tamanho_empresa?: string | null
          whatsapp?: string | null
        }
        Update: {
          aceita_entrevista?: boolean | null
          created_at?: string | null
          destaque_landing?: boolean | null
          email?: string
          empresa_id?: string | null
          faixa_preco?: string | null
          ferramentas_atuais?: string[] | null
          id?: string
          maior_dor?: string
          nome?: string
          origem?: string | null
          pagaria_por?: string | null
          segmento?: string
          tamanho_empresa?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pesquisa_leads_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          cta_label: string | null
          cta_url: string | null
          descricao: string | null
          destaque: boolean | null
          features: Json | null
          id: string
          nome: string
          ordem: number | null
          preco_anual: number | null
          preco_mensal: number | null
          required_plan: string | null
          slug: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          cta_label?: string | null
          cta_url?: string | null
          descricao?: string | null
          destaque?: boolean | null
          features?: Json | null
          id?: string
          nome: string
          ordem?: number | null
          preco_anual?: number | null
          preco_mensal?: number | null
          required_plan?: string | null
          slug: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          cta_label?: string | null
          cta_url?: string | null
          descricao?: string | null
          destaque?: boolean | null
          features?: Json | null
          id?: string
          nome?: string
          ordem?: number | null
          preco_anual?: number | null
          preco_mensal?: number | null
          required_plan?: string | null
          slug?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          categoria_id: string | null
          codigo_barras: string | null
          codigo_interno: string | null
          created_at: string | null
          custo_unitario: number | null
          data_validade: string | null
          descricao: string | null
          empresa_id: string
          estoque_maximo: number | null
          estoque_minimo: number | null
          fator_conversao: number | null
          fornecedor_id: string | null
          id: string
          item_cardapio: boolean | null
          nome: string
          preco: number | null
          preco_venda: number | null
          quantidade_atual: number | null
          unidade_medida: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          categoria_id?: string | null
          codigo_barras?: string | null
          codigo_interno?: string | null
          created_at?: string | null
          custo_unitario?: number | null
          data_validade?: string | null
          descricao?: string | null
          empresa_id: string
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          fator_conversao?: number | null
          fornecedor_id?: string | null
          id?: string
          item_cardapio?: boolean | null
          nome: string
          preco?: number | null
          preco_venda?: number | null
          quantidade_atual?: number | null
          unidade_medida?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          categoria_id?: string | null
          codigo_barras?: string | null
          codigo_interno?: string | null
          created_at?: string | null
          custo_unitario?: number | null
          data_validade?: string | null
          descricao?: string | null
          empresa_id?: string
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          fator_conversao?: number | null
          fornecedor_id?: string | null
          id?: string
          item_cardapio?: boolean | null
          nome?: string
          preco?: number | null
          preco_venda?: number | null
          quantidade_atual?: number | null
          unidade_medida?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas_checklist: {
        Row: {
          descricao: string
          id: string
          obrigatorio: boolean | null
          ordem: number
          setor: string | null
          template_id: string
        }
        Insert: {
          descricao: string
          id?: string
          obrigatorio?: boolean | null
          ordem?: number
          setor?: string | null
          template_id: string
        }
        Update: {
          descricao?: string
          id?: string
          obrigatorio?: boolean | null
          ordem?: number
          setor?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_checklist_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklists_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          cargo: string
          created_at: string | null
          data_entrada: string | null
          empresa_id: string | null
          id: string
          nome: string
          role: string
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo: string
          created_at?: string | null
          data_entrada?: string | null
          empresa_id?: string | null
          id: string
          nome: string
          role: string
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string
          created_at?: string | null
          data_entrada?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          role?: string
          telefone?: string | null
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente_endereco: string | null
          cliente_nome: string | null
          created_at: string | null
          desconto_tipo: string | null
          desconto_valor: number | null
          empresa_id: string
          evento_id: string | null
          forma_pagamento: string | null
          id: string
          status: string
          tipo: string
          troco: number | null
          usuario_id: string | null
          valor_recebido: number | null
          valor_total: number
        }
        Insert: {
          cliente_endereco?: string | null
          cliente_nome?: string | null
          created_at?: string | null
          desconto_tipo?: string | null
          desconto_valor?: number | null
          empresa_id: string
          evento_id?: string | null
          forma_pagamento?: string | null
          id?: string
          status: string
          tipo: string
          troco?: number | null
          usuario_id?: string | null
          valor_recebido?: number | null
          valor_total: number
        }
        Update: {
          cliente_endereco?: string | null
          cliente_nome?: string | null
          created_at?: string | null
          desconto_tipo?: string | null
          desconto_valor?: number | null
          empresa_id?: string
          evento_id?: string | null
          forma_pagamento?: string | null
          id?: string
          status?: string
          tipo?: string
          troco?: number | null
          usuario_id?: string | null
          valor_recebido?: number | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      verticals: {
        Row: {
          created_at: string
          default_modules: string[]
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_modules?: string[]
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_modules?: string[]
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_onboarding_session: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: undefined
      }
      complete_onboarding: {
        Args: {
          p_business_type: string
          p_company_name: string
          p_onboarding_answers: Json
          p_user_id: string
        }
        Returns: Json
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_auth_empresa_id: { Args: never; Returns: string }
      has_module: { Args: { required: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
