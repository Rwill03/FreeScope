"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type TagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function TagInput({ value, onChange, placeholder = "Add skill…", className }: TagInputProps) {
  const [input, setInput] = React.useState("");

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (t && !value.includes(t)) {
      onChange([...value, t]);
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap gap-2 rounded-lg border border-[hsl(40,15%,90%)] bg-[hsl(40,20%,97%)] px-3 py-2 focus-within:ring-2 focus-within:ring-[hsl(0,0%,12%)] focus-within:ring-offset-2",
        className
      )}
    >
      {value.map((tag, i) => (
        <Badge
          key={i}
          className="cursor-pointer hover:bg-[hsl(40,15%,85%)]"
          onClick={() => removeTag(i)}
        >
          {tag} ×
        </Badge>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[120px] flex-1 bg-transparent text-base outline-none placeholder:text-[hsl(0,0%,42%)]"
      />
    </div>
  );
}
