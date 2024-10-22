"use client";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Users = () => {
  const session = useSession();
  const pathname = usePathname();
  const path = `/dashboard/users/${session.data?.user._id}`;
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
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
        >
          <g>
            <circle cx="12" cy="8" r="4" fill="#C8C7FF" />
            <path
              d="M12 14c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6z"
              className={clsx(
                "dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#C0BFC4] group-hover:fill-[#7540A9]",
                { "dark:!fill-[#C8C7FF] !fill-[#7540A9] ": pathname === path }
              )}
            />
          </g>
        </svg>
      </Link>
    </>
  );
};

export default Users;
