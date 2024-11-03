import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { priceId: string } } 
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const {data: stripe_customer_data} = await supabase
  .from("profile")
  .select("stripe_customer")
  .eq("id", user?.id)
  .single();

  return NextResponse.json({
    ...user,
    stripe_customer_data,
  })
};