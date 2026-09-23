import { ApiError } from "@/lib/api/client";

/**
 * For mutation errors: the message to show in a FormAlert, or null when the
 * error is field-level and the caller has mapped it onto the form with
 * applyServerFieldErrors (so it is already visible next to its field).
 */
export function generalErrorMessage(
  error: unknown,
  handledFields: string[] = [],
): string | null {
  if (!error) return null;
  if (error instanceof ApiError) {
    const fields = Object.keys(error.fieldErrors ?? {});
    if (fields.length > 0 && fields.every((f) => handledFields.includes(f))) {
      return null;
    }
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

/** Copies server-side field errors onto the matching form fields. */
export function applyServerFieldErrors(
  error: unknown,
  setError: (name: never, error: { type: string; message: string }) => void,
  fields: string[],
): void {
  if (!(error instanceof ApiError) || !error.fieldErrors) return;
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    if (fields.includes(field) && messages.length > 0) {
      setError(field as never, { type: "server", message: messages[0] });
    }
  }
}
