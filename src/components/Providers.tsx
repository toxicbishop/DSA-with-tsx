import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
