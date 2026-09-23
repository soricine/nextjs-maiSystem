"use client";

import { Button, Card, Form, Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  FormAlert,
  RhfTextField,
  generalErrorMessage,
} from "@/components/ui/form";
import { Row } from "@/components/ui/layout";
import { useLogin } from "@/lib/api/auth";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, { onSuccess: () => router.push("/dashboard") }),
  );

  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Sign in</Card.Title>
        <Card.Description>Welcome back to your mailbox.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form
          validationBehavior="aria"
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
        >
          <FormAlert
            status="danger"
            message={generalErrorMessage(login.error)}
          />
          <RhfTextField
            control={control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <RhfTextField
            control={control}
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isDisabled={!formState.isValid || login.isPending}
            isPending={login.isPending}
          >
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
          <Row className="justify-between">
            <Link href="/forgot-password" className="text-sm">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-sm">
              Create an account
            </Link>
          </Row>
        </Form>
      </Card.Content>
    </Card>
  );
}
