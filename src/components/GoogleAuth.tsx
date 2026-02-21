import {
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { LogOut, User, Github } from "lucide-react";

export interface GoogleUser {
  id?: string;
  email: string;
  name: string;
  picture: string;
  role?: string;
  completedPrograms?: string[];
}

interface GoogleAuthProps {
  user: GoogleUser | null;
  onLogin: (user: GoogleUser) => void;
  onLogout: () => void;
}

export function GoogleAuth({ user, onLogin, onLogout }: GoogleAuthProps) {
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: credentialResponse.credential }),
            credentials: "include",
          },
        );
        const data = await res.json();
        if (data.success) {
          onLogin(data.user);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Backend auth failed", error);
      }
    }
  };

  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,user:email`,
    );
  };

  const handleLogoutClick = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout network error", e);
    }
    googleLogout();
    onLogout();
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
          onClick={handleLogoutClick}
          className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
          title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.error("Login Failed");
        }}
        useOneTap
        shape="pill"
      />
      <button
        onClick={handleGitHubLogin}
        className="flex items-center gap-2 p-2 bg-[#24292F] hover:bg-[#24292F]/90 text-white rounded-full text-sm font-medium transition-colors"
        title="Sign in with GitHub">
        <Github size={18} />
      </button>
    </div>
  );
}
