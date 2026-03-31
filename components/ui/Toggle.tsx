import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    return (
      <label className={cn("inline-flex items-center gap-2", className)}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          ref={ref}
          className="h-5 w-10 appearance-none rounded-full border border-input bg-gray-200 transition duration-200 checked:bg-primary checked:after:translate-x-5 checked:after:border-white checked:after:bg-white checked:after:content-[''] checked:after:absolute checked:after:top-0.5 checked:after:left-0.5 checked:after:h-4 checked:after:w-4 checked:after:rounded-full checked:after:shadow-sm"
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };