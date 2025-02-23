import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://amkjtemaecxqfrwtskha.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFta2p0ZW1hZWN4cWZyd3Rza2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxODgyOTksImV4cCI6MjA1NTc2NDI5OX0.zI5hbm9CZtmVMmGf2zU41Jly1xEl0_65vQ-KEUQr2Qw";

export const supabase = createClient(supabaseUrl, supabaseKey);
