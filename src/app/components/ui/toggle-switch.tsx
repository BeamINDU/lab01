// src/app/components/ui/toggle-switch.tsx
"use client";

import React from "react";
import { cn } from "@/app/lib/utils"; 

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: ToggleSwitchProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-gray-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => onChange(!checked)}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && (
        <span className={cn("text-sm font-medium", disabled && "opacity-50")}>
          {label}
        </span>
      )}
    </div>
  );
}