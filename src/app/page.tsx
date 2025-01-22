'use client'

import Image from "next/image";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface Panel {
  description: string;
  image: string;
  panelNumber: number;
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [panels, setPanels] = useState<Panel[]>([]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const generateImages = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      console.log('Response from API:', data); // Debug log
      
      if (data.panels && Array.isArray(data.panels)) {
        setPanels(data.panels);
      } else {
        console.error('Invalid panel data received:', data);
      }
    } catch (error) {
      console.error('Failed to generate comic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 text-black dark:text-white">
      {/* Theme toggle button */}
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

      <main className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Yambasu Comics</h1>
        
        {/* Updated Input Section */}
        <div className="mb-8">
          <div className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your comic story..."
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-gray-800 
                       focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                       transition-colors"
            />
            <button
              onClick={generateImages}
              disabled={isLoading || !prompt}
              className="w-full px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg
                       hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Comic Panels'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="aspect-square relative border-4 border-black dark:border-white rounded-lg overflow-hidden">
                {panels[index]?.image ? (
                  <Image
                    src={panels[index].image}
                    alt={panels[index].description}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                    {isLoading ? 'Loading...' : `Panel ${index + 1}`}
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-sm">
                {panels[index]?.description || `Panel ${index + 1}`}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
