"use client";

import {
  Description,
  FieldError,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export type RhfTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  placeholder?: string;
  description?: string;
  isDisabled?: boolean;
  autoFocus?: boolean;
};

export function RhfTextField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  description,
  isDisabled,
  autoFocus,
}: RhfTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          name={field.name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          isDisabled={isDisabled}
          validationBehavior="aria"
          fullWidth
        >
          <Label>{label}</Label>
          <Input
            ref={field.ref}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            autoFocus={autoFocus}
          />
          {description ? <Description>{description}</Description> : null}
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}
