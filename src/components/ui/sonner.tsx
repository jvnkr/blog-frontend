"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  const pathname = usePathname();

  // Clearing toast when the pathname changes (to prevent toast from being shown on the next page)
  useEffect(() => {
    toast.dismiss();
  }, [pathname]);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        // unstyled: true,
        className: "bg-zinc-900 border border-[#272629]",
        // classNames: {
        //   toast:
        //     "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        //   description: "group-[.toast]:text-muted-foreground",
        //   actionButton:
        //     "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        //   cancelButton:
        //     "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        // },
      }}
      {...props}
    />
  );
};

export { Toaster };
