import { cn } from "@/lib/utils";

type MenuToggleIconProps = {
  open?: boolean;
  className?: string;
};

export function MenuToggleIcon({ open = false, className }: MenuToggleIconProps) {
  return (
    <span className={cn("relative block size-5", className)} aria-hidden="true">
      <span
        className={cn(
          "absolute left-0 top-[5px] h-0.5 w-5 bg-current transition-transform duration-300",
          open && "translate-y-[4px] rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-[9px] h-0.5 w-5 bg-current transition-opacity duration-200",
          open && "opacity-0",
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-[13px] h-0.5 w-5 bg-current transition-transform duration-300",
          open && "-translate-y-[4px] -rotate-45",
        )}
      />
    </span>
  );
}