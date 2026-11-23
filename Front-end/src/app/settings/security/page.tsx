"use client";

import { FormEvent, useState } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

export default function SecuritySettingsPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/set-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        setError(result.message || "Could not set your password.");
        return;
      }

      setSuccess(result.message || "Password set successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not connect to the server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Account security
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Set a password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with Google first, then set a password for this account. Both
          sign-in methods will remain available.
        </p>

        <form className="mt-8 space-y-5" onSubmit={submitPassword}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="new-password"
            >
              New password
            </label>
            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="new-password"
              minLength={8}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              type="password"
              value={newPassword}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              At least 8 characters.
            </p>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="confirm-password"
            >
              Confirm new password
            </label>
            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="confirm-password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-emerald-700" role="status">
              {success}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Set password"}
          </button>
        </form>
      </section>
    </main>
  );
}
