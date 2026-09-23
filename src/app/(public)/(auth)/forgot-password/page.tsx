"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Form,
  InputOTP,
  Label,
  Link,
  REGEXP_ONLY_DIGITS,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ButtonLink } from "@/components/ui/button-link";
import {
  FormAlert,
  RhfTextField,
  generalErrorMessage,
} from "@/components/ui/form";
import { Row, Stack } from "@/components/ui/layout";
import { MutedText } from "@/components/ui/typography";
import {
  useForgotPassword,
  useResetPassword,
  useVerifyOtp,
} from "@/lib/api/auth";
import {
  forgotPasswordSchema,
  newPasswordFormSchema,
  type ForgotPasswordInput,
  type NewPasswordFormInput,
} from "@/lib/validation/auth";

type Step = "email" | "otp" | "reset" | "done";

const STEP_COPY: Record<Step, { title: string; description: string }> = {
  email: {
    title: "Reset your password",
    description: "Enter your account email and we'll send you a 6-digit code.",
  },
  otp: {
    title: "Check your email",
    description: "Enter the 6-digit code to continue.",
  },
  reset: {
    title: "Choose a new password",
    description: "You're almost done — set a new password for your account.",
  },
  done: {
    title: "Password updated",
    description: "Your password has been changed.",
  },
};

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  return (
    <Card className="w-full">
      <Card.Header>
        <Card.Title>{STEP_COPY[step].title}</Card.Title>
        <Card.Description>{STEP_COPY[step].description}</Card.Description>
      </Card.Header>
      <Card.Content>
        {step === "email" && (
          <EmailStep
            onSent={(sentTo) => {
              setEmail(sentTo);
              setStep("otp");
            }}
          />
        )}
        {step === "otp" && (
          <OtpStep
            email={email}
            onVerified={(token) => {
              setResetToken(token);
              setStep("reset");
            }}
            onChangeEmail={() => setStep("email")}
          />
        )}
        {step === "reset" && (
          <ResetStep resetToken={resetToken} onDone={() => setStep("done")} />
        )}
        {step === "done" && <DoneStep />}
      </Card.Content>
    </Card>
  );
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const forgot = useForgotPassword();
  const { control, handleSubmit, formState } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) =>
    forgot.mutate(values, { onSuccess: () => onSent(values.email) }),
  );

  return (
    <Form
      validationBehavior="aria"
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      <FormAlert status="danger" message={generalErrorMessage(forgot.error)} />
      <RhfTextField
        control={control}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
      />
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isDisabled={!formState.isValid || forgot.isPending}
        isPending={forgot.isPending}
      >
        {forgot.isPending ? "Sending code…" : "Send code"}
      </Button>
      <Row className="justify-center">
        <Link href="/login" className="text-sm">
          Back to sign in
        </Link>
      </Row>
    </Form>
  );
}

function OtpStep({
  email,
  onVerified,
  onChangeEmail,
}: {
  email: string;
  onVerified: (resetToken: string) => void;
  onChangeEmail: () => void;
}) {
  const [otp, setOtp] = useState("");
  const verify = useVerifyOtp();
  const resend = useForgotPassword();

  const submit = (code: string) =>
    verify.mutate(
      { email, otp: code },
      { onSuccess: ({ resetToken }) => onVerified(resetToken) },
    );

  return (
    <Stack className="gap-4">
      <MutedText>
        We sent a code to {email} if an account exists for it. The code expires
        in 15 minutes.
      </MutedText>
      <FormAlert status="danger" message={generalErrorMessage(verify.error)} />
      <FormAlert
        status="success"
        message={resend.isSuccess ? "A new code is on its way." : null}
      />
      <Stack className="gap-2">
        <Label>6-digit code</Label>
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={(value) => {
            setOtp(value);
            if (verify.error) verify.reset();
          }}
          onComplete={(value: string) => submit(value)}
          isDisabled={verify.isPending}
          isInvalid={!!verify.error}
          autoFocus
        >
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP>
      </Stack>
      <Button
        variant="primary"
        fullWidth
        isDisabled={otp.length < 6 || verify.isPending}
        isPending={verify.isPending}
        onPress={() => submit(otp)}
      >
        {verify.isPending ? "Verifying…" : "Verify code"}
      </Button>
      <Row className="justify-between">
        <Button
          variant="ghost"
          size="sm"
          isDisabled={resend.isPending}
          onPress={() => {
            setOtp("");
            verify.reset();
            resend.mutate({ email });
          }}
        >
          Resend code
        </Button>
        <Button variant="ghost" size="sm" onPress={onChangeEmail}>
          Use a different email
        </Button>
      </Row>
    </Stack>
  );
}

function ResetStep({
  resetToken,
  onDone,
}: {
  resetToken: string;
  onDone: () => void;
}) {
  const reset = useResetPassword();
  const { control, handleSubmit, formState } = useForm<NewPasswordFormInput>({
    resolver: zodResolver(newPasswordFormSchema),
    mode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(({ newPassword }) =>
    reset.mutate({ resetToken, newPassword }, { onSuccess: onDone }),
  );

  return (
    <Form
      validationBehavior="aria"
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      <FormAlert status="danger" message={generalErrorMessage(reset.error)} />
      <RhfTextField
        control={control}
        name="newPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        description="At least 8 characters, with a letter and a number."
        autoFocus
      />
      <RhfTextField
        control={control}
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
      />
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isDisabled={!formState.isValid || reset.isPending}
        isPending={reset.isPending}
      >
        {reset.isPending ? "Updating password…" : "Update password"}
      </Button>
    </Form>
  );
}

function DoneStep() {
  return (
    <Stack className="gap-4">
      <FormAlert
        status="success"
        message="Password updated. Sign in with your new password."
      />
      <ButtonLink href="/login" variant="primary" fullWidth>
        Go to sign in
      </ButtonLink>
    </Stack>
  );
}
