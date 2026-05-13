"use client";

import { X, ShieldCheck } from "lucide-react";
import { SecuredDistributionEvidence } from "@/lib/types";

export function EvidenceModal({
  evidence,
  onClose,
  serviceName,
  serviceVersion,
}: {
  evidence: SecuredDistributionEvidence;
  serviceName: string;
  serviceVersion: string;
  onClose: () => void;
}) {
  const json = {
    RBv2: {
      artifacts: evidence.artifacts.map((a) => ({
        path: a.path,
        sha256: a.sha256,
      })),
      created: true,
      distributed: evidence.distributed,
      name: evidence.bundleName,
      project: evidence.project,
      promoted: evidence.promoted,
      url: evidence.url,
      version: serviceVersion,
    },
    clamav: {
      infected_count: evidence.clamavInfectedCount,
      scan_results: [],
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-[720px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[color:var(--border-primary)] px-5 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[color:var(--green-500)]" />
            <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
              Secured Distribution Evidence
            </h2>
            <span className="ml-2 text-[12px] text-[color:var(--text-tertiary)]">
              {serviceName}@{serviceVersion}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-[color:var(--icon-secondary)] hover:bg-[color:var(--surface-tertiary)] hover:text-[color:var(--icon-primary)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="border-b border-[color:var(--border-primary)] px-5 py-3 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-[color:var(--text-secondary)]">
              RBv2 Signing Key:
            </span>
            <span className="font-semibold text-[color:var(--navy-600)] underline-offset-2 hover:underline">
              {evidence.signingKey}
            </span>
            <span className="ml-4 text-[color:var(--text-secondary)]">
              is_verified:
            </span>
            <span className="font-semibold text-[color:var(--green-500)]">
              {evidence.isVerified ? "True" : "False"}
            </span>
          </div>
        </div>

        <pre className="flex-1 overflow-auto bg-[color:var(--surface-secondary)] p-4 font-mono text-[11px] leading-relaxed text-[color:var(--text-primary)]">
{JSON.stringify(json, null, 2)}
        </pre>

        <footer className="border-t border-[color:var(--border-primary)] px-5 py-3 text-[11px] text-[color:var(--text-tertiary)]">
          This is the trust evidence Barak&rsquo;s SSDLC dashboard checks today
          (Release Bundle V2 + ssdlc-evidence signing). v0.2 of the Supported
          Release Center will source this from AppTrust evidence stores once
          available, with backfill from the legacy RBv2 path.
        </footer>
      </div>
    </div>
  );
}
