"use client";

import { Alert } from "@heroui/react";

export type FormAlertProps = {
  status: "danger" | "success";
  title?: string;
  message: string | null | undefined;
};

export function FormAlert({ status, title, message }: FormAlertProps) {
  if (!message) return null;
  return (
    <Alert status={status}>
      <Alert.Indicator />
      <Alert.Content>
        {title ? <Alert.Title>{title}</Alert.Title> : null}
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
