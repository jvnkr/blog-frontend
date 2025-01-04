"use client";

import { DashboardData } from "@/lib/types";
import React, { useEffect, useState } from "react";
import {
  ChartLegendContent,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Bar, BarChart, CartesianGrid, YAxis, XAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import useFetcher from "@/hooks/useFetcher";
import { HiOutlineUser } from "react-icons/hi";
import { Flag, Heart, MessageSquare, NotepadText } from "lucide-react";
import AvatarInfo from "./AvatarInfo";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const fetcher = useFetcher();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    const response = await fetcher("/api/v1/dashboard");
    const data = (await response.json()) as DashboardData;
    console.log(data);
    setDashboardData(data);
  };

  const chartConfig = {
    postsCount: {
      label: "Posts",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex overflow-hidden gap-4 h-full">
      <div className="flex relative flex-grow flex-col gap-4 w-full h-full">
        <div className="gap-4 hidden xl:flex">
          <div
            className={`flex overflow-hidden relative min-h-[106px] border border-[#333236] p-4 gap-3 justify-between flex-col h-fit bg-zinc-800 rounded-xl w-full${
              !dashboardData ? " animate-pulse" : ""
            }`}
          >
            {!dashboardData && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-600/10 to-transparent"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            {dashboardData && (
              <>
                <div className="flex items-center gap-2">
                  <NotepadText className="w-10 h-10" />
                  <span className="text-4xl font-bold">
                    {dashboardData.postsCount}
                  </span>
                </div>
                <span className="text-sm text-neutral-400">
                  Total count of posts
                </span>
              </>
            )}
          </div>
          <div
            className={`flex overflow-hidden relative min-h-[106px] border border-[#333236] p-4 gap-3 justify-between flex-col h-fit bg-zinc-800 rounded-xl w-full${
              !dashboardData ? " animate-pulse" : ""
            }`}
          >
            {!dashboardData && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-600/10 to-transparent"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            {dashboardData && (
              <>
                <div className="flex items-center gap-2">
                  <HiOutlineUser className="w-10 h-10" />
                  <span className="text-4xl font-bold">
                    {dashboardData.usersCount}
                  </span>
                </div>
                <span className="text-sm text-neutral-400">
                  Total count of users
                </span>
              </>
            )}
          </div>
          <div
            className={`flex overflow-hidden relative min-h-[106px] border border-[#333236] p-4 gap-3 justify-between flex-col h-fit bg-zinc-800 rounded-xl w-full${
              !dashboardData ? " animate-pulse" : ""
            }`}
          >
            {!dashboardData && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-600/10 to-transparent"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            {dashboardData && (
              <>
                <div className="flex items-center gap-2">
                  <Flag className="w-10 h-10" />
                  <span className="text-4xl font-bold">
                    {dashboardData.reportsCount}
                  </span>
                </div>
                <span className="text-sm text-neutral-400">
                  Total count of reports
                </span>
              </>
            )}
          </div>
        </div>
        <div
          className={`flex overflow-hidden relative border border-[#333236] rounded-xl w-full h-full bg-zinc-800${
            !dashboardData ? " animate-pulse" : ""
          }`}
        >
          {!dashboardData && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-600/10 to-transparent"
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          {dashboardData && (
            <ChartContainer
              config={chartConfig}
              className="pt-4 pb-2 pr-4 min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={dashboardData.postsPerMonth}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  dataKey="postsCount"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="postsCount"
                  fill="var(--color-posts)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </div>
      <div className="hidden overflow-hidden flex-shrink flex-col gap-4 w-[24rem] h-full xl:flex">
        <div
          style={{
            minHeight: !dashboardData ? "359px" : "fit-content",
          }}
          className={`select-none relative border border-[#333236] flex flex-col overflow-hidden gap-4 bg-zinc-800 rounded-xl w-full${
            !dashboardData ? " animate-pulse" : ""
          }`}
        >
          {!dashboardData && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-600/10 to-transparent"
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          {dashboardData && (
            <>
              <div
                style={{
                  zIndex: 3,
                }}
                className="sticky flex justify-center items-center top-0 text-xl font-bold w-full backdrop-blur-sm bg-zinc-900/80 border border-x-0 border-t-0 ml-[-1px] mr-[-1px] border-b-[#333236] p-2 rounded-b-xl"
              >
                <Tooltip
                  triggerStyle={{
                    width: "100%",
                    cursor: "help",
                    zIndex: 3,
                  }}
                  contentStyle={{
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    width: "13rem",
                  }}
                  tooltipTrigger={
                    <span
                      style={{
                        zIndex: 2,
                      }}
                      className="absolute left-0 top-0 flex justify-center items-center h-full w-full"
                    >
                      Top Active Users
                    </span>
                  }
                  tooltipContent={
                    <div className="flex relative mb-4">
                      <span className="text-sm bg-zinc-900 border border-[#333236] rounded-xl p-2">
                        This section displays the top active users, ranked based
                        on the number of posts they have contributed.
                      </span>
                    </div>
                  }
                />
              </div>
              <div className="flex flex-col gap-5 p-4 pt-0 h-full">
                {dashboardData.topUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor:
                          index + 1 === 1
                            ? "#E6C200" // gold
                            : index + 1 === 2
                            ? "#A9A9A9" // darker silver
                            : index + 1 === 3
                            ? "#8B5A2B" // darker bronze
                            : "#2D2D33", // darker bg-zinc-700 equivalent
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // shading
                        border: "2px solid #444", // border
                        color: "#FFF", // text color for better contrast
                      }}
                      className="text-[0.8rem] rounded-full w-6 h-6 flex items-center justify-center font-bold"
                    >
                      {index + 1}
                    </div>
                    <AvatarInfo
                      username={user.username}
                      name={user.name}
                      verified={user.verified}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div
          className={`select-none rounded-xl flex relative border border-[#333236] flex-col w-full h-full gap-4 overflow-x-hidden bg-zinc-800 rounded-xl${
            !dashboardData
              ? " animate-pulse overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          {!dashboardData && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-600/10 to-transparent"
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          {dashboardData && (
            <>
              <div
                style={{
                  zIndex: 3,
                }}
                className="sticky flex justify-center items-center top-0 text-xl font-bold backdrop-blur-sm bg-zinc-900/70 border border-x-0 border-t-0 ml-[-1px] mr-[-1px] border-b-[#333236] p-2 rounded-b-xl"
              >
                <Tooltip
                  triggerStyle={{
                    width: "100%",
                    cursor: "help",
                    zIndex: 3,
                  }}
                  contentStyle={{
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    width: "13rem",
                  }}
                  tooltipTrigger={
                    <span
                      style={{
                        zIndex: 2,
                      }}
                      className="absolute left-0 top-0 flex justify-center items-center h-full w-full"
                    >
                      Top Performing Posts
                    </span>
                  }
                  tooltipContent={
                    <div className="flex h-fit w-full relative mb-4">
                      <span className="text-sm text-wrap bg-zinc-900 border border-[#333236] rounded-xl p-2">
                        These posts represent the highest performing content,
                        determined by a balanced algorithm that considers both
                        the number of likes and comments. This ensures that
                        posts excelling in both metrics are ranked higher.
                      </span>
                    </div>
                  }
                />
              </div>
              <div className="flex p-4 pt-0 flex-col gap-4">
                {dashboardData.topPosts.map((post, index) => (
                  <div
                    style={{
                      marginTop: index === 0 ? "0px" : "10px",
                    }}
                    className="flex relative flex-col items-center"
                    key={post.id}
                  >
                    <div
                      style={{
                        zIndex: 1,
                      }}
                      className="flex w-full bg-[#2D2D33] rounded-xl p-2"
                    >
                      <AvatarInfo
                        username={post.author.username}
                        name={post.author.name}
                        verified={post.author.verified}
                        createdAt={new Date(post.createdAt)}
                      />
                    </div>
                    <div className="flex rounded-t-xl absolute top-0 bg-zinc-900 w-full h-[56px]"></div>
                    <div className="flex flex-col bg-zinc-900 w-full h-fit rounded-b-xl p-2">
                      <span className="text-lg font-bold">{post.title}</span>
                      <span className="text-sm">{post.description}</span>
                      <div className="flex mt-2 w-full h-fit items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
