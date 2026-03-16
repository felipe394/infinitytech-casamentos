import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10"

serve(async (req) => {
  // Mercado Pago only sends POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Webhook received:', JSON.stringify(body))

    // Mercado Pago sends: { action: "payment.updated", type: "payment", data: { id: "123" } }
    const paymentId = body.data?.id
    const isPayment = body.type === 'payment' || body.action?.startsWith('payment.')

    if (isPayment && paymentId) {
      const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')

      if (!accessToken) {
        throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured')
      }

      // 1. Fetch full payment details from Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      if (!mpResponse.ok) {
        console.error('MP API error:', mpResponse.status)
        return new Response(JSON.stringify({ received: true }), { status: 200 })
      }

      const paymentInfo = await mpResponse.json()
      console.log(`Payment ${paymentId}: status=${paymentInfo.status}, method=${paymentInfo.payment_method_id}`)

      // 2. Upsert into Supabase payments table
      const { error } = await supabase
        .from('payments')
        .upsert({
          mercado_pago_id: paymentInfo.id?.toString(),
          status: paymentInfo.status,
          amount: paymentInfo.transaction_amount,
          guest_email: paymentInfo.payer?.email,
          gift_name: paymentInfo.description,
          payment_method: paymentInfo.payment_method_id,
          created_at: paymentInfo.date_created,
        }, { onConflict: 'mercado_pago_id' })

      if (error) {
        console.error('Supabase upsert error:', error.message)
      } else {
        console.log(`Payment ${paymentId} saved to DB with status: ${paymentInfo.status}`)
      }
    }

    // Always return 200 to Mercado Pago so it doesn't retry
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('Webhook processing error:', error.message)
    // Still return 200 to prevent retries
    return new Response(JSON.stringify({ received: true, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
