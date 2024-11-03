import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe"
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!)
  const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
  const signature  = req.headers.get("stripe-signature");
  const reqBuffer = Buffer.from(await req.arrayBuffer());

  let event

  try{
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature!,
      endpointSecret!
    );

    switch (event.type) {
      case "customer.subscription.created":
        const customerSubscriptionCreated = event.data.object;
        await supabase.from("profile").update({
          is_subscribed: true,
          interval: customerSubscriptionCreated.items.data[0].plan.interval
        }).eq("stripe_customer", event.data.object.customer);

        break;
      case "customer.subscription.deleted":
      const customerSubscriptionDeleted = event.data.object;
        break;
      case "customer.subscription.updated":
      const customerSubscriptionupdated = event.data.object;
        break;
    
      default:
        break;
    }
    console.log(event)
    return NextResponse.json({recieved: true });
  } catch (err: any) {
    return NextResponse.json(`webhook Error: ${err.message}`, { status: 401 });
  }
}

// const stripe = require("stripe")("sk_test_...");



