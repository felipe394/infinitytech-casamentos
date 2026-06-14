import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find user by email AND matching reset token
    const { data: user, error: findError } = await supabaseAdmin
      .from("login")
      .select("id, username, reset_token, reset_token_expires_at")
      .eq("username", email)
      .eq("reset_token", token)
      .maybeSingle();

    if (findError) {
      console.error("DB find error:", findError.message);
      return new Response(
        JSON.stringify({ error: "Erro interno. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Token inválido ou e-mail incorreto. Solicite um novo link de recuperação." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiry
    if (!user.reset_token_expires_at || new Date(user.reset_token_expires_at) < new Date()) {
      // Clear expired token
      await supabaseAdmin
        .from("login")
        .update({ reset_token: null, reset_token_expires_at: null })
        .eq("id", user.id);

      return new Response(
        JSON.stringify({ error: "O link de recuperação expirou. Solicite um novo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update password and clear reset token
    const { error: updateError } = await supabaseAdmin
      .from("login")
      .update({
        password: newPassword,
        reset_token: null,
        reset_token_expires_at: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Password update error:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Erro ao atualizar a senha. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Password reset successful for:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Senha atualizada com sucesso!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("reset-password error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao redefinir a senha.", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
