"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ruralProofs } from "@/lib/benefits-data";
import { Tractor } from "lucide-react";

interface RuralProofsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProofs: (proofs: string[]) => void;
}

export function RuralProofsModal({
  open,
  onOpenChange,
  onAddProofs,
}: RuralProofsModalProps) {
  const [selectedProofs, setSelectedProofs] = useState<Set<string>>(new Set());

  const toggleProof = (proofId: string) => {
    const newSelected = new Set(selectedProofs);
    if (newSelected.has(proofId)) {
      newSelected.delete(proofId);
    } else {
      newSelected.add(proofId);
    }
    setSelectedProofs(newSelected);
  };

  const handleAdd = () => {
    const proofsToAdd = ruralProofs
      .filter((p) => selectedProofs.has(p.id))
      .map((p) => p.name);
    onAddProofs(proofsToAdd);
    setSelectedProofs(new Set());
    onOpenChange(false);
  };

  const handleSelectAll = () => {
    if (selectedProofs.size === ruralProofs.length) {
      setSelectedProofs(new Set());
    } else {
      setSelectedProofs(new Set(ruralProofs.map((p) => p.id)));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tractor className="h-5 w-5 text-primary" />
            Provas de Atividade Rural
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <p className="mb-4 text-sm text-muted-foreground">
            Selecione as provas materiais de atividade rural que deseja adicionar ao checklist.
          </p>

          <div className="mb-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedProofs.size === ruralProofs.length
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </Button>
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-3">
              {ruralProofs.map((proof) => (
                <div
                  key={proof.id}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    id={proof.id}
                    checked={selectedProofs.has(proof.id)}
                    onCheckedChange={() => toggleProof(proof.id)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={proof.id}
                    className="cursor-pointer text-sm leading-relaxed"
                  >
                    {proof.name}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={selectedProofs.size === 0}>
            Adicionar ({selectedProofs.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
