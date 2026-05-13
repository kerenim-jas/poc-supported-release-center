import { notFound } from "next/navigation";
import { SERVICES, getCore, getService } from "@/lib/fixtures";
import { ServiceDetailClient } from "./ServiceDetailClient";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ serviceId: s.id }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const service = getService(serviceId);
  if (!service) notFound();
  const core = getCore(service.coreId);
  if (!core) notFound();
  return <ServiceDetailClient service={service} core={core} />;
}
