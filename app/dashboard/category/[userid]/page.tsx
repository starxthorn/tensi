"use client";
import React, { useState } from "react";
import Button from "@/components/ReusableComponents/Button";
import DashboardWrapperManager from "@/components/ReusableComponents/DashboardWrapperManager";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import LabelInputContainer from "@/components/ui/LableInputContainer";
import { ProductType } from "@/lib/type";
import { toast } from "sonner";
import MiniLoader from "@/components/Loaders/MiniLoader";
import { useCurrentUser } from "@/contextApi/CurrentUser";

export default function Page({ params }: { params: { userid: string } }) {
  const { products, categories, user } = useCurrentUser();
  const [product, setProduct] = useState<ProductType | null>({});
  const [loader, setLoader] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductType[] | null | undefined
  >([]);

  const handleFiltering = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filtering = products?.filter((item) => {
      if (item.name) {
        return item?.name
          .toLowerCase()
          .trim()
          .includes(value.toLowerCase().trim());
      }
    });
    setFilteredProducts(filtering);
  };

  const handleSelect = (value: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: value,
    }));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const creating_products = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    if (user?.verified !== "verified") {
      toast.error("Please verify your account");
      setLoader(false);
    } else {
      if (categories && categories?.length <= 0) {
        toast.error("Please add any category");
        setLoader(false);
      } else {
        try {
          const res = await fetch(`/api/product?userid=${params.userid}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          });
          const data = await res.json();
          if (res.ok) {
            toast.success(data.message);
            window.location.reload();
          } else {
            toast.error("Something went wrong");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoader(false);
        }
      }
    }
  };

  const fetchProduct = async (pid: string) => {
    try {
      const res = await fetch(`/api/product?productid=${pid}`, {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setProduct(data.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updating_products = async (
    e: React.FormEvent<HTMLFormElement>,
    pid: string
  ) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await fetch(`/api/product?productid=${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const deleting_product = async (pid: string) => {
    try {
      const res = await fetch(`/api/product?productid=${pid}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardWrapperManager>
      <div className="h-[50rem] -z-30 w-full bg-neutral-950 bg-grid-white/[0.05] absolute top-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <section>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl lg:text-3xl">All Products</h1>
          <div className="flex items-center justify-center gap-4">
            <SearchInput
              id="search"
              name="search"
              onChange={handleFiltering}
              className="w-[20vw]"
              placeholder="Search your Products"
              type="text"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-6">New Product</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={creating_products}>
                  <DialogHeader>
                    <DialogTitle>Create new Product</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <LabelInputContainer className="mb-4 mt-4">
                    <Label htmlFor="name">Product name</Label>
                    <Input
                      required
                      autoComplete="off"
                      name="name"
                      onChange={handleInput}
                      id="name"
                      placeholder="Samsung"
                      type="text"
                      className="mt-2"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="stock">Product stock</Label>
                    <Input
                      required
                      autoComplete="off"
                      name="stock"
                      onChange={handleInput}
                      id="stock"
                      placeholder="0"
                      type="text"
                      className="mt-2"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      required
                      autoComplete="off"
                      name="price"
                      onChange={handleInput}
                      id="price"
                      placeholder="0"
                      type="number"
                      className="mt-2"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-8">
                    <Label htmlFor="category" className="mb-2">
                      Category
                    </Label>
                    <Select name="category" onValueChange={handleSelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          className="text-neutral-400"
                          placeholder="Select option"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          ?.map((data, id) => (
                            <SelectItem value={data?.category || ""} key={id}>
                              {data?.category}
                            </SelectItem>
                          ))
                          .reverse()}
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                  <DialogFooter>
                    <Button btnType={loader ? "button" : "submit"}>
                      {loader ? (
                        <div className="flex items-center justify-center gap-4">
                          <MiniLoader />
                          <p className="text-neutral-400">Create Product</p>
                        </div>
                      ) : (
                        <>Create Product</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stocks</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts && filteredProducts?.length >= 1 ? (
              <>
                {filteredProducts
                  ?.map((data, id) => (
                    <TableRow key={id}>
                      <TableCell>{data?._id}</TableCell>
                      <TableCell>{data?.name}</TableCell>
                      <TableCell>{data?.price}</TableCell>
                      <TableCell
                        className={`${
                          data.stock &&
                          (data?.stock <= 5 ? "text-red-500" : "text-green-500")
                        }`}
                      >
                        {data?.stock}
                      </TableCell>
                      <TableCell>{data?.category}</TableCell>
                      <TableCell className="flex gap-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <FaEdit
                              onClick={() => fetchProduct(data?._id ?? "")}
                              className="hover:text-white text-gray-500 transition-all text-lg cursor-pointer"
                            />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <form
                              onSubmit={(e) =>
                                updating_products(e, data?._id ?? "")
                              }
                            >
                              <DialogHeader>
                                <DialogTitle>Edit the Product</DialogTitle>
                                <DialogDescription>
                                  Make changes to your profile here. Click save
                                  when you&apos;re done.
                                </DialogDescription>
                              </DialogHeader>
                              <LabelInputContainer className="mb-4 mt-4">
                                <Label htmlFor="name">Product name</Label>
                                <Input
                                  id="name"
                                  type="text"
                                  className="mt-2"
                                  name="name"
                                  onChange={handleInput}
                                  value={product?.name}
                                />
                              </LabelInputContainer>
                              <LabelInputContainer className="mb-4">
                                <Label htmlFor="stock">Product stock</Label>
                                <Input
                                  id="stock"
                                  type="text"
                                  className="mt-2"
                                  name="stock"
                                  onChange={handleInput}
                                  value={product?.stock}
                                />
                              </LabelInputContainer>
                              <LabelInputContainer className="mb-4">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  className="mt-2"
                                  name="price"
                                  onChange={handleInput}
                                  value={product?.price}
                                />
                              </LabelInputContainer>
                              <LabelInputContainer className="mb-8">
                                <Label htmlFor="category" className="mb-2">
                                  Category
                                </Label>
                                <Select
                                  name="category"
                                  onValueChange={handleSelect}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      className="text-neutral-400"
                                      placeholder={data.category}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories?.map((data, id) => (
                                      <SelectItem
                                        value={data?.category ?? ""}
                                        key={id}
                                      >
                                        {data.category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </LabelInputContainer>
                              <DialogFooter>
                                <Button btnType={loader ? "button" : "submit"}>
                                  {loader ? (
                                    <>
                                      <div className="flex items-center justify-center gap-4">
                                        <MiniLoader />
                                        <p className="text-neutral-400">
                                          Saving
                                        </p>
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <FaRegTrashAlt className="hover:text-red-500 text-gray-500 transition-all text-lg cursor-pointer" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleting_product(data?._id ?? "")
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                  .reverse()}
              </>
            ) : (
              <>
                {products
                  ?.map((data, id) => (
                    <TableRow key={id}>
                      <TableCell>{data?._id}</TableCell>
                      <TableCell>{data?.name}</TableCell>
                      <TableCell>{data?.price}</TableCell>
                      <TableCell
                        className={`${
                          data?.stock &&
                          (data?.stock <= 5 ? "text-red-500" : "text-green-500")
                        }`}
                      >
                        {data?.stock}
                      </TableCell>
                      <TableCell>{data?.category}</TableCell>
                      <TableCell className="flex gap-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <FaEdit
                              onClick={() => fetchProduct(data?._id ?? "")}
                              className="hover:text-white text-gray-500 transition-all text-lg cursor-pointer"
                            />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <form
                              onSubmit={(e) =>
                                updating_products(e, data?._id ?? "")
                              }
                            >
                              <DialogHeader>
                                <DialogTitle>Edit the Product</DialogTitle>
                                <DialogDescription>
                                  Make changes to your profile here. Click save
                                  when you&apos;re done.
                                </DialogDescription>
                              </DialogHeader>
                              <LabelInputContainer className="mb-4 mt-4">
                                <Label htmlFor="name">Product name</Label>
                                <Input
                                  id="name"
                                  type="text"
                                  className="mt-2"
                                  name="name"
                                  onChange={handleInput}
                                  value={product?.name}
                                />
                              </LabelInputContainer>
                              <LabelInputContainer className="mb-4">
                                <Label htmlFor="stock">Product stock</Label>
                                <Input
                                  id="stock"
                                  type="text"
                                  className="mt-2"
                                  name="stock"
                                  onChange={handleInput}
                                  value={product?.stock}
                                />
                              </LabelInputContainer>
                              <LabelInputContainer className="mb-4">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  className="mt-2"
                                  name="price"
                                  onChange={handleInput}
                                  value={product?.price}
                                />
                              </LabelInputContainer>
                              <LabelInputContainer className="mb-8">
                                <Label htmlFor="category" className="mb-2">
                                  Category
                                </Label>
                                <Select
                                  name="category"
                                  onValueChange={handleSelect}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      className="text-neutral-400"
                                      placeholder={data.category}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories?.map((data, id) => (
                                      <SelectItem
                                        value={data?.category ?? ""}
                                        key={id}
                                      >
                                        {data.category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </LabelInputContainer>
                              <DialogFooter>
                                <Button btnType={loader ? "button" : "submit"}>
                                  {loader ? (
                                    <>
                                      <div className="flex items-center justify-center gap-4">
                                        <MiniLoader />
                                        <p className="text-neutral-400">
                                          Saving
                                        </p>
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <FaRegTrashAlt className="hover:text-red-500 text-gray-500 transition-all text-lg cursor-pointer" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleting_product(data?._id ?? "")
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                  .reverse()}
              </>
            )}
          </TableBody>
        </Table>
      </section>
    </DashboardWrapperManager>
  );
}
