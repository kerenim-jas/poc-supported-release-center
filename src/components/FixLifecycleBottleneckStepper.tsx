import type { FixBottleneck, FixLifecycleStage } from "@/lib/types";

const STAGES: { id: FixLifecycleStage; label: string }[] = [
  { id: "code-fixed", label: "Code Fixed" },
  { id: "build-pending", label: "Build Pending" },
  { id: "released", label: "Released" },
  { id: "rolling-out", label: "Rolling Out" },
];

const STAGE_SHORT: Record<FixLifecycleStage, string> = {
  "code-fixed": "Code fixed",
  "build-pending": "Build pending",
  released: "Released",
  "rolling-out": "Rolling out",
};

function stuckIndex(stage: FixLifecycleStage) {
  return STAGES.findIndex((s) => s.id === stage);
}

function rowLabel(b: FixBottleneck) {
  const scope = b.serviceLabel ?? b.applicationName;
  return `${scope} · ${STAGE_SHORT[b.currentStage]}`;
}

function Connector({
  variant,
}: {
  variant: "done" | "stuck" | "future";
}) {
  if (variant === "stuck") {
    return (
      <div
        className="mx-0.5 mt-[3px] h-[2px] min-w-[28px] flex-1 border-t-2 border-dashed border-[color:var(--severity-high)]"
        aria-hidden
      />
    );
  }

  return (
    <div
      className={`mx-0.5 mt-[4px] h-[2px] min-w-[28px] flex-1 ${
        variant === "done"
          ? "bg-[color:var(--brand-green)]"
          : "bg-[color:var(--border-secondary)]"
      }`}
      aria-hidden
    />
  );
}

function StageNode({
  index,
  stuckAt,
  label,
  count,
  avgDays,
}: {
  index: number;
  stuckAt: number;
  label: string;
  count?: number;
  avgDays?: number;
}) {
  const isStuck = index === stuckAt;
  const isDone = index < stuckAt;
  const r = 5;

  return (
    <div className="flex min-w-0 flex-col items-center">
      <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden>
        {isStuck ? (
          <>
            <circle
              cx={7}
              cy={7}
              r={6}
              fill="none"
              stroke="var(--severity-high)"
              strokeWidth={1.5}
              opacity={0.4}
            />
            <circle cx={7} cy={7} r={r} fill="var(--severity-high)" />
          </>
        ) : isDone ? (
          <circle cx={7} cy={7} r={r} fill="var(--brand-green)" />
        ) : (
          <circle
            cx={7}
            cy={7}
            r={r - 1}
            fill="var(--surface-primary)"
            stroke="var(--border-secondary)"
            strokeWidth={2}
          />
        )}
      </svg>
      <span className="mt-1 max-w-[72px] text-center text-[10px] leading-[14px] text-[color:var(--text-tertiary)]">
        {label}
      </span>
      {isStuck && count != null && avgDays != null ? (
        <p className="mt-1 whitespace-nowrap text-center">
          <span className="text-label1-semibold text-[color:var(--text-primary)]">
            {count} {count === 1 ? "fix" : "fixes"}
          </span>
          <span className="text-body2-regular text-[color:var(--text-tertiary)]">
            {" "}
            · {avgDays}d avg
          </span>
        </p>
      ) : null}
    </div>
  );
}

export function FixLifecycleBottleneckRow({ bottleneck }: { bottleneck: FixBottleneck }) {
  const stuckAt = stuckIndex(bottleneck.currentStage);

  return (
    <div className="flex flex-col gap-[var(--space-xs)]">
      <p className="text-body2-regular text-[color:var(--text-primary)]">
        {rowLabel(bottleneck)}
      </p>
      <div className="flex w-full items-start">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex min-w-0 flex-1 items-start">
            {i > 0 ? (
              <Connector
                variant={
                  i === stuckAt
                    ? "stuck"
                    : i <= stuckAt
                      ? "done"
                      : "future"
                }
              />
            ) : null}
            <StageNode
              index={i}
              stuckAt={stuckAt}
              label={stage.label}
              count={i === stuckAt ? bottleneck.count : undefined}
              avgDays={i === stuckAt ? bottleneck.avgDays : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const MAX_ROWS = 5;

export function FixLifecycleBottlenecksWidget({
  bottlenecks,
}: {
  bottlenecks: FixBottleneck[];
}) {
  const visible = bottlenecks.slice(0, MAX_ROWS);
  const overflow = bottlenecks.length - MAX_ROWS;

  return (
    <div className="rounded-[var(--radius-s)] border-[2px] border-[color:var(--green-500)] bg-[color:var(--green-100)]/35 p-4 shadow-sm">
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Fix Lifecycle Bottlenecks
      </h3>
      <div className="mt-4 flex flex-col gap-[var(--space-m)]">
        {visible.map((b, i) => (
          <div
            key={`${b.serviceLabel ?? b.applicationName}-${b.currentStage}-${i}`}
            className="rounded-md bg-[color:var(--surface-primary)]/80 px-3 py-3 shadow-sm"
          >
            <FixLifecycleBottleneckRow bottleneck={b} />
          </div>
        ))}
      </div>
      {overflow > 0 ? (
        <p className="mt-3 text-center">
          <span className="cursor-default text-body2-regular text-[color:var(--text-link)]">
            +{overflow} more
          </span>
        </p>
      ) : null}
    </div>
  );
}
