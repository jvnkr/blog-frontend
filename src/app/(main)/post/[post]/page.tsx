import { fetcher } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const resolvedParams = await params;

  const cookieJar = await cookies();
  const res = await fetcher(
    `/api/v1/posts/${resolvedParams.post}`,
    {
      headers: {
        Authorization: `Bearer ${cookieJar.get("a_t")?.value}`,
        Cookie: cookieJar.toString(),
        "Content-Type": "application/json",
      },
    },
    cookieJar.toString()
  );
  if (res.status === 404) {
    redirect("/");
  }
  const data = await res.json();

  return <div>{JSON.stringify(data)}</div>;
}
