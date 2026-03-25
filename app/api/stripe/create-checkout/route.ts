import { NextResponse } from "next/server";
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { priceId } = await req.json();

  if (!priceId) {
    return new NextResponse('Price ID is required', { status: 400 });
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
        // Create customer if one doesn't exist
        const customer = await stripe.customers.create({
            email: user.email!,
            name: user.user_metadata?.full_name,
            metadata: {
                userId: user.id
            }
        });
        customerId = customer.id;
        
        await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id
      },
      subscription_data: {
        metadata: {
            userId: user.id
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error("Unknown error occurred", err);
    }
    return new NextResponse(err instanceof Error ? err.message : 'Internal Error', { status: 500 });
  }
}

