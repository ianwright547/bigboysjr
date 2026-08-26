
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS leads_idempotency_key_unique
  ON public.leads (idempotency_key)
  WHERE idempotency_key IS NOT NULL;
