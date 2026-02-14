import React, { useState, useEffect } from "react";
import { Lock, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";

interface Issue {
  _id: string;
  type: "bug" | "suggestion";
  severity?: "minor" | "moderate" | "critical";
  title: string;
  description: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

const AdminIssues: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${API_URL}/api/issues`, {
        headers: {
          "x-admin-password": password,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setIssues(data.data);
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_token", password);
      } else {
        setError("Invalid Password");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("admin_token");
    if (savedPassword) {
      setPassword(savedPassword);
      // Auto-fetch if token exists
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      fetch(`${API_URL}/api/issues`, {
        headers: { "x-admin-password": savedPassword },
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              if (data.data && Array.isArray(data.data)) {
                setIssues(data.data);
                setIsAuthenticated(true);
              }
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Access
            </h2>
            <p className="text-gray-500 text-sm mt-2 text-center">
              Please enter the admin password to view issues.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 outline-none transition-all dark:text-white"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <ShieldAlert size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            Issue Tracker
          </h1>
          <p className="text-gray-500 mt-1">
            Viewing {issues?.length || 0} submitted reports
          </p>
        </div>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPassword("");
            sessionStorage.removeItem("admin_token");
          }}
          className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          Logout
        </button>
      </div>

      <div className="grid gap-4">
        {Array.isArray(issues) &&
          issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        issue.type === "bug"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                      }`}>
                      {issue.type || "Issue"}
                    </span>
                    {issue.severity && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          issue.severity === "critical"
                            ? "border-red-500 text-red-500"
                            : issue.severity === "moderate"
                              ? "border-orange-500 text-orange-500"
                              : "border-green-500 text-green-500"
                        }`}>
                        {issue.severity}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString()
                        : "Unknown Date"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {issue.title || "No Title"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                    {issue.description || "No Description"}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold uppercase">
                        {(issue.name || "U").charAt(0)}
                      </div>
                      {issue.name || "Unknown"} ({issue.email || "No Email"})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {(!issues || issues.length === 0) && (
          <div className="text-center py-20 text-gray-500">
            <CheckCircle2
              size={48}
              className="mx-auto mb-4 text-green-500 opacity-50"
            />
            <p className="text-lg">All caught up! No issues found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIssues;
