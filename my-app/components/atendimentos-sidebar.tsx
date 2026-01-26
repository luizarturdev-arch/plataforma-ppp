"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  User,
  FileText,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Scale,
} from "lucide-react";
import type { Atendimento } from "@/hooks/use-atendimentos";

interface AtendimentosSidebarProps {
  atendimentos: Atendimento[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function AtendimentosSidebar({
  atendimentos,
  currentId,
  onSelect,
  onDelete,
  onNew,
}: AtendimentosSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAtendimentos = useMemo(() => {
    if (!searchQuery.trim()) return atendimentos;
    const query = searchQuery.toLowerCase();
    return atendimentos.filter(
      (a) =>
        a.clientName.toLowerCase().includes(query) ||
        a.clientCPF.includes(query) ||
        a.benefitName.toLowerCase().includes(query)
    );
  }, [atendimentos, searchQuery]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getProgress = (items: Atendimento["checklistItems"]) => {
    if (items.length === 0) return 0;
    const checked = items.filter((i) => i.checked).length;
    return Math.round((checked / items.length) * 100);
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Scale className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-sm font-semibold">PPP</h2>
            <p className="text-xs text-muted-foreground">Atendimentos</p>
          </div>
        </div>
        <div className="relative mt-3 group-data-[collapsible=icon]:hidden">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <SidebarInput
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            <FileText className="mr-2 h-4 w-4" />
            Atendimentos ({filteredAtendimentos.length})
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <SidebarMenu>
                {filteredAtendimentos.length === 0 ? (
                  <div className="px-2 py-8 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                    {searchQuery
                      ? "Nenhum atendimento encontrado"
                      : "Nenhum atendimento salvo"}
                  </div>
                ) : (
                  filteredAtendimentos.map((atendimento) => {
                    const progress = getProgress(atendimento.checklistItems);
                    const checkedCount = atendimento.checklistItems.filter(
                      (i) => i.checked
                    ).length;
                    const totalCount = atendimento.checklistItems.length;

                    return (
                      <SidebarMenuItem key={atendimento.id}>
                        <SidebarMenuButton
                          isActive={currentId === atendimento.id}
                          onClick={() => onSelect(atendimento.id)}
                          className="h-auto py-3"
                          tooltip={atendimento.clientName}
                        >
                          <div className="flex w-full min-w-0 flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="font-medium text-sm truncate flex-1 min-w-0">
                                  {atendimento.clientName || "Sem nome"}
                                </span>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover/menu-item:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Excluir atendimento?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Está ação não pode ser desfeita. O
                                      atendimento de{" "}
                                      <strong>{atendimento.clientName}</strong>{" "}
                                      será permanentemente removido.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onDelete(atendimento.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>

                            <div className="w-full">
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0.5 whitespace-normal text-left leading-tight max-w-full inline-block"
                              >
                                {atendimento.benefitName || "Sem beneficio"}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(atendimento.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                {progress === 100 ? (
                                  <CheckCircle2 className="h-3 w-3 text-success" />
                                ) : (
                                  <Clock className="h-3 w-3 text-warning" />
                                )}
                                {checkedCount}/{totalCount}
                              </div>
                            </div>

                            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full transition-all ${
                                  progress === 100 ? "bg-success" : "bg-primary"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Icon mode */}
                          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <Button onClick={onNew} className="w-full group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0">
          <span className="group-data-[collapsible=icon]:hidden">Novo Atendimento</span>
          <FileText className="hidden group-data-[collapsible=icon]:block h-4 w-4" />
        </Button>
        <SidebarTrigger className="mt-2 w-full group-data-[collapsible=icon]:w-8" />
      </SidebarFooter>
    </Sidebar>
  );
}
