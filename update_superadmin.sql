-- 1. Alterar o CHECK constraint da coluna role na tabela usuarios
-- Primeiro, encontre o nome da constraint atual na tabela (geralmente é usuarios_role_check)
-- Você pode precisar ajustar o nome se for diferente, ou dropar e recriar.
-- Exemplo genérico para PostgreSQL no Supabase:

ALTER TABLE public.usuarios 
  DROP CONSTRAINT IF EXISTS usuarios_role_check;

ALTER TABLE public.usuarios 
  ADD CONSTRAINT usuarios_role_check 
  CHECK (role IN ('superadmin', 'admin', 'gestor', 'funcionario'));

-- 2. Atualizar o role do seu usuário existente
UPDATE public.usuarios 
SET role = 'superadmin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'caisant22@gmail.com');
