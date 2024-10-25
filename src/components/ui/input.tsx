import * as React from "react";
import { cn } from "@/lib/utils";

// No need for a separate interface; use React.InputHTMLAttributes directly
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border  bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 border-neutral-800 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
