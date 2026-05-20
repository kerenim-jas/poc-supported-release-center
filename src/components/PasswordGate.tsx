"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

/**
 * Lightweight client-side password gate for the static-hosted POC.
 *
 * Security model:
 * - This is intended to deter casual / search-engine traffic while we're
 *   running validation calls. It is NOT a substitute for proper auth.
 * - The password hash is shipped to the browser; an attacker with the
 *   compiled JS could brute-force a weak password. Use a strong password.
 * - On success the result is cached in sessionStorage so reload doesn't
 *   re-prompt within the tab session.
 *
 * Default password: supported-releases-2026
 * SHA-256:           d186e439e4d3df46b7d62ae15cb65a5bc57a6fbc0df62df6fe3bc338ea6f2573
 *
 * To change the password:
 *   echo -n "your-new-password" | shasum -a 256
 * Replace PASSWORD_HASH below with the result.
 */

const PASSWORD_HASH =
  "d186e439e4d3df46b7d62ae15cb65a5bc57a6fbc0df62df6fe3bc338ea6f2573";
const STORAGE_KEY = "poc-supported-release-center-auth";

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // One-time initialization from sessionStorage — synchronous setState here
    // is intentional, not a render loop.
    let cached = false;
    try {
      cached = sessionStorage.getItem(STORAGE_KEY) === "ok";
    } catch {
      // sessionStorage may be unavailable (private browsing, etc.) — fall through.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(cached);
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  if (authed) {
    return <>{children}</>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const hash = await sha256(pwd);
      if (hash === PASSWORD_HASH) {
        sessionStorage.setItem(STORAGE_KEY, "ok");
        setAuthed(true);
      } else {
        setError("Incorrect password. Please try again.");
        setPwd("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[color:var(--background-plain)] px-4">
      <div className="w-full max-w-[400px] rounded-lg border border-[color:var(--border-primary)] bg-[color:var(--surface-primary)] p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--green-100)] text-[color:var(--green-500)]">
            <Lock className="h-5 w-5" />
          </div>
        </div>

        <h1 className="text-center text-[18px] font-semibold text-[color:var(--text-primary)]">
          Supported Release Center — v0.9
        </h1>
        <p className="mt-1 text-center text-[13px] text-[color:var(--text-secondary)]">
          Internal alignment preview. Built from Barak Haryati&rsquo;s SSDLC dashboard
          and Ambarish&rsquo;s CVE&times;Service matrix. Please enter the access password.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="password"
            autoFocus
            placeholder="Access password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            disabled={busy}
            aria-label="Access password"
            className="h-10 w-full rounded-md border border-[color:var(--border-secondary)] bg-[color:var(--surface-primary)] px-3 text-[14px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:border-[color:var(--navy-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--navy-500)]/20"
          />

          {error && (
            <p className="text-[12px] text-[color:var(--red-500)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy || !pwd}
            className="h-10 w-full rounded-md bg-[color:var(--green-500)] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Checking…" : "View POC"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-[color:var(--text-tertiary)]">
          Supported Release Center · internal alignment POC
        </p>
      </div>
    </div>
  );
}
