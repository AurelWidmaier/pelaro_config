import { createClient } from '@supabase/supabase-js'

/**
 * Supabase-Projekt „config“: Produktkatalog, Einstellungen, Besuchsstatistik
 * und Admin-Login. Der Publishable Key ist öffentlich – geschützt wird über
 * Row Level Security in der Datenbank. Per .env überschreibbar.
 */
const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? 'https://gktikiqhdlkrorpfuwps.supabase.co'
const SUPABASE_KEY: string =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_hl7TNv7QlY0HuoV1UOgHeQ_mk5Xho2R'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/** Bucket für im Admin hochgeladene Produktbilder (öffentlich lesbar). */
export const IMAGE_BUCKET = 'product-images'
