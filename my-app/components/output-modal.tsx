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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, FileText, AlertTriangle } from "lucide-react";

interface ChecklistItemData {
  id: string;
  text: string;
  checked: boolean;
}

interface OutputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ChecklistItemData[];
  clientName: string;
  benefit: string;
}

export function OutputModal({
  open,
  onOpenChange,
  items,
  clientName,
  benefit,
}: OutputModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("pendentes");

  const pendingItems = items.filter((item) => !item.checked);
  const deliveredItems = items.filter((item) => item.checked);

  const generatePendingText = () => {
    if (pendingItems.length === 0) {
      return "Todos os documentos foram entregues!";
    }

    let text = "";
    if (clientName) {
      text += `*Documentos Pendentes - ${clientName}*\n`;
    } else {
      text += `*Documentos Pendentes*\n`;
    }
    if (benefit) {
      text += `Benefício: ${benefit}\n`;
    }
    text += "\n";
    pendingItems.forEach((item, index) => {
      text += `${index + 1}. ${item.text}\n`;
    });
    return text.trim();
  };

  const generateDeliveredText = () => {
    if (deliveredItems.length === 0) {
      return "Nenhum documento foi marcado como entregue.";
    }

    let text = "";
    if (clientName) {
      text += `*Documentos Entregues - ${clientName}*\n`;
    } else {
      text += `*Documentos Entregues*\n`;
    }
    if (benefit) {
      text += `Benefício: ${benefit}\n`;
    }
    text += "\n";
    deliveredItems.forEach((item, index) => {
      text += `${index + 1}. ${item.text}\n`;
    });
    return text.trim();
  };

  const generateCompleteText = () => {
    let text = "";
    if (clientName) {
      text += `*Checklist de Documentos - ${clientName}*\n`;
    } else {
      text += `*Checklist de Documentos*\n`;
    }
    if (benefit) {
      text += `Benefício: ${benefit}\n`;
    }
    text += "\n";

    if (deliveredItems.length > 0) {
      text += "✅ *Entregues:*\n";
      deliveredItems.forEach((item, index) => {
        text += `${index + 1}. ${item.text}\n`;
      });
      text += "\n";
    }

    if (pendingItems.length > 0) {
      text += "⏳ *Pendentes:*\n";
      pendingItems.forEach((item, index) => {
        text += `${index + 1}. ${item.text}\n`;
      });
    }

    return text.trim();
  };

  const getCurrentText = () => {
    switch (activeTab) {
      case "pendentes":
        return generatePendingText();
      case "entregues":
        return generateDeliveredText();
      case "completo":
        return generateCompleteText();
      default:
        return "";
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCurrentText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Lista de Documentos Formatada
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pendentes" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Pendentes ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="entregues" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Entregues ({deliveredItems.length})
            </TabsTrigger>
            <TabsTrigger value="completo" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Completo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="mt-4">
            <Textarea
              readOnly
              value={generatePendingText()}
              className="min-h-[250px] max-h-[60vh] w-full resize-none overflow-y-auto font-mono text-sm"
            />
          </TabsContent>

          <TabsContent value="entregues" className="mt-4">
            <Textarea
              readOnly
              value={generateDeliveredText()}
              className="min-h-[250px] max-h-[60vh] w-full resize-none overflow-y-auto font-mono text-sm"
            />
          </TabsContent>

          <TabsContent value="completo" className="mt-4">
            <Textarea
              readOnly
              value={generateCompleteText()}
              className="min-h-[250px] max-h-[60vh] w-full resize-none overflow-y-auto font-mono text-sm"
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handleCopy} className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
