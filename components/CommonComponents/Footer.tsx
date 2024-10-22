"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub } from "react-icons/si";
import { SiFiverr } from "react-icons/si";
import { SiInstagram } from "react-icons/si";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth") || pathname.startsWith("/dashboard")) {
    return <></>;
  }

  return (
    <>
      <footer
        id="footer"
        className="bg-neutral-900 w-full flex lg:flex-row flex-col lg:items-center items-start py-6 lg:pl-0 pl-6 justify-around"
      >
        <div>
          <h1>&copy; All rights are reserved by Taimoor Safdar</h1>
        </div>
        <div className="flex items-center justify-center gap-3 lg:mt-0 mt-4">
          <Link
            target="_blank"
            href={"https://github.com/starxthorn?tab=repositories"}
          >
            <SiGithub className="text-5xl bg-black text-white rounded-lg p-3 hover:border hover:scale-125 cursor-pointer transition-all" />
          </Link>
          <Link
            target="_blank"
            href={"https://www.instagram.com/_taimoorsafdar"}
          >
            <SiInstagram className="text-5xl bg-black text-white rounded-lg p-3 hover:border hover:scale-125 cursor-pointer transition-all" />
          </Link>
          <Link
            target="_blank"
            href={
              "https://www.fiverr.com/taimoor_safdar_?source=gig_page&gigs=slug%3Adevelop-next-js-typescript-professional-website%2Cpckg_id%3A1"
            }
          >
            <SiFiverr className="text-5xl bg-black text-white rounded-lg p-2 hover:border hover:scale-125 cursor-pointer transition-all" />
          </Link>
        </div>
      </footer>
    </>
  );
}
