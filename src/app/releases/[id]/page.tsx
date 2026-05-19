import { notFound } from "next/navigation";
import { ReleaseDetailView } from "@/components/ReleaseDetailView";
import { RELEASES, getApplication } from "@/lib/fixtures";

export function generateStaticParams() {
  return RELEASES.map((r) => ({ id: r.id }));
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const release = RELEASES.find((r) => r.id === id);
  if (!release) notFound();

  const application = getApplication(release.applicationId);
  if (!application) notFound();

  const siblingsSameImage = RELEASES.filter(
    (r) => r.imageName === release.imageName,
  );

  return (
    <ReleaseDetailView
      release={release}
      application={application}
      siblingsSameImage={siblingsSameImage}
    />
  );
}
