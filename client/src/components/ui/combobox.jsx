import React from "react";
// import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./popover";

const Combobox = React.forwardRef(({ children, ...props }, ref) => {
  return <Popover ref={ref} {...props}>{children}</Popover>;
});
Combobox.displayName = "Combobox";

const ComboboxTrigger = React.forwardRef(({ children, ...props }, ref) => {
  return <PopoverTrigger ref={ref} {...props}>{children}</PopoverTrigger>;
});
ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <PopoverContent
      ref={ref}
      className={cn("w-[200px]", className)}
      {...props}
    >
      {children}
    </PopoverContent>
  );
});
ComboboxContent.displayName = "ComboboxContent";

const ComboboxItem = ({ children, className, ...props }) => {
  return (
    <CommandItem className={cn("cursor-pointer", className)} {...props}>
      {children}
    </CommandItem>
  );
};

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
};
