/**
 * Shared password policy used across every signup / password-reset flow.
 *
 * This mirrors the Supabase Auth Dashboard configuration exactly
 * (Authentication → Sign In / Providers → Email):
 *   - Minimum length: 8 characters
 *   - Required: lowercase, uppercase, digit, and symbol
 *
 * Keeping this in one place means the real-time checklist UI and the
 * client-side submit guard can never drift out of sync with each other,
 * and both should stay in sync with the server-side policy above.
 */

export type PasswordRequirementId =
  | "length"
  | "uppercase"
  | "lowercase"
  | "number"
  | "symbol";

export type PasswordRequirement = {
  id: PasswordRequirementId;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number (0-9)",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "symbol",
    label: "One symbol (e.g. !@#$%)",
    test: (password) => /[^A-Za-z0-9\s]/.test(password),
  },
];

export type PasswordRequirementStatus = PasswordRequirement & { met: boolean };

/** Returns each requirement paired with whether the given password satisfies it. */
export function getPasswordRequirementStatus(
  password: string
): PasswordRequirementStatus[] {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    met: requirement.test(password),
  }));
}

/** True only when every requirement in the policy is satisfied. */
export function isPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(password));
}

/**
 * Fallback message for the client-side submit guard. The real-time
 * checklist communicates specifics as the user types, so this only
 * needs to appear if a user somehow submits without seeing/heeding it.
 */
export const PASSWORD_POLICY_ERROR_MESSAGE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.";
