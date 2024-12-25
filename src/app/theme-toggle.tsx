"use client";

import { HiOutlineSun as SunIcon, HiOutlineMoon as MoonIcon } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>...</>;

  if (currentTheme === "dark") {
    return <SunIcon className="absolute top-7 right-7 h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-full" onClick={() => setTheme("light")} />;
  }

  if (currentTheme === "light") {
    return (
      <MoonIcon className="absolute top-7 right-7 h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-full" onClick={() => setTheme("dark")} />
    );
  }
}