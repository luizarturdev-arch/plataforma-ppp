"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useTheme,
  colorThemes,
  type ColorTheme,
  type Mode,
} from "@/components/theme-provider";
import { Palette, Sun, Moon, Monitor, Check } from "lucide-react";

const modeOptions: { value: Mode; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Claro", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Escuro", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "Sistema", icon: <Monitor className="h-4 w-4" /> },
];

export function ThemeSwitcher() {
  const { colorTheme, mode, setColorTheme, setMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Mudar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Modo</DropdownMenuLabel>
        {modeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setMode(option.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </div>
            {mode === option.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Cor</DropdownMenuLabel>
        {(Object.keys(colorThemes) as ColorTheme[]).map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setColorTheme(theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: colorThemes[theme].preview }}
              />
              {colorThemes[theme].name}
            </div>
            {colorTheme === theme && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
