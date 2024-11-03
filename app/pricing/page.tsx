import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createServerComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import initstripe, { Stripe } from "stripe";
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import SubscriptionButton from '@/components/checkout/SubscriptionButton';


interface Plan {
  id: string;
  name: string;
  price: string | null;
  interval: Stripe.Price.Recurring.Interval | null;
  currency: string;
}

const getAllPlans = async (): Promise<Plan[]> => {
  const stripe = new initstripe(process.env.STRIPE_SECRET_KEY!);

  const { data: plansList } = await stripe.plans.list();

  const plans = await Promise.all(
    plansList.map(async(plan) => {
    const product = await stripe.products.retrieve(plan.product as string)

    return {
      id: plan.id,
      name: product.name,
      price: plan.amount_decimal,
      interval: plan.interval,
      currency: plan.currency,
    }
  }))

  const sortedPlans = plans.sort((a, b) => parseInt(a.price!) - parseInt(b.price!));

  return sortedPlans;
}

const getProfileData =  async (supabase: SupabaseClient<Database>) => {
  const { data: profile } = await supabase.from("profile").select("*").single();
  return profile; 
};

const PricingPage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const { data: user } = await supabase.auth.getSession();

    const [plans, profile] = await Promise.all([
      await getAllPlans(),
      await getProfileData(supabase),
    ]);

  const showSubscribeButton = !!user.session && !profile!.is_subscribed; //サブスクリプション契約ボタンの表示条件
  const showCreateAccountButton = !user.session;
  const manageSubscriptionButton = !!user.session && profile!.is_subscribed;

  return (
    <div className='w-full max-w-3xl mx-auto py-16 flex justify-around'>
      {plans.map((plan) => (
        <Card className='shadow-md' key={plan.id}>
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>{plan.name} プラン</CardDescription>
        </CardHeader>
        <CardContent>
          {plan.price}円 / {plan.interval}</CardContent>
        <CardFooter>
          {showSubscribeButton && <SubscriptionButton planId={plan.id}/>}
          {showCreateAccountButton && <Button>ログインする</Button>}
          {manageSubscriptionButton && <Button>サブスクリプションを管理する</Button>}
        </CardFooter>
      </Card>
      ))}
      
      {/* <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>年額プラン</CardTitle>
          <CardDescription>Anual</CardDescription>
        </CardHeader>
        <CardContent>2500円 / 月</CardContent>
        <CardFooter>
          <Button>サブスクリプション契約する</Button>
        </CardFooter>
      </Card> */}
    </div>
  )
}

export default PricingPage
