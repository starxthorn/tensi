"use client";
import Button from "@/components/ReusableComponents/Button";
import DashboardNavbar from "./DashboardNavbar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

interface DashboardWrapperManagerPropsType {
  children: React.ReactNode;
}

export default function DashboardWrapperManager({
  children,
}: DashboardWrapperManagerPropsType) {
  const session = useSession();
  const pathname = usePathname();

  if (
    pathname.startsWith("/dashboard") &&
    session.status === "unauthenticated"
  ) {
    redirect("/");
  }

  return (
    <>
      <section className="w-full h-screen lg:flex hidden justify-center">
        <DashboardNavbar />
        <div className="w-full lg:p-8 p-4">{children}</div>
      </section>
      <div className="lg:hidden flex flex-col items-center text-center h-screen w-full p-4 justify-center">
        <h1 className="text-2xl font-bold">
          This dashboard cannot be open in mobiles.Open it in Desktop
        </h1>
        <Link href={"/"}>
          <Button className="w-40 mt-6">Go back</Button>
        </Link>
      </div>
    </>
  );
}
