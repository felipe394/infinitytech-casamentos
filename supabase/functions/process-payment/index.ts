import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { formData, description } = await req.json()
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')

    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN not set')
    }

    // 1. Send payment to Mercado Pago
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()
    console.log('Mercado Pago response:', JSON.stringify({ status: data.status, id: data.id }))

    // 2. Save payment to Supabase DB
    if (data.id) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error: dbError } = await supabase
        .from('payments')
        .upsert({
          mercado_pago_id: data.id.toString(),
          status: data.status || 'unknown',
          amount: data.transaction_amount || formData?.transaction_amount,
          guest_email: data.payer?.email || formData?.payer?.email,
          gift_name: description || data.description,
          payment_method: data.payment_method_id || formData?.payment_method_id,
          created_at: data.date_created || new Date().toISOString(),
        }, { onConflict: 'mercado_pago_id' })

      if (dbError) {
        console.error('DB save error:', dbError.message)
      } else {
        console.log(`Payment ${data.id} saved to DB: ${data.status}`)
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.status,
    })

  } catch (error: any) {
    console.error('Process payment error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
