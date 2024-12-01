import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const slug = await params;
  const profile = slug.profile;

  const decodedProfile = decodeURIComponent(profile).replace("%40", "@");
  // Check if profile starts with @ and decode URL encoding
  if (!decodedProfile.startsWith("@")) {
    redirect("/");
  }

  return <div>My Post: {decodedProfile}</div>;
}
