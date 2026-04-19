import React from "react";
import { Terminal } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="relative flex flex-col items-center">
        {/* Animated Icon Wrapper */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping"></div>
          <div className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-bounce-subtle">
            <img
              src="/favicon.svg"
              alt="DSAS Logo"
              className="w-12 h-12 animate-pulse"
            />
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl font-bold mb-4 animate-fade-in text-gray-900 dark:text-white">
          DSA Study <span className="text-orange-500">Hub</span>
        </h1>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-loading-bar"></div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
          <Terminal size={14} />
          <span className="animate-typewriter">
            Initializing system resources...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
