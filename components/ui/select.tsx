"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { cn } from "./utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: () => void;
}

export function Select({ value, onValueChange, placeholder, children, className }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value || placeholder}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
              onSelect: () => {
                onValueChange?.((child.props as SelectItemProps).value);
                setOpen(false);
              },
            });
          }
          return child;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SelectItem({ value, children, onSelect }: SelectItemProps) {
  return (
    <DropdownMenuItem onSelect={onSelect}>
      {children}
    </DropdownMenuItem>
  );
}