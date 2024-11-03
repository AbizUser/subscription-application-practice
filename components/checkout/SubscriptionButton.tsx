"use client"

import { Button } from "../ui/button";



const SubscriptionButton = ({ planId }: { planId: string }) => {

  const processSubscription = async () => {
    const response  = await 
    fetch(`http://localhost:3000/api/subscription/${planId}`)

    const json = await response.json();
    console.log(json)
  };


  return(
    <Button onClick={async () => processSubscription()}>
      サブスクリプション契約する
    </Button>
  )
    
};


export default SubscriptionButton
