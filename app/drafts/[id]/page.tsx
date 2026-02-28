"use client";

import { useParams } from "next/navigation";
import DraftEditor from "@/components/DraftEditor";

export default function DraftDetailPage() {
  const params = useParams<{ id: string }>();
  const draftId = Number.parseInt(params.id, 10);

  return <DraftEditor draftId={draftId} />;
}
