"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { getPasswordRequirementStatus } from "@/lib/passwordRequirements";

type PasswordRequirementsProps = {
  password: string;
  className?: string;
};

/**
 * Real-time checklist shown under a "new password" field (signup, reset
 * password) while the user types. Replaces the old static wall-of-text
 * error that only appeared after submit, with specific live feedback on
 * exactly what's still missing.
 *
 * Not intended for sign-in or confirm-password fields.
 */
export default function PasswordRequirements({
  password,
  className = "",
}: PasswordRequirementsProps) {
  const requirements = getPasswordRequirementStatus(password);

  return (
    <ul
      className={`mt-2 space-y-1 ${className}`}
      aria-label="Password requirements"
    >
      {requirements.map((requirement) => (
        <li
          key={requirement.id}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            requirement.met
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {requirement.met ? (
            <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <X className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>{requirement.label}</span>
        </li>
      ))}
    </ul>
  );
}
