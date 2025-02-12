"use client";

import { DashboardData, PostData } from "@/lib/types";
import React, { useEffect, useState } from "react";
import {
  ChartLegendContent,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import { Bar, BarChart, CartesianGrid, YAxis, XAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import useFetcher from "@/hooks/useFetcher";
import { HiOutlineUser } from "react-icons/hi";
import {
  Calendar,
  Flag,
  Heart,
  MessageSquare,
  NotepadText,
} from "lucide-react";
import { FaMedal } from "react-icons/fa";
import AvatarInfo from "../../profile/AvatarInfo";
import Tooltip from "../../Tooltip";
import { motion } from "framer-motion";
import Link from "next/link";
import { VirtualizedItems } from "../../VirtualizedItems";
import { useFetchItems } from "@/hooks/useFetchItems";
import { useAuthContext } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const DashboardPage = () => {
  const fetcher = useFetcher();
  const { accessToken } = useAuthContext();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const [dashboardPageNumber, setDashboardPageNumber] = useState(0);
  const [hasMoreDashboardPosts, setHasMoreDashboardPosts] = useState(true);
  const [dashboardPosts, setDashboardPosts] = useState<PostData[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  useEffect(() => {
    fetchDashboardData(selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    loading,
    initialLoading,
    fetchItems: fetchDashboardPosts,
  } = useFetchItems(
    dashboardPosts,
    setDashboardPosts,
    `/api/v1/dashboard/posts`,
    dashboardPageNumber,
    setDashboardPageNumber,
    hasMoreDashboardPosts,
    setHasMoreDashboardPosts
  );

  const fetchDashboardData = async (year: number) => {
    try {
      const response = await fetcher("/api/v1/dashboard", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          year,
        }),
      });
      const data = (await response.json()) as DashboardData;
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const chartConfig = {
    postsCount: {
      label: "Posts",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  if (!loading && dashboardData === null) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex text-center flex-col items-center">
          <span className="text-lg font-semibold text-muted-foreground">
            No data found
          </span>
          <span className="text-sm text-muted-foreground">
            When the data is available, it will appear here.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex overflow-hidden gap-4 h-full">
      <div className="flex relative flex-grow flex-col gap-4 w-full h-full min-h-[10rem]">
        <div className="gap-4 hidden xl:flex min-h-[106px]">
          <div
            className={`flex overflow-hidden relative border border-[#333236] p-4 gap-3 justify-between flex-col h-full bg-zinc-800 rounded-xl w-full${
              !dashboardData || initialLoading ? " animate-pulse" : ""
            }`}
            style={{ overflow: "hidden", minHeight: "106px" }}
          >
            {(!dashboardData || initialLoading) && (
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
            className={`flex overflow-hidden relative border border-[#333236] p-4 gap-3 justify-between flex-col h-full bg-zinc-800 rounded-xl w-full${
              !dashboardData || initialLoading ? " animate-pulse" : ""
            }`}
            style={{ overflow: "hidden", minHeight: "106px" }}
          >
            {(!dashboardData || initialLoading) && (
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
            className={`flex overflow-hidden relative border border-[#333236] p-4 gap-3 justify-between flex-col h-full bg-zinc-800 rounded-xl w-full${
              !dashboardData || initialLoading ? " animate-pulse" : ""
            }`}
            style={{ overflow: "hidden", minHeight: "106px" }}
          >
            {(!dashboardData || initialLoading) && (
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
          className={`flex flex-col gap-1 p-2 overflow-hidden relative border border-[#333236] rounded-xl w-full h-full bg-zinc-800${
            !dashboardData || initialLoading ? " animate-pulse" : ""
          }`}
          style={{ overflow: "hidden" }}
        >
          {dashboardData && (
            <div className="flex items-center gap-2">
              <Select
                value={`${selectedYear}`}
                onValueChange={(value) => {
                  setSelectedYear(parseInt(value));
                  fetchDashboardData(parseInt(value));
                }}
              >
                <SelectTrigger className="flex bg-zinc-900 border border-[#333236] justify-between gap-2 w-[130px]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <SelectValue placeholder="Year" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border border-[#333236] text-white">
                  {dashboardData?.earliestYear &&
                    Array.from(
                      {
                        length:
                          new Date().getFullYear() -
                          dashboardData.earliestYear +
                          1,
                      },
                      (_, index) => (
                        <SelectItem
                          key={index}
                          value={`${dashboardData.earliestYear + index}`}
                        >
                          {dashboardData.earliestYear + index}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>
          )}
          {(!dashboardData || initialLoading) && (
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
              className="pt-4 flex-grow pb-2 pr-4 min-h-[200px] w-full"
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
      <div className="hidden overflow-hidden flex-col gap-4 w-[24rem] h-full xl:flex">
        <div
          style={{
            minHeight:
              !dashboardData || initialLoading ? "359px" : "fit-content",
          }}
          className={`select-none min-h-0 relative border border-[#333236] flex flex-col flex-grow overflow-hidden gap-4 bg-zinc-800 rounded-xl w-full${
            !dashboardData || initialLoading ? " animate-pulse" : ""
          }`}
        >
          {(!dashboardData || initialLoading) && (
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
                className="sticky h-fit flex justify-center items-center top-0 text-xl font-bold w-full backdrop-blur-sm bg-zinc-900/80 border border-x-0 border-t-0 ml-[-1px] translate-x-[1px] border-b-[#333236] p-2 rounded-b-xl"
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
              <div className="flex flex-col flex-grow gap-5 p-4 pt-0 h-full">
                {dashboardData.topUsers.map((user, index) => (
                  <div
                    key={user.author.id}
                    className="flex justify-between items-center gap-3"
                  >
                    <div className="flex items-center truncate gap-3">
                      <div className="flex justify-center items-center w-6 h-6 min-w-6 min-h-6">
                        {index > 2 && (
                          <div
                            style={{
                              backgroundColor: "#2D2D33", // darker bg-zinc-700 equivalent
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // shading
                              border: "2px solid #444", // border
                              color: "#FFF", // text color for better contrast
                            }}
                            className="text-[0.8rem] rounded-full min-w-6 min-h-6 w-6 h-6 flex items-center justify-center font-bold"
                          >
                            {index + 1}
                          </div>
                        )}
                        {index <= 2 && (
                          <FaMedal
                            style={{
                              fill:
                                index + 1 === 1
                                  ? "#FFD700" // brighter gold
                                  : index + 1 === 2
                                  ? "#C0C0C0" // brighter silver
                                  : "#CD7F32", // brighter bronze
                              color:
                                index + 1 === 1
                                  ? "#FFD700" // brighter gold
                                  : index + 1 === 2
                                  ? "#C0C0C0" // brighter silver
                                  : "#CD7F32", // brighter bronze
                              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                              transform: "scale(1.2)",
                            }}
                            className="w-4 h-4 min-w-4 min-h-4"
                          />
                        )}
                      </div>
                      <AvatarInfo
                        target="_blank"
                        linkHref={`/@${user.author.username}`}
                        username={user.author.username}
                        name={user.author.name}
                        verified={user.author.verified}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center text-zinc-400 text-lg">
                      <span className="text-sm mb-[-2px] font-semibold">
                        {user.posts}
                      </span>
                      <span className="text-sm mt-[-2px]">posts</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div
          className={`select-none rounded-xl flex flex-shrink-[100] relative border border-[#333236] flex-col w-full h-full overflow-x-hidden bg-zinc-800 rounded-xl${
            !dashboardData || initialLoading
              ? " animate-pulse overflow-hidden"
              : "overflow-y-auto"
          }`}
        >
          {(!dashboardData || initialLoading) && (
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
              <VirtualizedItems
                isWindowVirtualizer={false}
                paddingStart={16}
                ItemComponent={(index) => (
                  <div
                    className="flex relative flex-col items-center gap-0"
                    key={dashboardPosts[index].id}
                  >
                    <div
                      style={{
                        zIndex: 1,
                      }}
                      className="flex w-full bg-[#2D2D33] border border-[#333236] rounded-xl p-2"
                    >
                      <AvatarInfo
                        target="_blank"
                        linkHref={`/@${dashboardPosts[index].author.username}`}
                        username={dashboardPosts[index].author.username}
                        name={dashboardPosts[index].author.name}
                        verified={dashboardPosts[index].author.verified}
                        createdAt={new Date(dashboardPosts[index].createdAt)}
                      />
                    </div>
                    <div className="flex rounded-t-xl absolute top-0 bg-zinc-900 w-full h-[59px]"></div>
                    <Link
                      href={`/post/${dashboardPosts[index].id}`}
                      target="_blank"
                      className="flex flex-col bg-zinc-900 w-full h-fit rounded-b-xl p-2"
                    >
                      <span className="text-lg font-bold break-all">
                        {dashboardPosts[index].title}
                      </span>
                      <span className="text-sm break-all">
                        {dashboardPosts[index].description}
                      </span>
                      <div className="flex mt-2 w-full h-fit items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm">
                            {dashboardPosts[index].likes}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">
                            {dashboardPosts[index].comments}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
                id={"topPosts"}
                items={dashboardPosts}
                loading={loading}
                initialLoading={initialLoading}
                skeletonCount={0}
                hasMoreItems={hasMoreDashboardPosts}
                onEndReached={fetchDashboardPosts}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
