"use client";

import React from "react"

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ChecklistItem } from "@/components/checklist-item";
import { RuralProofsModal } from "@/components/rural-proofs-modal";
import { OutputModal } from "@/components/output-modal";
import { AtendimentosSidebar } from "@/components/atendimentos-sidebar";
import { benefits } from "@/lib/benefits-data";
import { useAtendimentos, type ChecklistItemData } from "@/hooks/use-atendimentos";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  FileText,
  Plus,
  Tractor,
  ClipboardList,
  Save,
  User,
  Scale,
  CheckCircle2,
  Clock,
} from "lucide-react";

export function PPPSystem() {
  const {
    atendimentos,
    isLoaded,
    saveAtendimento,
    updateAtendimento,
    deleteAtendimento,
    getAtendimento,
  } = useAtendimentos();

  const [currentAtendimentoId, setCurrentAtendimentoId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientCPF, setClientCPF] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState("");
  const [checklistItems, setChecklistItems] = useState<ChecklistItemData[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [ruralModalOpen, setRuralModalOpen] = useState(false);
  const [outputModalOpen, setOutputModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientCPF(formatCPF(e.target.value));
    setHasUnsavedChanges(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleBenefitChange = useCallback((benefitId: string) => {
    setSelectedBenefit(benefitId);
    const benefit = benefits.find((b) => b.id === benefitId);
    if (benefit) {
      const items: ChecklistItemData[] = benefit.documents.map((doc, index) => ({
        id: `item-${Date.now()}-${index}`,
        text: doc,
        checked: false,
      }));
      setChecklistItems(items);
    }
    setHasUnsavedChanges(true);
  }, []);

  const toggleItem = useCallback((id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const editItem = useCallback((id: string, newText: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
    setHasUnsavedChanges(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
    setHasUnsavedChanges(true);
  }, []);

  const addItem = () => {
    if (newItemText.trim()) {
      setChecklistItems((prev) => [
        ...prev,
        {
          id: `item-${Date.now()}`,
          text: newItemText.trim(),
          checked: false,
        },
      ]);
      setNewItemText("");
      setHasUnsavedChanges(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const addRuralProofs = (proofs: string[]) => {
    const newItems: ChecklistItemData[] = proofs.map((proof, index) => ({
      id: `rural-${Date.now()}-${index}`,
      text: proof,
      checked: false,
    }));
    setChecklistItems((prev) => [...prev, ...newItems]);
    setHasUnsavedChanges(true);
  };

  const resetForm = () => {
    setCurrentAtendimentoId(null);
    setClientName("");
    setClientCPF("");
    setSelectedBenefit("");
    setChecklistItems([]);
    setNewItemText("");
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    const benefitName = benefits.find((b) => b.id === selectedBenefit)?.name || "";

    if (currentAtendimentoId) {
      updateAtendimento(currentAtendimentoId, {
        clientName,
        clientCPF,
        benefitId: selectedBenefit,
        benefitName,
        checklistItems,
      });
    } else {
      const newId = saveAtendimento({
        clientName,
        clientCPF,
        benefitId: selectedBenefit,
        benefitName,
        checklistItems,
      });
      setCurrentAtendimentoId(newId);
    }
    setHasUnsavedChanges(false);
  };

  const handleSelectAtendimento = (id: string) => {
    const atendimento = getAtendimento(id);
    if (atendimento) {
      setCurrentAtendimentoId(atendimento.id);
      setClientName(atendimento.clientName);
      setClientCPF(atendimento.clientCPF);
      setSelectedBenefit(atendimento.benefitId);
      setChecklistItems(atendimento.checklistItems);
      setHasUnsavedChanges(false);
    }
  };

  const handleDeleteAtendimento = (id: string) => {
    deleteAtendimento(id);
    if (currentAtendimentoId === id) {
      resetForm();
    }
  };

  const checkedCount = checklistItems.filter((item) => item.checked).length;
  const totalCount = checklistItems.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const selectedBenefitName =
    benefits.find((b) => b.id === selectedBenefit)?.name || "";

  // Auto-save effect
  useEffect(() => {
    if (hasUnsavedChanges && (clientName || selectedBenefit || checklistItems.length > 0)) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clientName, clientCPF, selectedBenefit, checklistItems, hasUnsavedChanges]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AtendimentosSidebar
        atendimentos={atendimentos}
        currentId={currentAtendimentoId}
        onSelect={handleSelectAtendimento}
        onDelete={handleDeleteAtendimento}
        onNew={resetForm}
      />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Scale className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">PPP</h1>
                  <p className="text-xs text-muted-foreground">
                    Plataforma de Pendencias Previdenciarias
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <Badge variant="secondary" className="text-xs">
                    Alteracoes nao salvas
                  </Badge>
                )}
                <ThemeSwitcher />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={!clientName && !selectedBenefit && checklistItems.length === 0}
                  className="gap-2 bg-transparent"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Client Info */}
              <div className="space-y-6 lg:col-span-1">
                {/* Client Data Card */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4 text-primary" />
                      Dados do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Nome do Cliente</Label>
                      <Input
                        id="clientName"
                        placeholder="Digite o nome completo"
                        value={clientName}
                        onChange={handleNameChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientCPF">CPF</Label>
                      <Input
                        id="clientCPF"
                        placeholder="000.000.000-00"
                        value={clientCPF}
                        onChange={handleCPFChange}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Benefit Selection Card */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-primary" />
                      Beneficio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedBenefit}
                      onValueChange={handleBenefitChange}
                    >
                      <SelectTrigger className="h-auto min-h-10 whitespace-normal text-left [&>span]:line-clamp-none">
                        <SelectValue placeholder="Selecione o beneficio" />
                      </SelectTrigger>
                      <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                        {benefits.map((benefit) => (
                          <SelectItem key={benefit.id} value={benefit.id} className="whitespace-normal">
                            {benefit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                {checklistItems.length > 0 && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        Progresso
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-sm">Entregues</span>
                        </div>
                        <Badge variant="secondary">{checkedCount}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-warning" />
                          <span className="text-sm">Pendentes</span>
                        </div>
                        <Badge variant="secondary">{totalCount - checkedCount}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Checklist */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        Checklist de Documentos
                        {totalCount > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {totalCount} itens
                          </Badge>
                        )}
                      </CardTitle>
                      {checklistItems.length > 0 && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRuralModalOpen(true)}
                            className="gap-2"
                          >
                            <Tractor className="h-4 w-4" />
                            <span className="hidden sm:inline">Provas Rurais</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setOutputModalOpen(true)}
                            className="gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Gerar Lista</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {checklistItems.length === 0 ? (
                      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium">
                          Nenhum beneficio selecionado
                        </h3>
                        <p className="max-w-sm text-sm text-muted-foreground">
                          Selecione um beneficio previdenciario para carregar automaticamente
                          a lista de documentos necessarios.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Add new item */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Adicionar novo documento..."
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                          />
                          <Button onClick={addItem} className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Adicionar</span>
                          </Button>
                        </div>

                        {/* Checklist items */}
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="space-y-2">
                            {checklistItems.map((item) => (
                              <ChecklistItem
                                key={item.id}
                                id={item.id}
                                text={item.text}
                                checked={item.checked}
                                onToggle={toggleItem}
                                onEdit={editItem}
                                onRemove={removeItem}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>

          {/* Rural Proofs Modal */}
          <RuralProofsModal
            open={ruralModalOpen}
            onOpenChange={setRuralModalOpen}
            onAddProofs={addRuralProofs}
          />

          {/* Output Modal */}
          <OutputModal
            open={outputModalOpen}
            onOpenChange={setOutputModalOpen}
            items={checklistItems}
            clientName={clientName}
            benefit={selectedBenefitName}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
