"use client";

import * as React from "react";
import {
  useFormContext,
  Controller,
  FormProvider,
} from "react-hook-form";

export function Form({ ...props }) {
  return <FormProvider {...props} />;
}

export function FormField({ name, render }) {
  const methods = useFormContext();
  return <Controller name={name} control={methods.control} render={render} />;
}

export const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={`space-y-2 ${className || ""}`} {...props} />
  );
});
FormItem.displayName = "FormItem";

export function FormLabel({ className, ...props }) {
  return (
    <label className={`text-sm font-medium ${className || ""}`} {...props} />
  );
}

export function FormControl({ children }) {
  return <>{children}</>;
}

export function FormDescription({ className, ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className || ""}`} {...props} />
  );
}

export function FormMessage({ className, children, ...props }) {
  if (!children) return null;
  console.log("FormMessage", children);
  return (
    <p className={`text-sm text-white-500 ${className || ""}`} {...props}>
      {children}
    </p>
  );
}
