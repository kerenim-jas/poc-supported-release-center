import { notFound } from "next/navigation";
import { ApplicationDetailView } from "@/components/ApplicationDetailView";
import { APPLICATIONS, RELEASES, getApplication } from "@/lib/fixtures";

export function generateStaticParams() {
  return APPLICATIONS.map((a) => ({ appId: a.id }));
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const application = getApplication(appId);
  if (!application) notFound();

  return (
    <ApplicationDetailView application={application} allReleases={RELEASES} />
  );
}
