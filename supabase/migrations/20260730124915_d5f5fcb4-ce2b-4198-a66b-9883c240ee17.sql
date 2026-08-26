CREATE OR REPLACE FUNCTION public.notify_lead_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  svc_key text;
BEGIN
  BEGIN
    SELECT decrypted_secret INTO svc_key FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key';
    IF svc_key IS NULL THEN
      RAISE WARNING 'notify_lead_created: missing service key';
      RETURN NULL;
    END IF;

    PERFORM net.http_post(
      url := 'https://aubvchncxxkjysshrexd.supabase.co/functions/v1/notify-new-lead',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || svc_key
      ),
      body := jsonb_build_object(
        'skipInsert', true,
        'leadId', NEW.id,
        'name', NEW.name,
        'phone', NEW.phone,
        'email', NEW.email,
        'address', NEW.address,
        'notes', NEW.message,
        'zipCode', NEW.zip_code,
        'pricingMethod', NEW.pricing_method,
        'selectedItems', NEW.selected_items,
        'loadSize', NEW.load_size,
        'addOns', NEW.add_ons,
        'totalPrice', NEW.total_price,
        'requestType', NEW.request_type,
        'bookingDate', NEW.booking_date,
        'timeSlot', NEW.time_slot,
        'idempotencyKey', NEW.idempotency_key
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_lead_created failed: %', SQLERRM;
  END;
  RETURN NULL;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.notify_lead_created() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_notify_lead_created ON public.leads;
CREATE TRIGGER trg_notify_lead_created
AFTER INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.notify_lead_created();