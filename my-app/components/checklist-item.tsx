"use client";

import React from "react"

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  text: string;
  checked: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onRemove: (id: string) => void;
}

export function ChecklistItem({
  id,
  text,
  checked,
  onToggle,
  onEdit,
  onRemove,
}: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          autoFocus
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 text-success hover:bg-success/10 hover:text-success"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
        checked
          ? "border-success/30 bg-success/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={() => onToggle(id)}
        className="h-5 w-5"
      />
      <label
        htmlFor={id}
        className={`flex-1 cursor-pointer text-sm ${
          checked ? "text-muted-foreground line-through" : "text-foreground"
        }`}
      >
        {text}
      </label>
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onRemove(id)}
          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
