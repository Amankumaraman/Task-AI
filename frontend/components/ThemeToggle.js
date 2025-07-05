'use client';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved preference or system preference
    const savedPreference = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialMode = savedPreference 
      ? savedPreference === 'dark'
      : systemPreference;
    
    setDarkMode(initialMode);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, mounted]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  if (!mounted) {
    // Return a placeholder to avoid layout shift
    return (
      <button 
        className="button flex items-center gap-2 opacity-0"
        aria-hidden="true"
      >
        <Moon size={20} />
        <span>Dark Mode</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="button-ghost group flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <>
          <Sun 
            size={20} 
            className="text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors" 
          />
          <span className="sr-only md:not-sr-only">Light Mode</span>
        </>
      ) : (
        <>
          <Moon 
            size={20} 
            className="text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors" 
          />
          <span className="sr-only md:not-sr-only">Dark Mode</span>
        </>
      )}
    </button>
  );
}