"use client"
//CC
// import { Session } from 'inspector/promises'
import {
  Session,
  createClientComponentClient
} from '@supabase/auth-helpers-nextjs';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const AuthClientButton = ({ session }: { session: Session | null}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        //location.originを指定してURL元の変更にも対応できる。
      }
    });
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  
  return (
    <>
    {session ?
      <Button onClick={handleSignOut}>ログアウト</Button>
    : (
      <Button onClick={handleSignIn}>ログイン</Button>
    )}
    </>
  )
};

export default AuthClientButton
