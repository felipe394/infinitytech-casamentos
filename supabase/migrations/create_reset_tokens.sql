-- Adiciona colunas de reset de senha na tabela login existente
-- Execute no Supabase Dashboard > SQL Editor > New Query

ALTER TABLE login 
  ADD COLUMN IF NOT EXISTS reset_token text,
  ADD COLUMN IF NOT EXISTS reset_token_expires_at timestamptz;
