import { useState } from "react";
import {
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { LogOut, User } from "lucide-react";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export function GoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const decoded: GoogleUser = jwtDecode(credentialResponse.credential);
        setUser(decoded);
        console.log("Logged in user:", decoded);
        // Here you would typically send the token to your backend if needed
      } catch (error) {
        console.error("Invalid token format", error);
      }
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
          )}
          <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200">
            {user.name}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
          title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.error("Login Failed");
        }}
        useOneTap
        shape="pill"
      />
    </div>
  );
}
