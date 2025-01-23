'use client'

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function History() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('promptHistory');
    if (saved) {
      setPromptHistory(JSON.parse(saved));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 text-black dark:text-white">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <a
        href="/"
        className="fixed top-4 left-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Back to home"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>

      <main className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Prompt History</h1>
        
        <div className="space-y-4">
          {promptHistory.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No prompts in history</p>
          ) : (
            promptHistory.map((prompt, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
              >
                <p className="text-lg">{prompt}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Prompt #{promptHistory.length - index}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 