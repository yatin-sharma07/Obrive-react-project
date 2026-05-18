"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
}

type RoleOption = "employee" | "client";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const },
  },
};

function formatNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "user";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function generateUserId(role: RoleOption) {
  const prefix = role === "employee" ? "EMP" : "CLT";
  return `${prefix}-${Date.now()}`;
}

export default function CreateUserDialog({
  open,
  onClose,
}: CreateUserDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleOption>("employee");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const derivedName = useMemo(() => formatNameFromEmail(email.trim()), [email]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setRole("employee");
      setSubmitting(false);
      setError("");
      setSuccess("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose, submitting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (role === "client") {
      setError(
        "Client creation is not available from the current backend. The existing schema stores clients in the same users table, but this project only exposes an employee-create endpoint for supervisors right now.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await apiFetch("/temp/add-employee", {
        method: "POST",
        body: JSON.stringify({
          userid: generateUserId(role),
          email: trimmedEmail,
          name: derivedName || "User",
          password: password.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || result?.error || "Failed to create user.",
        );
      }

      setSuccess("Employee account created successfully.");

      window.setTimeout(() => {
        onClose();
      }, 900);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create the user right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#041412]/45 p-4 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => {
            if (!submitting) {
              onClose();
            }
          }}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_rgba(7,65,57,0.18)]"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-[linear-gradient(135deg,#074139_0%,#0b5a4f_100%)] px-6 pb-10 pt-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                    Supervisor Access
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Create user</h2>
                  <p className="mt-2 max-w-sm text-sm text-white/80">
                    Add a new account with the current backend-supported user
                    fields.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="rounded-full bg-white/12 p-2 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Close create user dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="-mt-5 space-y-4 px-6 pb-6">
              <div className="rounded-[24px] border border-[#d7ebe6] bg-white p-4 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="create-user-email"
                      className="mb-1.5 block text-sm font-medium text-[#074139]"
                    >
                      Email
                    </label>
                    <input
                      id="create-user-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@obrive.com"
                      className="w-full rounded-2xl border border-[#d8e4e1] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#074139] focus:ring-2 focus:ring-[#074139]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="create-user-password"
                      className="mb-1.5 block text-sm font-medium text-[#074139]"
                    >
                      Password
                    </label>
                    <input
                      id="create-user-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-2xl border border-[#d8e4e1] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#074139] focus:ring-2 focus:ring-[#074139]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="create-user-role"
                      className="mb-1.5 block text-sm font-medium text-[#074139]"
                    >
                      Role
                    </label>
                    <select
                      id="create-user-role"
                      value={role}
                      onChange={(event) => {
                        setRole(event.target.value as RoleOption);
                        setError("");
                        setSuccess("");
                      }}
                      className="w-full rounded-2xl border border-[#d8e4e1] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#074139] focus:ring-2 focus:ring-[#074139]/15"
                    >
                      <option value="employee">Employee</option>
                      <option value="client">Client</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e1ece9] bg-[#f7fbfa] px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5d7b74]">
                  Backend mapping
                </p>
                <p className="mt-2 text-sm text-[#35574f]">
                  Prisma requires `userid`, `email`, `name`, `role`, and
                  `password`. The form derives `name` from the email and
                  generates a unique `userid`.
                </p>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="rounded-2xl border border-[#d8e4e1] px-4 py-3 text-sm font-medium text-[#35574f] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#074139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5248] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {submitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
