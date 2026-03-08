"use client";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const ICON_SIZE = 16;

  const themes = [
    { value: 'light', icon: <Sun size={ICON_SIZE} /> },
    { value: 'dark', icon: <Moon size={ICON_SIZE} /> },
    { value: 'system', icon: <Laptop size={ICON_SIZE} /> },
  ]

  return (
    <div className="flex gap-1">
      {themes.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-1.5 rounded text-sm ${
            theme === value
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  )
};

export { ThemeSwitcher };