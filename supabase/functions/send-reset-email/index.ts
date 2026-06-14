import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, origin } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "E-mail é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user exists in login table
    const { data: user, error: userError } = await supabaseAdmin
      .from("login")
      .select("id, username")
      .eq("username", email)
      .maybeSingle();

    // Always return success (security - don't reveal if email exists)
    if (!user || userError) {
      console.log("User not found or error:", userError?.message);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate secure token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token directly in the login table
    const { error: updateError } = await supabaseAdmin
      .from("login")
      .update({
        reset_token: token,
        reset_token_expires_at: expiresAt.toISOString(),
      })
      .eq("username", email);

    if (updateError) {
      console.error("Error saving token:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Erro interno ao gerar o token de recuperação." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build reset link
    const siteOrigin = origin || "https://casamento.infinitytechservices.com.br";
    const resetLink = `${siteOrigin}/reset-senha?token=${token}`;

    // Styled HTML email
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinir Senha — Julia & Felipe</title>
</head>
<body style="margin:0;padding:0;background-color:#fff1f2;font-family:'Georgia',Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff1f2;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(159,18,57,0.12);">

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#9f1239 0%,#be185d 100%);padding:40px 40px 32px;text-align:center;">
                    <div style="font-size:40px;line-height:1;margin-bottom:12px;">💍</div>
                    <h1 style="margin:0 0 4px;color:#ffffff;font-size:28px;font-weight:normal;font-family:'Georgia',serif;">Julia &amp; Felipe</h1>
                    <p style="margin:0;color:rgba(255,255,255,0.65);font-size:13px;letter-spacing:1px;text-transform:uppercase;">Área Administrativa</p>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;font-size:22px;color:#111827;font-weight:normal;font-family:'Georgia',serif;">🔐 Redefinição de Senha</h2>
                    <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.7;">
                      Recebemos uma solicitação para redefinir a senha da conta:
                    </p>
                    <p style="margin:0 0 24px;color:#9f1239;font-size:15px;font-weight:600;">${email}</p>
                    <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.7;">
                      Clique no botão abaixo para criar uma nova senha. O link é válido por <strong style="color:#374151;">1 hora</strong>.
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom:32px;">
                          <a href="${resetLink}"
                             style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#e11d48,#be185d);color:#ffffff;text-decoration:none;border-radius:14px;font-size:16px;font-weight:600;font-family:Arial,sans-serif;box-shadow:0 4px 16px rgba(190,24,93,0.35);">
                            Redefinir minha senha →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback link -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-top:1px solid #f3f4f6;padding-top:24px;">
                          <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">Se o botão não funcionar, copie e cole o link no navegador:</p>
                          <p style="margin:0;word-break:break-all;">
                            <a href="${resetLink}" style="color:#be185d;font-size:12px;">${resetLink}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#fef2f2;padding:16px 40px;border-top:1px solid #fecdd3;">
                    <p style="margin:0;color:#991b1b;font-size:13px;line-height:1.6;">
                      ⚠️ Se você <strong>não</strong> solicitou esta redefinição, ignore este e-mail.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#fdf2f4;padding:20px 40px;text-align:center;border-top:1px solid #fce7eb;">
                    <p style="margin:0;color:#d1aab5;font-size:12px;">© ${new Date().getFullYear()} Julia &amp; Felipe · Casamento 08/11/2026</p>
                    <p style="margin:4px 0 0;color:#d1aab5;font-size:11px;">
                      Desenvolvido por <a href="https://infinitytechservices.com.br" style="color:#be185d;text-decoration:none;">InfinityTech Services</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Send via Gmail SMTP
    const smtpUser = Deno.env.get("SMTP_USER") ?? "";
    const smtpPass = Deno.env.get("SMTP_PASS") ?? "";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Julia & Felipe 💍" <${smtpUser}>`,
      to: email,
      subject: "🔐 Redefinição de Senha — Área Administrativa",
      html: emailHtml,
      text: `Redefinição de Senha\n\nAcesse o link abaixo para redefinir sua senha (válido por 1 hora):\n${resetLink}\n\nSe não foi você, ignore este e-mail.`,
    });

    console.log("Reset email sent to:", email);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-reset-email error:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao enviar o e-mail de recuperação.", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
