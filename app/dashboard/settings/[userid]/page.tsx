"use client";
import DashboardWrapperManager from "@/components/ReusableComponents/DashboardWrapperManager";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaAddressCard } from "react-icons/fa";
import Button from "@/components/ReusableComponents/Button";
import { MdVerified } from "react-icons/md";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LabelInputContainer from "@/components/ui/LableInputContainer";
import { useSession } from "next-auth/react";
import { UploadDropzone } from "@/lib/uploadthing";
import React, { useState } from "react";
import { CategoryType, UserType } from "@/lib/type";
import { toast } from "sonner";
import { BiSolidUserCircle } from "react-icons/bi";
import MiniLoader from "@/components/Loaders/MiniLoader";
import { useCurrentUser } from "@/contextApi/CurrentUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: { userid: string } }) {
  const session = useSession();
  const [userEdit, setUserEdit] = useState<UserType | null>({});
  const [loader, setLoader] = useState(false);
  const { categories, user } = useCurrentUser();
  const [category, setCategory] = useState<CategoryType | null>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserEdit({
      ...userEdit,
      [name]: value,
    });
  };

  const setup_profile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    if (session.status === "authenticated") {
      try {
        const res = await fetch(`/api/access-user?userid=${params?.userid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...userEdit, verified: "pending" }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message);
          window.location.reload();
        } else {
          toast.error("There is something wrong");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    }
  };

  const create_category = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    if (user?.verified !== "verified") {
      toast.error("You are not verified");
      setLoader(false);
    } else {
      try {
        const res = await fetch(`/api/category?userid=${params.userid}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message);
          setCategory({ category: "" });
          window.location.reload();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    }
  };

  const delete_category = async (cid?: string) => {
    setLoader(true);
    try {
      const res = await fetch(`/api/category?categoryid=${cid}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <DashboardWrapperManager>
        <div className="h-[50rem] -z-30 w-full bg-neutral-950 bg-grid-white/[0.05] absolute top-0 flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        <section className={`mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10`}>
          <div className="relative col-span-1 h-auto pb-20 flex flex-col justify-start p-4 rounded-lg bg-neutral-900 border">
            <div className="absolute right-5 top-5 flex items-center justify-center gap-3 text-center">
              {user?.verified === "verified" && (
                <>
                  <p className="border-green-600 text-xs border-2 bg-green-200 rounded-lg text-green-600 font-bold px-2 py-1">
                    verified
                  </p>
                </>
              )}
              {user?.verified === "pending" && (
                <>
                  <p className="border-yellow-600 text-xs border-2 bg-yellow-200 rounded-lg text-yellow-600 font-bold px-2 py-1">
                    pending
                  </p>
                </>
              )}
              {user?.verified === "not verified" && (
                <>
                  <p className="border-red-600 text-xs border-2 bg-red-200 rounded-lg text-red-600 font-bold px-2 py-1">
                    not verified
                  </p>
                </>
              )}
            </div>
            <div
              className={`mt-10 flex flex-col items-center justify-center w-full`}
            >
              <Image
                src={session?.data?.user?.image || "/avatar.jpeg"}
                width={150}
                height={150}
                alt="profile picture"
                className={`rounded-full`}
              />
              <h1 className="mt-6 capitalize text-white font-bold text-xl lg:text-2xl flex items-center justify-center gap-2">
                {user?.name || (
                  <Skeleton className="w-[6rem] h-6 rounded-full" />
                )}
                {user?.verified === "verified" ? (
                  <>
                    <MdVerified className="text-lg lg:text-xl text-neutral-500" />
                  </>
                ) : (
                  <> </>
                )}
              </h1>
              <p className="w-[24rem] mt-2 text-neutral-400 text-center">
                {user?.verified === "pending" ||
                user?.verified === "verified" ? (
                  user?.description || (
                    <Skeleton className="w-[8rem] h-6 rounded-full" />
                  )
                ) : (
                  <></>
                )}
              </p>
              {user?.verified !== "not verified" ? (
                <>
                  <div className="mt-8 flex flex-col gap-4 w-full">
                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <BiSolidUserCircle className="text-2xl lg:text-3xl text-neutral-500" />
                        <h1 className="text-neutral-300 font-semibold">UID</h1>
                      </div>
                      <h1>
                        {user?._id || (
                          <Skeleton className="w-[6rem] h-6 rounded-full" />
                        )}
                      </h1>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <MdEmail className="text-2xl lg:text-3xl text-neutral-500" />
                        <h1 className="text-neutral-300 font-semibold">
                          Email
                        </h1>
                      </div>
                      <h1>
                        {user?.email || (
                          <Skeleton className="w-[6rem] h-6 rounded-full" />
                        )}
                      </h1>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <MdOutlinePhone className="text-2xl lg:text-3xl text-neutral-500" />
                        <h1 className="text-neutral-300 font-semibold">
                          Phone
                        </h1>
                      </div>
                      <h1>
                        {user?.phone || (
                          <Skeleton className="w-[6rem] h-6 rounded-full" />
                        )}
                      </h1>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <IoLocationSharp className="text-2xl lg:text-3xl text-neutral-500" />
                        <h1 className="text-neutral-300 font-semibold">
                          Location
                        </h1>
                      </div>
                      <h1>
                        {user?.location || (
                          <Skeleton className="w-[6rem] h-6 rounded-full" />
                        )}
                      </h1>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <FaAddressCard className="text-2xl lg:text-3xl text-neutral-500" />
                        <h1 className="text-neutral-300 font-semibold">CNIC</h1>
                      </div>
                      <h1>
                        {user?.cnic || (
                          <Skeleton className="w-[6rem] h-6 rounded-full" />
                        )}
                      </h1>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-4 w-[16rem]">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="py-3">Setup Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[30vw]">
                        <form onSubmit={setup_profile}>
                          <DialogHeader>
                            <DialogTitle>Setup your Profile</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you&apos;re done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center gap-4 mb-4 mt-2">
                            <LabelInputContainer>
                              <Label htmlFor="phone">Phone no</Label>
                              <Input
                                onChange={handleInput}
                                required
                                autoComplete="off"
                                name="phone"
                                placeholder="+92"
                                type="number"
                                className="mt-2"
                              />
                            </LabelInputContainer>
                            <LabelInputContainer>
                              <Label htmlFor="cnic">CNIC</Label>
                              <Input
                                onChange={handleInput}
                                required
                                autoComplete="off"
                                name="cnic"
                                placeholder="34201-0891231-8"
                                type="number"
                                className="mt-2"
                              />
                            </LabelInputContainer>
                          </div>
                          <LabelInputContainer className="mb-3">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              onChange={handleInput}
                              required
                              autoComplete="off"
                              name="location"
                              placeholder="Default Punjab, Pakistan"
                              type="text"
                              className="mt-2"
                            />
                          </LabelInputContainer>
                          <LabelInputContainer className="mb-4">
                            <Label htmlFor="description">Description</Label>
                            <Input
                              onChange={handleInput}
                              required
                              autoComplete="off"
                              name="description"
                              maxLength={60}
                              id="description"
                              placeholder="I am a business man"
                              type="text"
                              className="mt-2"
                            />
                          </LabelInputContainer>
                          <LabelInputContainer>
                            <Label htmlFor="cnic_picture" className="mb-2">
                              CNIC picture
                            </Label>
                            {userEdit?.cnic_picture?.length &&
                            userEdit?.cnic_picture?.length > 0 ? (
                              <Image
                                src={userEdit?.cnic_picture ?? ""}
                                width={625}
                                height={374}
                                className="rounded-lg h-[374] w-[625] mt-4 lg:mt-6"
                                alt="image"
                              />
                            ) : (
                              <>
                                <UploadDropzone
                                  appearance={{
                                    container:
                                      "cursor-pointer h-[374] w-[625] border bg-zinc-800",
                                    uploadIcon: "hidden",
                                    button:
                                      "bg-gradient-to-br py-6 w-[9rem] border relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-md font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
                                  }}
                                  endpoint="imageUploader"
                                  onClientUploadComplete={(res) => {
                                    setUserEdit({
                                      ...userEdit,
                                      cnic_picture: res[0]?.url,
                                    });
                                  }}
                                  onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                  }}
                                />
                              </>
                            )}
                          </LabelInputContainer>
                          <DialogFooter className="mt-4">
                            <Button btnType={loader ? "button" : "submit"}>
                              {loader ? (
                                <>
                                  <div className="flex items-center justify-center gap-4">
                                    <MiniLoader />
                                    <p className="text-neutral-400">Saving</p>
                                  </div>
                                </>
                              ) : (
                                <>Save Changes</>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className={`col-span-2 flex flex-col h-auto items-start pt-6 justify-start p-4 rounded-lg bg-neutral-900 border`}
          >
            {user?.verified === "verified" || "pending" ? (
              <>
                <div className="grid grid-cols-1 w-full gap-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Your Categories</h1>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-[10rem] py-3">New Category</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={create_category}>
                          <DialogHeader>
                            <DialogTitle>Create new Category</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you&apos;redone.
                            </DialogDescription>
                          </DialogHeader>
                          <LabelInputContainer className="mb-4 mt-4">
                            <Label htmlFor="category">Category</Label>
                            <Input
                              value={category?.category}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setCategory({ category: e.target.value })}
                              name="name"
                              id="name"
                              required
                              autoComplete="off"
                              placeholder="Mobiles"
                              type="text"
                              className="mt-2"
                            />
                          </LabelInputContainer>
                          <DialogFooter>
                            <Button btnType={loader ? "button" : "submit"}>
                              {loader ? (
                                <>
                                  <div className="flex items-center justify-center gap-4">
                                    <MiniLoader />
                                    <p className="text-neutral-400">Creating</p>
                                  </div>
                                </>
                              ) : (
                                <>Create category</>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex mt-5 items-center justify-start gap-4 flex-wrap w-full">
                    {categories ? (
                      categories?.map((data, id) => {
                        return (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <div
                                  key={id}
                                  className="border capitalize cursor-pointer rounded-full px-4 py-2 text-white bg-neutral-800"
                                >
                                  {data?.category}
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => delete_category(data?._id)}
                                  >
                                    {loader ? (
                                      <>
                                        <>Deleting...</>
                                      </>
                                    ) : (
                                      <>Delete</>
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        );
                      })
                    ) : (
                      <Skeleton className="w-full h-10 rounded-full" />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </section>
      </DashboardWrapperManager>
    </>
  );
}
