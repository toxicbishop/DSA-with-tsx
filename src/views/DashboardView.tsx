import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Code2, ShieldCheck, Mail } from "lucide-react";

export const DashboardView: React.FC = () => {
  const { user, role, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.user_metadata?.full_name || "Welcome Back!"}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  role === "admin"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : role === "instructor"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={14} />
                  {role}
                </div>
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4 text-orange-600">
                  <Code2 size={24} />
                  <h3 className="font-bold">Recent Activity</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Track your solved problems and visualize your growth here.
                  (This section will show real stats soon!)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
