import { useState } from "react";
import {
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { LogOut, User, Mail, Lock, X } from "lucide-react";
import { secureFetch } from "../utils/api";

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
        const res = await secureFetch(
          `${import.meta.env.VITE_API_URL}/api/auth/google`,
          {
            method: "POST",
            body: JSON.stringify({ credential: credentialResponse.credential }),
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
      const res = await secureFetch(
        `${import.meta.env.VITE_API_URL}/api/auth${endpoint}`,
        {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
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
    } catch (err) {
      console.error("Login Error:", err);
      setErrorText("A network error occurred.");
    }
  };

  const handleLogoutClick = async () => {
    try {
      await secureFetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
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
                <div className="w-full h-[40px] flex justify-center items-center overflow-hidden rounded-lg">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => {
                      setErrorText("Login Failed");
                    }}
                    shape="rectangular"
                    width="334px"
                    logo_alignment="center"
                    text="continue_with"
                  />
                </div>
                <button
                  onClick={handleGitHubLogin}
                  className="w-full h-[40px] flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#1a1e22] text-white rounded-lg text-sm font-semibold transition-all border border-gray-700 shadow-sm px-4">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.003-.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub</span>
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
