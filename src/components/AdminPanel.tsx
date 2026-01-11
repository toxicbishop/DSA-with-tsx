import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, Bug, Lightbulb } from 'lucide-react';

type Issue = {
  _id: string;
  type: 'bug' | 'suggestion' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  createdAt: string;
};

export const AdminPanel: React.FC = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side "security" for demonstration
        if (password === 'admin123') {
            setIsAuthenticated(true);
            fetchIssues();
        } else {
            setError('Invalid credentials');
        }
    };

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/issues`);
            const data = await res.json();
            if (data.success) {
                setIssues(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center mb-6 text-red-500">
                        <Lock size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Password"
                            className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-bold transition-colors">
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                    <Shield className="text-red-500" /> Admin Dashboard
                </h1>
                <button onClick={fetchIssues} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                    Refresh
                </button>
            </div>

            {loading ? (
                <p>Loading issues...</p>
            ) : (
                <div className="grid gap-4">
                    {issues.map((issue) => (
                        <div key={issue._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {issue.type === 'bug' ? <Bug size={18} className="text-red-500" /> : <Lightbulb size={18} className="text-yellow-500" />}
                                    <span className="font-bold uppercase text-sm tracking-wide text-gray-500">{issue.type}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        issue.severity === 'critical' ? 'bg-red-900 text-red-100' :
                                        issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {issue.severity}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">{new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{issue.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{issue.description}</p>
                        </div>
                    ))}
                    {issues.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                            <p>All caught up! No active issues.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
