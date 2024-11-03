//SC
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers"
import AuthClientButton from './AuthClientButton';

const AuthServerButton = async () => {
  const supabase = createServerComponentClient({ cookies });
  const { data: user } = await supabase.auth.getSession();
  // console.log(`AuthServerButton.tsx:${user!.session}`)
  // console.log("AuthServerButton.tsx:", JSON.stringify(user!.session, null, 1));

  const session = user.session;
  return <AuthClientButton session={session} />;
};

export default AuthServerButton;
