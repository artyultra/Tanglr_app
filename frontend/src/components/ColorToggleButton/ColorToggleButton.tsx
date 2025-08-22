"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import styles from "./ColorToggleButton.module.css";

interface ColorToggleButtonProps {
  size?: number;
}

const ColorToggleButton = ({ size = 24 }: ColorToggleButtonProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "dark";
  });
  const [mounted, setMounted] = useState(false);

  // Ensure the attribute exists on first mount
  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    if (!html.getAttribute("data-theme")) {
      html.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.setAttribute(
        "data-theme",
        next ? "dark" : "light",
      );
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={styles.button}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Moon
          color="var(--text)"
          size={size}
          fill="var(--text)"
          className={styles.icon}
        />
      ) : (
        <Sun
          color="var(--text)"
          size={size}
          fill="var(--text)"
          className={styles.icon}
        />
      )}
    </button>
  );
};

export default ColorToggleButton;
