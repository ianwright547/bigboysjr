-- Add status column with default
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New';

-- Add email column (optional)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email text;

-- Add address column
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS address text;

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);

-- Index for sorting by created_at
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);