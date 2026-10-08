-- Adiciona a coluna confirmed_guests na tabela guest_list para salvar nome e sobrenome dos convidados confirmados
ALTER TABLE guest_list ADD COLUMN IF NOT EXISTS confirmed_guests JSONB DEFAULT '[]'::jsonb;
