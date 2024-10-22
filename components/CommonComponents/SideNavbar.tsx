"use client";
import Link from "next/link";
import { TailwindButton } from "../ui/TailwindButton";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";

export default function SideNavbar({
  isMenu,
}: {
  isMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const loggedin = true;
  return (
    <>
      <div className="fixed inset-0 w-full h-[100vh] bg-neutral-950 z-50 lg:hidden md:flex flex items-center justify-center">
        <IoCloseSharp
          onClick={() => isMenu(false)}
          className="absolute top-5 right-5 text-4xl text-neutral-400 cursor-pointer hover:text-white transition-all"
        />
        <ul className="flex flex-col items-center justify-center gap-4 text-gray-300 text-lg">
          <li className="hover:text-white hover:shadow-white transition-all">
            <Link href={"#pricing"} onClick={() => isMenu(false)}>
              Pricing
            </Link>
          </li>
          <li className="hover:text-white hover:shadow-white transition-all">
            <Link href={"#products"} onClick={() => isMenu(false)}>
              Products
            </Link>
          </li>
          <li className="hover:text-white hover:shadow-white transition-all">
            <Link href={"/"} onClick={() => isMenu(false)}>
              Resources
            </Link>
          </li>
          <li className="hover:text-white hover:shadow-white transition-all">
            <Link href={"/"} onClick={() => isMenu(false)}>
              Documentation
            </Link>
          </li>
          <li className="hover:text-white hover:shadow-white transition-all">
            <Link href={"#footer"} onClick={() => isMenu(false)}>
              Contact
            </Link>
          </li>
          {loggedin ? (
            <>
              <Link href={"/dashboard"} onClick={() => isMenu(false)}>
                <TailwindButton>Dashboard</TailwindButton>
              </Link>
              <Image
                src={"/avatar.jpg"}
                width={50}
                height={50}
                alt="profile"
                className="rounded-full"
              />
            </>
          ) : (
            <>
              <Link href={"/auth/sign-in"} onClick={() => isMenu(false)}>
                <TailwindButton>Get Started</TailwindButton>
              </Link>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
