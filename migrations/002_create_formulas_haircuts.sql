-- migrations/002_create_formulas_haircuts.sql
CREATE TABLE IF NOT EXISTS formulas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  brand text,
  base_shade text,
  developer_strength text,
  ratio text,
  additives text,
  notes text,
  generated_by text,
  prompt text,
  result jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS haircut_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  style text,
  face_shape text,
  steps jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);
