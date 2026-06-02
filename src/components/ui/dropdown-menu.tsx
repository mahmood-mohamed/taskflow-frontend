"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode; asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ref,
      ...props,
    });
  }

  return (
    <button type="button" ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = ({
  children,
  align = "end",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}) => {
  const [isOpen, setIsOpen] = React.useContext(DropdownMenuContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl animate-in fade-in zoom-in-95 duration-200 mt-2",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const [, setIsOpen] = React.useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
    setIsOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted font-medium",
        className
      )}
    >
      {children}
    </button>
  );
};

// Context to manage state
const DropdownMenuContext = React.createContext<[boolean, (open: boolean) => void]>([
  false,
  () => {},
]);

const DropdownMenuRoot = ({ 
  children, 
  onOpenChange 
}: { 
  children: React.ReactNode; 
  onOpenChange?: (open: boolean) => void 
}) => {
  const [isOpen, setIsOpenState] = React.useState(false);

  const setIsOpen = React.useCallback((open: boolean) => {
    setIsOpenState(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  }, [onOpenChange]);

  return (
    <DropdownMenuContext.Provider value={[isOpen, setIsOpen]}>
      <DropdownMenu>{children}</DropdownMenu>
    </DropdownMenuContext.Provider>
  );
};

export {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
