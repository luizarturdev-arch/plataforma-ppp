"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type ColorTheme =
  | "blue"
  | "pink"
  | "purple"
  | "green"
  | "red"
  | "orange"
  | "slate"
  | "zinc";

export type Mode = "light" | "dark" | "system";

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const colorThemes: Record<
  ColorTheme,
  { name: string; hue: number; preview: string }
> = {
  blue: { name: "Azul", hue: 250, preview: "oklch(0.45 0.12 250)" },
  pink: { name: "Rosa", hue: 350, preview: "oklch(0.55 0.2 350)" },
  purple: { name: "Roxo", hue: 290, preview: "oklch(0.5 0.18 290)" },
  green: { name: "Verde", hue: 160, preview: "oklch(0.5 0.15 160)" },
  red: { name: "Vermelho", hue: 25, preview: "oklch(0.5 0.2 25)" },
  orange: { name: "Laranja", hue: 50, preview: "oklch(0.6 0.18 50)" },
  slate: { name: "Cinza Azulado", hue: 220, preview: "oklch(0.4 0.03 220)" },
  zinc: { name: "Preto", hue: 0, preview: "oklch(0.25 0 0)" },
};

function applyColorTheme(theme: ColorTheme, isDark: boolean) {
  const root = document.documentElement;
  const hue = colorThemes[theme].hue;
  const isNeutral = theme === "slate" || theme === "zinc";
  const chroma = isNeutral ? (theme === "zinc" ? 0 : 0.03) : 0.12;
  const chromaAccent = isNeutral ? (theme === "zinc" ? 0 : 0.05) : 0.15;

  if (isDark) {
    // Dark mode colors
    root.style.setProperty("--primary", `oklch(0.6 ${chroma} ${hue})`);
    root.style.setProperty("--primary-foreground", `oklch(0.14 0.015 ${hue})`);
    root.style.setProperty("--ring", `oklch(0.6 ${chroma} ${hue})`);
    root.style.setProperty(
      "--accent",
      `oklch(0.35 ${chroma * 0.5} ${hue})`
    );
    root.style.setProperty("--accent-foreground", `oklch(0.96 0.005 ${hue})`);
    root.style.setProperty("--chart-1", `oklch(0.6 ${chroma} ${hue})`);
    root.style.setProperty(
      "--chart-2",
      `oklch(0.55 ${chromaAccent} ${(hue + 60) % 360})`
    );
    root.style.setProperty("--sidebar-primary", `oklch(0.6 ${chroma} ${hue})`);
    root.style.setProperty("--sidebar-ring", `oklch(0.6 ${chroma} ${hue})`);

    if (!isNeutral) {
      root.style.setProperty("--background", `oklch(0.14 0.015 ${hue})`);
      root.style.setProperty("--foreground", `oklch(0.96 0.005 ${hue})`);
      root.style.setProperty("--card", `oklch(0.18 0.015 ${hue})`);
      root.style.setProperty("--card-foreground", `oklch(0.96 0.005 ${hue})`);
      root.style.setProperty("--popover", `oklch(0.18 0.015 ${hue})`);
      root.style.setProperty("--popover-foreground", `oklch(0.96 0.005 ${hue})`);
      root.style.setProperty("--secondary", `oklch(0.25 0.015 ${hue})`);
      root.style.setProperty("--secondary-foreground", `oklch(0.96 0.005 ${hue})`);
      root.style.setProperty("--muted", `oklch(0.25 0.015 ${hue})`);
      root.style.setProperty("--muted-foreground", `oklch(0.65 0.02 ${hue})`);
      root.style.setProperty("--border", `oklch(0.28 0.015 ${hue})`);
      root.style.setProperty("--input", `oklch(0.28 0.015 ${hue})`);
      root.style.setProperty("--sidebar", `oklch(0.16 0.015 ${hue})`);
      root.style.setProperty("--sidebar-foreground", `oklch(0.96 0.005 ${hue})`);
      root.style.setProperty("--sidebar-accent", `oklch(0.25 0.015 ${hue})`);
      root.style.setProperty(
        "--sidebar-accent-foreground",
        `oklch(0.96 0.005 ${hue})`
      );
      root.style.setProperty("--sidebar-border", `oklch(0.28 0.015 ${hue})`);
    } else {
      root.style.setProperty("--background", `oklch(0.14 0 0)`);
      root.style.setProperty("--foreground", `oklch(0.96 0 0)`);
      root.style.setProperty("--card", `oklch(0.18 0 0)`);
      root.style.setProperty("--card-foreground", `oklch(0.96 0 0)`);
      root.style.setProperty("--popover", `oklch(0.18 0 0)`);
      root.style.setProperty("--popover-foreground", `oklch(0.96 0 0)`);
      root.style.setProperty("--secondary", `oklch(0.25 0 0)`);
      root.style.setProperty("--secondary-foreground", `oklch(0.96 0 0)`);
      root.style.setProperty("--muted", `oklch(0.25 0 0)`);
      root.style.setProperty("--muted-foreground", `oklch(0.65 0 0)`);
      root.style.setProperty("--border", `oklch(0.28 0 0)`);
      root.style.setProperty("--input", `oklch(0.28 0 0)`);
      root.style.setProperty("--sidebar", `oklch(0.16 0 0)`);
      root.style.setProperty("--sidebar-foreground", `oklch(0.96 0 0)`);
      root.style.setProperty("--sidebar-accent", `oklch(0.25 0 0)`);
      root.style.setProperty("--sidebar-accent-foreground", `oklch(0.96 0 0)`);
      root.style.setProperty("--sidebar-border", `oklch(0.28 0 0)`);
    }
  } else {
    // Light mode colors
    root.style.setProperty("--primary", `oklch(0.45 ${chroma} ${hue})`);
    root.style.setProperty("--primary-foreground", `oklch(0.98 0 0)`);
    root.style.setProperty("--ring", `oklch(0.45 ${chroma} ${hue})`);
    root.style.setProperty(
      "--accent",
      `oklch(0.92 ${chroma * 0.3} ${hue})`
    );
    root.style.setProperty("--accent-foreground", `oklch(0.25 0.02 ${hue})`);
    root.style.setProperty("--chart-1", `oklch(0.45 ${chroma} ${hue})`);
    root.style.setProperty(
      "--chart-2",
      `oklch(0.55 ${chromaAccent} ${(hue + 60) % 360})`
    );
    root.style.setProperty("--sidebar-primary", `oklch(0.45 ${chroma} ${hue})`);
    root.style.setProperty("--sidebar-ring", `oklch(0.45 ${chroma} ${hue})`);

    if (!isNeutral) {
      root.style.setProperty("--background", `oklch(0.985 0.002 ${hue})`);
      root.style.setProperty("--foreground", `oklch(0.15 0.02 ${hue})`);
      root.style.setProperty("--card", `oklch(1 0 0)`);
      root.style.setProperty("--card-foreground", `oklch(0.15 0.02 ${hue})`);
      root.style.setProperty("--popover", `oklch(1 0 0)`);
      root.style.setProperty("--popover-foreground", `oklch(0.15 0.02 ${hue})`);
      root.style.setProperty("--secondary", `oklch(0.96 0.01 ${hue})`);
      root.style.setProperty("--secondary-foreground", `oklch(0.25 0.02 ${hue})`);
      root.style.setProperty("--muted", `oklch(0.95 0.01 ${hue})`);
      root.style.setProperty("--muted-foreground", `oklch(0.5 0.02 ${hue})`);
      root.style.setProperty("--border", `oklch(0.90 0.01 ${hue})`);
      root.style.setProperty("--input", `oklch(0.92 0.01 ${hue})`);
      root.style.setProperty("--sidebar", `oklch(0.98 0.005 ${hue})`);
      root.style.setProperty("--sidebar-foreground", `oklch(0.15 0.02 ${hue})`);
      root.style.setProperty("--sidebar-accent", `oklch(0.96 0.01 ${hue})`);
      root.style.setProperty(
        "--sidebar-accent-foreground",
        `oklch(0.25 0.02 ${hue})`
      );
      root.style.setProperty("--sidebar-border", `oklch(0.90 0.01 ${hue})`);
    } else {
      root.style.setProperty("--background", `oklch(0.985 0 0)`);
      root.style.setProperty("--foreground", `oklch(0.15 0 0)`);
      root.style.setProperty("--card", `oklch(1 0 0)`);
      root.style.setProperty("--card-foreground", `oklch(0.15 0 0)`);
      root.style.setProperty("--popover", `oklch(1 0 0)`);
      root.style.setProperty("--popover-foreground", `oklch(0.15 0 0)`);
      root.style.setProperty("--secondary", `oklch(0.96 0 0)`);
      root.style.setProperty("--secondary-foreground", `oklch(0.25 0 0)`);
      root.style.setProperty("--muted", `oklch(0.95 0 0)`);
      root.style.setProperty("--muted-foreground", `oklch(0.5 0 0)`);
      root.style.setProperty("--border", `oklch(0.90 0 0)`);
      root.style.setProperty("--input", `oklch(0.92 0 0)`);
      root.style.setProperty("--sidebar", `oklch(0.98 0 0)`);
      root.style.setProperty("--sidebar-foreground", `oklch(0.15 0 0)`);
      root.style.setProperty("--sidebar-accent", `oklch(0.96 0 0)`);
      root.style.setProperty("--sidebar-accent-foreground", `oklch(0.25 0 0)`);
      root.style.setProperty("--sidebar-border", `oklch(0.90 0 0)`);
    }
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("blue");
  const [mode, setModeState] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "ppp-color-theme"
    ) as ColorTheme | null;
    const savedMode = localStorage.getItem("ppp-mode") as Mode | null;

    if (savedTheme && colorThemes[savedTheme]) {
      setColorThemeState(savedTheme);
    }
    if (savedMode) {
      setModeState(savedMode);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const isDark = mode === "dark" || (mode === "system" && systemDark);

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      applyColorTheme(colorTheme, isDark);
    }
  }, [colorTheme, mode, mounted]);

  useEffect(() => {
    if (mode === "system" && mounted) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const isDark = mediaQuery.matches;
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        applyColorTheme(colorTheme, isDark);
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [mode, colorTheme, mounted]);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem("ppp-color-theme", theme);
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem("ppp-mode", newMode);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, mode, setColorTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
