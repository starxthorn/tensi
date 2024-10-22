"use client";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Category() {
  const session = useSession();
  const pathname = usePathname();
  const path = `/dashboard/category/${session.data?.user._id}`;
  return (
    <>
      <Link
        href={path}
        className={cn(
          pathname === path ? "bg-[#5a2292]" : "",
          "rounded-md p-[6px]"
        )}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="8"
            height="8"
            rx="3"
            className={clsx(
              "group-hover:fill-[#C8C7FF] transition-all fill-[#353346]",
              { "!fill-[#C8C7FF]": pathname === path }
            )}
          />
          <rect
            x="3"
            y="13"
            width="8"
            height="8"
            rx="3"
            className={clsx(
              "dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#BABABB] group-hover:fill-[#7540A9]",
              { "dark:!fill-[#C8C7FF] fill-[#7540A9] ": pathname === path }
            )}
          />
          <rect
            x="13"
            y="3"
            width="8"
            height="8"
            rx="3"
            className={clsx(
              "dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#BABABB] group-hover:fill-[#7540A9]",
              { "dark:!fill-[#C8C7FF] fill-[#7540A9] ": pathname === path }
            )}
          />
          <rect
            x="13"
            y="13"
            width="8"
            height="8"
            rx="3"
            className={clsx(
              "dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF] ",
              { "dark:!fill-[#7540A9] fill-[#BD8AFF] ": pathname === path }
            )}
          />
        </svg>
      </Link>
    </>
  );
}

export default Category;
