"use client";

import { useState, useEffect, useCallback } from "react";

export interface ChecklistItemData {
  id: string;
  text: string;
  checked: boolean;
}

export interface Atendimento {
  id: string;
  clientName: string;
  clientCPF: string;
  benefitId: string;
  benefitName: string;
  checklistItems: ChecklistItemData[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "ppp-atendimentos";

export function useAtendimentos() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAtendimentos(parsed);
      } catch {
        console.error("Failed to parse atendimentos from localStorage");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever atendimentos change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atendimentos));
    }
  }, [atendimentos, isLoaded]);

  const saveAtendimento = useCallback(
    (atendimento: Omit<Atendimento, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newAtendimento: Atendimento = {
        ...atendimento,
        id: `atendimento-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setAtendimentos((prev) => [newAtendimento, ...prev]);
      return newAtendimento.id;
    },
    []
  );

  const updateAtendimento = useCallback(
    (id: string, updates: Partial<Omit<Atendimento, "id" | "createdAt">>) => {
      setAtendimentos((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, ...updates, updatedAt: new Date().toISOString() }
            : a
        )
      );
    },
    []
  );

  const deleteAtendimento = useCallback((id: string) => {
    setAtendimentos((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getAtendimento = useCallback(
    (id: string) => {
      return atendimentos.find((a) => a.id === id);
    },
    [atendimentos]
  );

  return {
    atendimentos,
    isLoaded,
    saveAtendimento,
    updateAtendimento,
    deleteAtendimento,
    getAtendimento,
  };
}
