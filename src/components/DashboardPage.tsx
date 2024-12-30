"use client";

import { useAuthContext } from "@/context/AuthContext";
import { Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import React from "react";
import { ChartLegendContent, ChartLegend, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, BarChart, CartesianGrid, YAxis, XAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const DashboardPage = () => {
  const { loggedIn, role } = useAuthContext();
  const router = useRouter();
  if (!loggedIn || role !== Role.ADMIN) {
    router.replace("/home");
    return null;
  }
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex gap-4 h-full">
      <div className="flex flex-grow flex-col gap-4 w-full h-full">
        <div className="gap-4 hidden xl:flex">
          <div className="h-[12rem] bg-zinc-800 rounded-xl w-full">
            Total Number of Posts
          </div>
          <div className="h-[12rem] bg-zinc-800 rounded-xl w-full">
            Total Number of Users
          </div>
          <div className="h-[12rem] bg-zinc-800 rounded-xl w-full">
            Total Number of Reports
          </div>
        </div>
        <div className="flex rounded-xl w-full h-full bg-zinc-800">
          <ChartContainer config={chartConfig} className="pt-4 pb-2 pr-4 min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                dataKey="desktop"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
      <div className="hidden flex-shrink flex-col gap-4 w-[20rem] h-full xl:flex">
        <div className="min-h-[12rem] bg-zinc-800 rounded-xl w-full">
          <div>User 1</div>
          <div>User 2</div>
          <div>User 3</div>
          <div>User 4</div>
          <div>User 5</div>
        </div>
        <div className="h-full bg-zinc-800 rounded-xl w-full">
          <div>Post 1</div>
          <div>Post 2</div>
          <div>Post 3</div>
          <div>Post 4</div>
          <div>Post 5</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
