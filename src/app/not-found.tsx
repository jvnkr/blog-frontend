"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-[#272629] bg-zinc-900/30 p-8 text-center backdrop-blur-[1px]">
        <h2 className="text-4xl font-bold text-zinc-800 [text-shadow:_-1px_-1px_0_#71717a,_1px_-1px_0_#71717a,_-1px_1px_0_#71717a,_1px_1px_0_#71717a] tracking-[10px] text-[64px]">
          404
        </h2>
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-zinc-100">Page Not Found</p>
          <p className="text-lg text-zinc-500">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
        <button
          onClick={() => router.replace("/home")}
          className="rounded-lg bg-zinc-800 px-6 py-2.5 text-zinc-100 transition-all hover:bg-zinc-700 active:scale-95"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
