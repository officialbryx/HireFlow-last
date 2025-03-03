import { serve } from "https://deno.land/std@0.177.0/http/server.js";
import { createClient } from "@supabase/supabase-js";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  try {
    const { email, code } = await req.json();

    // Send email using your preferred email service
    // For now, just console log the code
    console.log(`Reset code for ${email}: ${code}`);

    return new Response(
      JSON.stringify({ message: "Reset code sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
