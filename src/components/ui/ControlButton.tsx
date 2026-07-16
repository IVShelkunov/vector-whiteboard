import type { ReactNode } from "react";
import { cn } from "../../lib/utils/clsxUtils";

interface ControlButtonProps {
  action: () => void;
  condition: boolean;
  variant: "undo" | "redo" | "clear";
  children: ReactNode;
}

export default function ControlButton({
  action,
  condition,
  variant,
  children,
}: ControlButtonProps) {
  const variants = {
    undo: "bg-indigo-600/80 hover:bg-indigo-500 text-white",
    redo: "bg-indigo-600/80 hover:bg-indigo-500 text-white",
    clear: "bg-red-500/80 hover:bg-red-500 text-white",
  };
  return (
    <button
      onClick={action}
      disabled={!condition}
      className={cn(
        "rounded-xl px-5 py-2.5 font-medium transition-all duration-200", // Базовые стили
        "active:scale-95 shadow-lg", // Эффект нажатия
        condition
          ? variants[variant]
          : "bg-slate-700 opacity-50 cursor-not-allowed", // Состояния
      )}
    >
      {children}
    </button>
  );
}
