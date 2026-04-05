"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="button-secondary icon-button theme-toggle"
      aria-label={`Switch to ${nextTheme} mode`}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      aria-pressed={theme === "dark"}
      onClick={() => {
        applyTheme(nextTheme);
        localStorage.setItem(STORAGE_KEY, nextTheme);
        setTheme(nextTheme);
      }}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-button-glyph">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <path
            d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12H2.75M18.55 5.45l-1.5 1.5M6.95 17.05l-1.5 1.5M18.55 18.55l-1.5-1.5M6.95 6.95l-1.5-1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-button-glyph">
          <path
            d="M14.7 3.2a8.8 8.8 0 1 0 6.1 13.8A9.3 9.3 0 0 1 14.7 3.2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
