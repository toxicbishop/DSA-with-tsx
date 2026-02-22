import { useState } from "react";
import {
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { LogOut, User, Github, Mail, Lock, X } from "lucide-react";
import { getCsrfToken } from "../utils/csrf";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-xsrf-token": getCsrfToken() || "",
            },
            body: JSON.stringify({ credential: credentialResponse.credential }),
            credentials: "include",
          },
        );
        const data = await res.json();
        if (data.success) {
          onLogin(data.user);
          setIsOpen(false);
        } else {
          setErrorText(data.message);
        }
      } catch {
        setErrorText("Backend auth failed");
      }
    }
  };

  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`,
    );
  };

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    const endpoint = isRegistering ? "/register" : "/login";
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-xsrf-token": getCsrfToken() || "",
          },
          body: JSON.stringify({ email, password, name }),
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
        setIsOpen(false);
        setEmail("");
        setPassword("");
        setName("");
      } else {
        setErrorText(data.message);
      }
    } catch {
      setErrorText("A network error occurred.");
    }
  };

  const handleLogoutClick = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "x-xsrf-token": getCsrfToken() || "",
        },
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
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors">
        Sign In
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                {isRegistering ? "Create Account" : "Welcome Back"}
              </h2>

              {errorText && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800 text-center">
                  {errorText}
                </div>
              )}

              <form onSubmit={handleLocalSubmit} className="space-y-4">
                {isRegistering && (
                  <div className="relative">
                    <User
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors">
                  {isRegistering ? "Register" : "Sign In"}
                </button>
              </form>

              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
                <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
                  or
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-center [&>div]:w-full [&>div>div]:!w-full [&>div>div]:!rounded-xl">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => {
                      setErrorText("Login Failed");
                    }}
                    shape="rectangular"
                  />
                </div>
                <button
                  onClick={handleGitHubLogin}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-[#24292F] hover:bg-[#24292F]/90 text-white rounded-lg text-sm font-medium transition-colors border border-transparent">
                  <Github size={18} /> Continue with GitHub
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  {isRegistering ? "Sign In" : "Register"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
