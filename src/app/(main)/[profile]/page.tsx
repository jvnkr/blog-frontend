import Profile from "@/components/Profile";
import { fetcher } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const resolvedParams = await params;
  const decodedProfile = decodeURIComponent(resolvedParams.profile).replace(
    "%40",
    "@"
  );

  // Check if profile starts with @ and decode URL encoding
  if (!decodedProfile.startsWith("@")) {
    redirect("/");
  }

  const cookieJar = await cookies();
  const res = await fetcher(
    `/api/v1/users/${decodedProfile.slice(1)}`,
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

  if (!data.username) {
    redirect("/");
  }
  return <Profile {...data} />;
}
