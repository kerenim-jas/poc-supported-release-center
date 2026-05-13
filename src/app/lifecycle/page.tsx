import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Vulnerability Lifecycle — visualization of Barak's state machine
 * (Screenshot 7 from the May 13 call).
 *
 * Two zones:
 *   1. SLA counting · No breach   (vuln exists in build only)
 *   2. SLA + breach              (vuln exists in release / prod)
 *
 * Transitions:
 *   Build  -> Backlog  -> Action  -> Released  -> Closed
 *   With back-edges from Released to Closed when not in prod or
 *   not in latest release (renovate auto-fix detected).
 */
export default function LifecyclePage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-2 flex items-center gap-2 text-[12px] text-[color:var(--text-tertiary)]">
        <Link href="/" className="hover:text-[color:var(--navy-600)]">
          Cores
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[color:var(--text-secondary)]">
          Vulnerability lifecycle
        </span>
      </div>

      <div className="mb-5">
        <h2 className="text-[20px] font-semibold text-[color:var(--text-primary)]">
          Vulnerability lifecycle
        </h2>
        <p className="mt-1 max-w-[820px] text-[12px] text-[color:var(--text-secondary)]">
          The state machine that powers every SLA pill and every
          &ldquo;exceeded SLA&rdquo; alert in this product. SLA timer starts the
          moment a vulnerability is first detected in a build, but a{" "}
          <em>breach</em> only counts once that vulnerability exists in a
          released or production version. (Source: Barak Haryati&rsquo;s SSDLC
          dashboard, May 2026.)
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border border-[color:var(--border-primary)] bg-[#0f1727] p-8">
        <svg
          viewBox="0 0 1100 380"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-auto max-w-full"
          style={{ minWidth: 920 }}
        >
          <defs>
            <marker
              id="arr"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a0c8a0" />
            </marker>
          </defs>

          {/* Zone 1 — SLA Counting · No Breach */}
          <rect
            x="20"
            y="20"
            width="240"
            height="340"
            rx="6"
            fill="rgba(255,255,255,0.04)"
            stroke="#3a486a"
            strokeWidth="1"
          />
          <text x="40" y="50" fill="#c9d0e3" fontSize="12" fontWeight="600">
            SLA Counting · No Breach
          </text>

          {/* Zone 2 — SLA + Breach */}
          <rect
            x="280"
            y="20"
            width="800"
            height="340"
            rx="6"
            fill="rgba(255,255,255,0.04)"
            stroke="#3a486a"
            strokeWidth="1"
          />
          <text x="300" y="50" fill="#c9d0e3" fontSize="12" fontWeight="600">
            SLA + Breach (vuln in release or prod)
          </text>

          {/* Trigger: Vul Exist in Build */}
          <rect
            x="50"
            y="180"
            width="120"
            height="50"
            rx="6"
            fill="#1d6fa5"
          />
          <text
            x="110"
            y="205"
            fill="white"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            Vul exists in build
          </text>
          <text
            x="110"
            y="220"
            fill="white"
            fontSize="9"
            textAnchor="middle"
            opacity="0.85"
          >
            (detection)
          </text>

          {/* Backlog */}
          <rect
            x="190"
            y="180"
            width="80"
            height="50"
            rx="6"
            fill="#a8d5a8"
            opacity="0.85"
          />
          <text
            x="230"
            y="210"
            fill="#0f1727"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            Backlog
          </text>

          {/* Action */}
          <rect
            x="320"
            y="180"
            width="80"
            height="50"
            rx="6"
            fill="#a8d5a8"
            opacity="0.85"
          />
          <text
            x="360"
            y="210"
            fill="#0f1727"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            Action
          </text>
          <text
            x="360"
            y="160"
            fill="#c9d0e3"
            fontSize="10"
            textAnchor="middle"
          >
            Vul exists in release & prod
          </text>

          {/* Dev Done check */}
          <rect
            x="450"
            y="170"
            width="120"
            height="70"
            rx="6"
            fill="#f7d57a"
            opacity="0.95"
          />
          <text
            x="510"
            y="195"
            fill="#0f1727"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
          >
            Dev done?
          </text>
          <text
            x="510"
            y="210"
            fill="#0f1727"
            fontSize="9"
            textAnchor="middle"
          >
            (manually OR
          </text>
          <text
            x="510"
            y="222"
            fill="#0f1727"
            fontSize="9"
            textAnchor="middle"
          >
            in latest build)
          </text>

          {/* Released */}
          <rect
            x="620"
            y="180"
            width="80"
            height="50"
            rx="6"
            fill="#a8d5a8"
            opacity="0.85"
          />
          <text
            x="660"
            y="210"
            fill="#0f1727"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            Released
          </text>
          <text
            x="660"
            y="160"
            fill="#c9d0e3"
            fontSize="10"
            textAnchor="middle"
          >
            Vul exists in prod only
          </text>

          {/* Closed */}
          <rect
            x="970"
            y="180"
            width="80"
            height="50"
            rx="6"
            fill="#a8d5a8"
            opacity="0.85"
          />
          <text
            x="1010"
            y="205"
            fill="#0f1727"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            Closed
          </text>
          <text
            x="1010"
            y="220"
            fill="#0f1727"
            fontSize="9"
            textAnchor="middle"
          >
            ✓
          </text>
          <text
            x="1010"
            y="160"
            fill="#c9d0e3"
            fontSize="10"
            textAnchor="middle"
          >
            Vul not in runtime or release
          </text>

          {/* Arrows */}
          <path d="M170 205 L185 205" stroke="#a0c8a0" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
          <path d="M270 205 L315 205" stroke="#a0c8a0" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
          <path d="M400 205 L445 205" stroke="#a0c8a0" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
          <path d="M570 205 L615 205" stroke="#a0c8a0" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
          <path d="M700 205 L965 205" stroke="#a0c8a0" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
          <text x="800" y="195" fill="#a0c8a0" fontSize="10" textAnchor="middle">
            If release & not exist in prod
          </text>

          {/* Loop: from Released back to Action */}
          <path
            d="M660 230 Q500 320 360 230"
            stroke="#a0c8a0"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            markerEnd="url(#arr)"
            fill="none"
          />
          <text x="510" y="320" fill="#a0c8a0" fontSize="9" textAnchor="middle">
            If not detected in latest release (renovate)
          </text>

          {/* Loop: backlog skip-to-closed */}
          <path
            d="M230 230 Q500 360 1010 230"
            stroke="#a0c8a0"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            markerEnd="url(#arr)"
            fill="none"
          />
          <text x="630" y="358" fill="#a0c8a0" fontSize="9" textAnchor="middle">
            If not in release & not exist in prod
          </text>
        </svg>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Card title="Why the SLA &lsquo;sleeps&rsquo; in Backlog">
          <p>
            Once a CVE is detected in a build, the SLA clock starts ticking, but
            no breach is recorded yet. The vuln is in &ldquo;rest mode&rdquo; — if it
            gets fixed before the build reaches Release or Prod, the timer
            simply ends without ever firing an alert.
          </p>
          <p className="mt-2">
            The moment the affected build is promoted, any unresolved CVE
            immediately moves from &ldquo;rest&rdquo; into the breach window
            calculated against detection time, not promotion time. This prevents
            the &ldquo;found in build, sat there 3 months, then promoted yesterday and
            we have 5 days&rdquo; gaming.
          </p>
        </Card>
        <Card title="Auto-close via Renovate / Mend / manual fix">
          <p>
            When the Released CVE no longer appears in the next build (because
            Renovate updated the package, Mend opened a fixing PR, or a
            developer manually upgraded the dependency), it transitions to{" "}
            <strong>Closed</strong> automatically.
          </p>
          <p className="mt-2">
            This is the single biggest gap Barak called out in the call:{" "}
            <em>JFrog&rsquo;s built-in Jira integration is broken</em> — it doesn&rsquo;t
            recognize duplicates and doesn&rsquo;t auto-close. The replacement
            JFrog-native Jira sync needs to honor this state machine.
          </p>
        </Card>
        <Card title="Branch-aware closing">
          <p>
            A scan-based auto-close MUST be tied to the branch the build came
            from. Closing the &lsquo;wrong&rsquo; branch&rsquo;s ticket because we saw the
            CVE go away on master breaks SLA for older minor branches. Branch
            data is therefore a hard requirement, not a nice-to-have.
          </p>
        </Card>
        <Card title="What this enables">
          <p>
            Once the lifecycle is canonical, every other view in this product
            becomes consistent: SLA pills on the Cores page, the Within /
            Exceeded / No Data buckets on a service, the cell colors in the CVE
            matrix, and the auto-generated executive reports.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[color:var(--border-primary)] bg-white p-4">
      <h3 className="mb-2 text-[13px] font-semibold text-[color:var(--text-primary)]">
        {title}
      </h3>
      <div className="space-y-1 text-[12px] leading-relaxed text-[color:var(--text-secondary)]">
        {children}
      </div>
    </div>
  );
}
