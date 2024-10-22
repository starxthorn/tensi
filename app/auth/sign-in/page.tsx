"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import BottomGradient from "@/components/ui/BottomGradient";
import LabelInputContainer from "@/components/ui/LableInputContainer";
import { redirect, useRouter } from "next/navigation";
import { UserType } from "@/lib/type";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import Button from "@/components/ReusableComponents/Button";
import MiniLoader from "@/components/Loaders/MiniLoader";

export default function page() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const session = useSession();
  const [user, setUser] = useState<UserType | null>({
    email: "",
    password: "",
  });

  if (session.data) {
    redirect("/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await fetch(`/api/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        signIn("credentials", {
          email: user?.email,
          password: user?.password,
        });
        router.push("/");
      }
      if (!res.ok) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  return (
    <>
      <div className="h-[50rem] -z-10 w-full bg-neutral-950 bg-grid-white/[0.05] absolute top-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
            Welcome to Tensi
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Enter the credentionals to Login your account
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                onChange={handleChange}
                name="email"
                required
                autoComplete="off"
                placeholder="projectmayhem@fc.com"
                type="email"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-8">
              <Label htmlFor="password">Password</Label>
              <Input
                onChange={handleChange}
                name="password"
                required
                autoComplete="off"
                placeholder="••••••••"
                type="password"
              />
            </LabelInputContainer>
            <Link href={"/auth/sign-up"}>
              <p className="text-neutral-600 text-xs max-w-sm mb-8 dark:text-neutral-300">
                Already have an account{" "}
                <span className="text-white cursor-pointer">
                  Create Account
                </span>
              </p>
            </Link>
            <Button btnType={loader ? "button" : "submit"}>
              {loader ? (
                <>
                  <div className="flex items-center justify-center gap-4">
                    <MiniLoader />
                    <p className="text-neutral-400">Sign In</p>
                  </div>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            <div className="flex flex-col space-y-4">
              <button
                className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
                onClick={() =>
                  signIn("google", { redirect: true, callbackUrl: "/" })
                }
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Google
                </span>
                <BottomGradient />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
