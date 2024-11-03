import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import initiStripe from "stripe";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const query = req.nextUrl.searchParams.get("API_ROUTE_SECRET");
  if ( query !== process.env.API_ROUTE_SECRET ) {
    return NextResponse.json({
      message: "APIを叩く権限がありません。",
    });
  }

  const data = await req.json();
  // const { id, email } = data.record;
  const { id, email } = data;

  // console.log( data )
  console.log("data1 :: ", JSON.stringify(data!, null,1))
  console.log( `record :: ${data.record}`)
  console.log( `id :: ${id} ` )
  console.log( `email :: ${email} ` )
  console.log("AuthServerButton.tsx:", JSON.stringify(data!.email, null, 3));

  const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);
  const customer = await stripe.customers.create({
    email,
  });

  const { error } = await supabase
  .from("profile")
  .update({
    stripe_customer: customer.id,
  })
  .eq("id", id);

  // console.log(`id.:${customer.id}id.:${id}`)
  console.log(`error:${error?.message}`)

  return NextResponse.json({
    message: `stripe customer created: ${customer.id}`,
  });
}

