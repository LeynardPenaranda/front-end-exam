import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-emerald-700",
  secondary:
    "border-stone-300 bg-white text-stone-900 hover:bg-stone-100 focus-visible:outline-stone-500",
  ghost:
    "border-transparent bg-transparent text-stone-700 hover:bg-stone-100 focus-visible:outline-stone-500",
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
