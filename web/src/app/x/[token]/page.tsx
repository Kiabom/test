import { redirect } from "next/navigation";

export default async function ExitTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  redirect(`/verify/${token}`);
}
