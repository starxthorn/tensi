"use client";
import DashboardWrapperManager from "@/components/ReusableComponents/DashboardWrapperManager";
import Image from "next/image";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles"; // Ensure this uses R3F correctly
import { signOut } from "next-auth/react";
import { TailwindButton } from "@/components/ui/TailwindButton";
import { useCurrentUser } from "@/contextApi/CurrentUser";
import { MdVerified } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import Button from "@/components/ReusableComponents/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Canvas } from "@react-three/fiber"; // Import Canvas

export default function Page() {
  const { categories, customers, products, user } = useCurrentUser();

  return (
    <DashboardWrapperManager>
      <div className="h-[50rem] -z-30 w-full bg-neutral-950 bg-grid-white/[0.05] absolute top-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <Canvas>
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full -mt-20 -z-20 absolute top-20"
          particleColor="#FFFFFF"
        />
      </Canvas>

      <section className="w-full h-full">
        <div className="flex items-center justify-between">
          <h1 className="lg:text-3xl text-2xl font-bold capitalize">
            Hey, <span className="text-rose-500">{user?.name}</span>
          </h1>
          <TailwindButton onClick={() => signOut()}>Sign Out</TailwindButton>
        </div>
        <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <CardSpotlight className="w-full">
            <div className="flex items-center justify-start gap-6">
              <div>
                <Image
                  src={user?.avatar || "/avatar.jpeg"}
                  width={70}
                  height={70}
                  alt="profile picture"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-start gap-2">
                  <h1 className="capitalize font-bold text-2xl">
                    {user?.name}
                  </h1>
                  <MdVerified
                    className={`text-lg ${
                      user?.verified !== "verified" && "hidden"
                    } flex lg:text-xl text-neutral-500`}
                  />
                </div>
                <p className="text-zinc-400 text-md mt-1">{user?.email}</p>
                <p
                  className={`rounded-md text-sm mt-2 px-[5px] border-2 font-semibold ${
                    user?.verified === "verified" &&
                    "bg-green-200 border-green-600 text-green-600"
                  } ${
                    user?.verified === "pending" &&
                    "bg-yellow-200 border-yellow-600 text-yellow-600"
                  } ${
                    user?.verified === "not verified" &&
                    "bg-red-200 border-red-600 text-red-600"
                  }`}
                >
                  {user?.verified}
                </p>
              </div>
            </div>
          </CardSpotlight>
          <Link href={`/dashboard/category/${user?._id}`}>
            <CardSpotlight className="w-full cursor-pointer">
              <h1 className="text-4xl mt-2 font-bold">
                {products?.length || "0"}
              </h1>
              <h1 className="text-xl mt-2 text-neutral-300">Products</h1>
            </CardSpotlight>
          </Link>
          <Link href={`/dashboard/users/${user?._id}`}>
            <CardSpotlight className="w-full cursor-pointer">
              <h1 className="text-4xl mt-2 font-bold">
                {customers?.length || "0"}
              </h1>
              <h1 className="text-xl mt-2 text-neutral-300">Customers</h1>
            </CardSpotlight>
          </Link>
          <Link href={`/dashboard/settings/${user?._id}`}>
            <CardSpotlight className="w-full cursor-pointer">
              <h1 className="text-4xl mt-2 font-bold">
                {categories?.length || "0"}
              </h1>
              <h1 className="text-xl mt-2 text-neutral-300">Categories</h1>
            </CardSpotlight>
          </Link>
        </div>
        <div className="w-full grid lg:grid-cols-2 grid-cols-1 md:grid-cols-2 gap-6 mt-10 pb-10">
          <div
            className={`${
              customers?.length === 0 && "bg-neutral-950 border"
            } h-[60vh]`}
          >
            {customers && customers.length === 0 ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="flex flex-col gap-2 justify-center items-center">
                  <h1 className="text-2xl font-bold">
                    You have not added any customer
                  </h1>
                  <Link href={`/dashboard/customers/${user?._id}`}>
                    <Button className="w-40 mt-4">Add Customer</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 px-0">
                  <h1 className="text-2xl font-bold">Recent Customers</h1>
                  <Link href={`/dashboard/customers/${user?._id}`}>
                    <p className="text-blue-500 flex items-center justify-center gap-1 mr-5">
                      see all <FaArrowRight className="text-blue-500" />
                    </p>
                  </Link>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers &&
                      customers
                        .map((data, id) => (
                          <TableRow key={id}>
                            <TableCell>{data._id}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.phone}</TableCell>
                          </TableRow>
                        ))
                        .reverse()
                        .slice(0, 6)}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
          <div
            className={`${
              products?.length === 0 && "bg-neutral-950 border"
            } h-[60vh]`}
          >
            {products && products.length === 0 ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="flex flex-col gap-2 justify-center items-center">
                  <h1 className="text-2xl font-bold">
                    You have not added any product
                  </h1>
                  <Link href={`/dashboard/products/${user?._id}`}>
                    <Button className="w-40 mt-4">Add Product</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 px-0">
                  <h1 className="text-2xl font-bold">Recent Products</h1>
                  <Link href={`/dashboard/category/${user?._id}`}>
                    <p className="text-blue-500 flex items-center justify-center gap-1 mr-5">
                      see all <FaArrowRight className="text-blue-500" />
                    </p>
                  </Link>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products &&
                      products
                        .map((data, id) => (
                          <TableRow key={id}>
                            <TableCell>{data._id}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.price}</TableCell>
                          </TableRow>
                        ))
                        .reverse()
                        .slice(0, 6)}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </div>
      </section>
    </DashboardWrapperManager>
  );
}
