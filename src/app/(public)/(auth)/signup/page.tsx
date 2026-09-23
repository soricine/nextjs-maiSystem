"use client";

import { Button, Card, Form, Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  FormAlert,
  RhfTextField,
  applyServerFieldErrors,
  generalErrorMessage,
} from "@/components/ui/form";
import { Row } from "@/components/ui/layout";
import { useRegister } from "@/lib/api/auth";
import { signupFormSchema, type SignupFormInput } from "@/lib/validation/auth";

const FIELDS = ["name", "email", "password"];

export default function SignupPage() {
  const router = useRouter();
  const signup = useRegister();
  const { control, handleSubmit, formState, setError } =
    useForm<SignupFormInput>({
      resolver: zodResolver(signupFormSchema),
      mode: "onChange",
      defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

  const onSubmit = handleSubmit(({ confirmPassword: _confirm, ...values }) =>
    signup.mutate(values, {
      onSuccess: () => router.push("/dashboard"),
      onError: (error) => applyServerFieldErrors(error, setError, FIELDS),
    }),
  );

  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>Create your account</Card.Title>
        <Card.Description>
          A mailbox for your physical mail, readable anywhere.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form
          validationBehavior="aria"
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
        >
          <FormAlert
            status="danger"
            message={generalErrorMessage(signup.error, FIELDS)}
          />
          <RhfTextField
            control={control}
            name="name"
            label="Full name"
            autoComplete="name"
            autoFocus
          />
          <RhfTextField
            control={control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <RhfTextField
            control={control}
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            description="At least 8 characters, with a letter and a number."
          />
          <RhfTextField
            control={control}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isDisabled={!formState.isValid || signup.isPending}
            isPending={signup.isPending}
          >
            {signup.isPending ? "Creating account…" : "Create account"}
          </Button>
          <Row className="justify-center">
            <Link href="/login" className="text-sm">
              Already have an account? Sign in
            </Link>
          </Row>
        </Form>
      </Card.Content>
    </Card>
  );
}
