import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://whemjrcfitscftsntorn.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZW1qcmNmaXRzY2Z0c250b3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwODk4ODEsImV4cCI6MjA1MzY2NTg4MX0.rJIFae9m5-GJL0aXx0UBO2gc-rDvpYelYcSphJIKenc";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});
