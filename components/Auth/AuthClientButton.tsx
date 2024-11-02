"use client"
//CC
import { Session } from 'inspector/promises'
import { Button } from '../ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const AuthClientButton = ({ session }: { session: Session | null}) => {
  const supabase = createClientComponentClient();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };
  return (
  <Button onClick={handleSignIn}>サインイン</Button>
  )
};

export default AuthClientButton
