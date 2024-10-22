"use client";
import Image from "next/image";
import { TailwindButton } from "../ui/TailwindButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SideNavbar from "./SideNavbar";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { useSession } from "next-auth/react";
import MiniLoader from "../Loaders/MiniLoader";

export default function Navbar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const session = useSession();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(false);
  }, [pathname]);

  const shouldRenderNavbar =
    !pathname.startsWith("/dashboard") && !pathname.startsWith("/auth");

  return (
    <>
      {shouldRenderNavbar && (
        <header className="w-full relative">
          <nav className="w-full z-40 flex items-center justify-between py-6 px-6 lg:px-8 fixed top-0 backdrop-blur-md">
            <Link href={"/"}>
              <h1 className="lg:text-3xl text-2xl font-bold flex">
                Ten
                <Image
                  src="/icons/logo.png"
                  width={18}
                  height={18}
                  alt="Company Logo" // Add a meaningful alt text
                />
                si
              </h1>
            </Link>
            <ul className="lg:flex md:hidden hidden items-center justify-center gap-4 text-gray-300 text-lg">
              <li className="hover:text-white hover:shadow-white transition-all">
                <Link href={"#pricing"}>Pricing</Link>
              </li>
              <li className="hover:text-white hover:shadow-white transition-all">
                <Link href={"#products"}>Products</Link>
              </li>
              <li className="hover:text-white hover:shadow-white transition-all">
                <Link href={"/"}>Resources</Link>
              </li>
              <li className="hover:text-white hover:shadow-white transition-all">
                <Link href={"/"}>Documentation</Link>
              </li>
              <li className="hover:text-white hover:shadow-white transition-all">
                <Link href={"#footer"}>Contact</Link>
              </li>
            </ul>
            <div className="lg:hidden md:flex flex ">
              <FiMenu
                onClick={() => setMenu(true)}
                className="lg:hidden md:flex flex text-4xl
                text-neutral-400
                cursor-pointer
                hover:text-white
                transition-all"
              />
            </div>
            <div className="lg:flex md:hidden hidden items-center justify-center gap-4">
              {session.data ? (
                <>
                  <Link href={`/dashboard/${session?.data?.user?._id}`}>
                    <TailwindButton onClick={() => setLoader(true)}>
                      {loader ? (
                        <div className="flex items-center justify-center gap-2">
                          <MiniLoader />
                          Dashboard
                        </div>
                      ) : (
                        <>Dashboard</>
                      )}
                    </TailwindButton>
                  </Link>
                  <Image
                    src={
                      session?.data?.user?.image
                        ? session?.data?.user?.image
                        : "/avatar.jpeg"
                    }
                    width={50}
                    height={50}
                    alt="profile" // Ensure alt text is meaningful
                    className="rounded-full"
                  />
                </>
              ) : (
                <>
                  <Link href={"/auth/sign-in"}>
                    <TailwindButton onClick={() => setLoader(true)}>
                      {loader ? (
                        <div className="flex items-center justify-center gap-2">
                          <MiniLoader />
                          Get Started
                        </div>
                      ) : (
                        <>Get Started</>
                      )}
                    </TailwindButton>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
      )}
      {menu && <SideNavbar isMenu={setMenu} />}
    </>
  );
}
