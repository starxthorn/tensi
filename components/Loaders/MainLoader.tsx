"use client";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface MainLoaderPropsType {
  className?: string;
}

export default function MainLoader({ className }: MainLoaderPropsType) {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <>
        <div
          className={cn(
            "bg-neutral-950 w-full fixed inset-0 flex items-center justify-center z-50",
            className
          )}
        >
          <div className="border-4 w-10 h-10 border-white border-r-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }
}
