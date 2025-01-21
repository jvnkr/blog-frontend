"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import useFetcher from "@/hooks/useFetcher";

interface ReportPostProps {
  setShowReportDialog: (show: boolean) => void;
  postId: string;
}

const reasonsMap = new Map([
  ["inappropriate", "Inappropriate Content"],
  ["spam", "Spam"],
  ["harassment", "Harassment"],
  ["misinformation", "Misinformation"],
  ["other", "Other"],
]);

const FormSchema = z
  .object({
    reasons: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one reason.",
    }),
    details: z.string().optional(),
  })
  .refine(
    (data) => {
      const otherSelected = data.reasons.includes("other");
      return (
        !otherSelected || (data.details?.trim() !== "" && data.details !== null)
      );
    },
    {
      message:
        "Please provide additional details if 'Other' is the only reason selected.",
      path: ["details"],
    }
  );

const ReportPost = ({ setShowReportDialog, postId }: ReportPostProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reasons: [],
      details: "",
    },
  });
  const fetcher = useFetcher();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await fetcher("/api/v1/report", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          postId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("Report Submitted");
        setShowReportDialog(false);
      } else {
        toast.error("Failed to report post");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex bg-zinc-900 w-[30rem] rounded-xl p-4 border border-[#272629] justify-between items-center"
      >
        <div className="flex flex-col w-full select-none gap-2 items-start">
          <div className="flex justify-start w-full items-center gap-2">
            <Flag className="w-6 h-6 fill-yellow-500" />
            <span className="text-white font-semibold text-xl">
              Report Post
            </span>
          </div>
          <span className="text-neutral-400 text-sm">
            Please select the reason for reporting this post.
          </span>
          <FormField
            control={form.control}
            name="reasons"
            render={() => (
              <FormItem className="w-full">
                {Array.from(reasonsMap.entries()).map(([id, label]) => (
                  <FormField
                    key={id}
                    control={form.control}
                    name="reasons"
                    render={({ field }) => (
                      <FormItem className="flex hover:text-yellow-500 w-full items-center gap-2">
                        <FormControl>
                          <Checkbox
                            className="data-[state=checked]:bg-yellow-500 bg-zinc-400"
                            checked={field.value?.includes(id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, id])
                                : field.onChange(
                                    field.value?.filter((value) => value !== id)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel
                          style={{
                            marginTop: "0px",
                          }}
                          className="text-sm w-full cursor-pointer font-normal"
                        >
                          {label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full disabled:opacity-15 p-2 mt-2 border border-[#272629] rounded-md bg-zinc-800 text-white"
                placeholder="Please provide additional details"
                disabled={!form.watch("reasons").includes("other")}
                style={{
                  resize: "vertical",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              />
            )}
          />
          <div className="flex pt-2 items-center justify-end w-full gap-2">
            <Button
              onClick={() => setShowReportDialog(false)}
              variant="default"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" variant="ghost" className="bg-yellow-500">
              Report
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ReportPost;
