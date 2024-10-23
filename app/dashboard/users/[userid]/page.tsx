"use client";
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
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import Button from "@/components/ReusableComponents/Button";
import LabelInputContainer from "@/components/ui/LableInputContainer";
import { useCurrentUser } from "@/contextApi/CurrentUser";
import React, { useState } from "react";
import { CustomerType } from "@/lib/type";
import { toast } from "sonner";
import MiniLoader from "@/components/Loaders/MiniLoader";

export default function Page({ params }: { params: { userid: string } }) {
  const { customers, products, user } = useCurrentUser();
  const [customer, setCustomer] = useState<CustomerType | null>({});
  const [loader, setLoader] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<
    CustomerType[] | null | undefined
  >([]);

  const handleFiltering = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filtering = customers?.filter((item) => {
      if (item.name) {
        return item?.name
          .toLowerCase()
          .trim()
          .includes(value.toLowerCase().trim());
      }
    });
    setFilteredCustomers(filtering);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectPurchase = (
    value: "installment" | "permanent purchase"
  ) => {
    setCustomer({
      ...customer,
      purchase: value,
    });
  };

  const fetchCustomer = async (cid: string) => {
    try {
      const res = await fetch(`/api/customer?customerid=${cid}`, {
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setCustomer(data.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = (productId: string) => {
    const selectedProduct = products?.find(
      (product) => product._id === productId
    );
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      product: selectedProduct,
      credit: selectedProduct?.price,
    }));
  };

  const creating_customer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    try {
      if (user?.verified !== "verified") {
        toast.error("Please verify your account");
        setLoader(false);
      } else {
        if (products && products.length <= 0) {
          toast.error("Please add any product");
          setLoader(false);
        } else {
          if (
            customer?.product?.price &&
            customer.debit &&
            customer?.product?.price < customer?.debit
          ) {
            toast.error("Paid price should less");
            setLoader(false);
          } else if (
            customer?.product?.price &&
            customer.debit &&
            customer?.product?.price > customer?.debit
          ) {
            if (customer?.product?.stock && customer?.product?.stock <= 0) {
              toast.error("Product stock is zero");
              setLoader(false);
            } else {
              const productStock = customer?.product?.stock;
              if (productStock) {
                await fetch(`/api/product?productid=${customer.product?._id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ stock: productStock - 1 }),
                });
              }
              const res = await fetch(
                `/api/customer?userid=${params.userid}&productid=${customer?.product?._id}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(customer),
                }
              );
              const data = await res.json();
              if (res.ok) {
                toast.success(data.message);
                window.location.reload();
              } else {
                toast.error("Something wrong");
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updating_customer = async (
    e: React.FormEvent<HTMLFormElement>,
    cid: string
  ) => {
    e.preventDefault();
    setLoader(true);
    try {
      if (
        customer?.product?.price &&
        customer.debit &&
        customer?.product?.price < customer?.debit
      ) {
        toast.error("Paid price should less");
        setLoader(false);
      } else if (
        customer?.product?.price &&
        customer.debit &&
        customer?.product?.price > customer?.debit
      ) {
        const res = await fetch(`/api/customer?customerid=${cid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        });
        if (res.ok) {
          toast.success("Customer updated");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleting_product = async (cid: string) => {
    try {
      const res = await fetch(`/api/customer?customerid=${cid}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Customer deleted");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DashboardWrapperManager>
        <div className="h-[50rem] -z-30 w-full bg-neutral-950 bg-grid-white/[0.05] absolute top-0 flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        <section>
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl lg:text-3xl">All Customers</h1>
            <div className="flex items-center justify-center gap-4">
              <SearchInput
                id="search"
                name="search"
                onChange={handleFiltering}
                className="w-[20vw]"
                placeholder="Search your Customers"
                type="text"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="px-6">New Customer</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[30vw]">
                  <form onSubmit={creating_customer}>
                    <DialogHeader>
                      <DialogTitle>Create new Customer</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-between gap-4 mb-4 mt-4">
                      <LabelInputContainer>
                        <Label htmlFor="name" className="mb-2">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="Tyler"
                          type="text"
                          onChange={handleInput}
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="phone" className="mb-2">
                          Phone
                        </Label>
                        <Input
                          name="phone"
                          onChange={handleInput}
                          required
                          id="phone"
                          placeholder="+92"
                          type="number"
                        />
                      </LabelInputContainer>
                    </div>
                    <LabelInputContainer className="mb-4">
                      <Label htmlFor="cnic" className="mb-2">
                        CNIC Number
                      </Label>
                      <Input
                        required
                        id="cnic"
                        name="cnic"
                        onChange={handleInput}
                        placeholder="34201-0891231-8"
                        type="number"
                      />
                    </LabelInputContainer>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <LabelInputContainer>
                        <Label htmlFor="debit" className="mb-2">
                          Paid
                        </Label>
                        <Input
                          id="debit"
                          name="debit"
                          onChange={handleInput}
                          placeholder="0"
                          type="number"
                        />
                      </LabelInputContainer>
                    </div>
                    <div>
                      <LabelInputContainer className="mb-4">
                        <Label htmlFor="purchase" className="mb-2">
                          Purchase Type
                        </Label>
                        <Select
                          name="purchase"
                          onValueChange={handleSelectPurchase}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              className="text-neutral-400"
                              placeholder="Select option"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="installment">
                              Installment
                            </SelectItem>
                            <SelectItem value="permanent purchase">
                              Permanent Purchase
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </LabelInputContainer>
                      <LabelInputContainer className="mb-8">
                        <Label htmlFor="product" className="mb-2">
                          Product
                        </Label>
                        <Select
                          name="product"
                          onValueChange={handleSelectProduct}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              className="text-neutral-400"
                              placeholder="Select Product"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              ?.map((data, id) => {
                                return (
                                  <>
                                    <SelectItem
                                      value={data?._id ?? ""}
                                      key={id}
                                      className="capitalize"
                                    >
                                      {data?.name}
                                    </SelectItem>
                                  </>
                                );
                              })
                              .reverse()}
                          </SelectContent>
                        </Select>
                      </LabelInputContainer>
                    </div>
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
                          <>Create Customer</>
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
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>CNIC</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>To Pay</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Purchase Type</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers && filteredCustomers?.length >= 1 ? (
                <>
                  {filteredCustomers
                    ?.map((data, id) => {
                      return (
                        <>
                          <TableRow key={id}>
                            <TableCell className="capitalize">
                              {data.name}
                            </TableCell>
                            <TableCell>{data.phone}</TableCell>
                            <TableCell>{data.cnic}</TableCell>
                            <TableCell>{data.debit ?? "0"}</TableCell>
                            <TableCell
                              className={
                                data?.purchase === "installment"
                                  ? "text-red-500"
                                  : "text-white"
                              }
                            >
                              {data.purchase === "permanent purchase"
                                ? "0"
                                : data?.debit && data.product?.price
                                ? data?.product?.price - data?.debit
                                : "0"}
                            </TableCell>
                            <TableCell className="capitalize">
                              {data.product?.name}
                            </TableCell>
                            <TableCell>
                              {data?.purchase === "installment" ? (
                                <>
                                  <span className="text-red-500">
                                    Installment
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-green-500">
                                    Purchased
                                  </span>
                                </>
                              )}
                            </TableCell>
                            <TableCell className="flex gap-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <FaEdit
                                    onClick={() =>
                                      fetchCustomer(data?._id ?? "")
                                    }
                                    className="hover:text-white text-gray-500 transition-all text-lg cursor-pointer"
                                  />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[30vw]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Edit your Customer
                                    </DialogTitle>
                                    <DialogDescription>
                                      Make changes to your profile here. Click
                                      save when you&apos;re done.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    onSubmit={(e) =>
                                      updating_customer(e, data?._id ?? "")
                                    }
                                  >
                                    <div className="flex items-center justify-between gap-4 mb-4 mt-4">
                                      <LabelInputContainer>
                                        <Label htmlFor="name" className="mb-2">
                                          Name
                                        </Label>
                                        <Input
                                          id="name"
                                          name="name"
                                          required
                                          placeholder="Tyler"
                                          type="text"
                                          onChange={handleInput}
                                          value={customer?.name}
                                        />
                                      </LabelInputContainer>
                                      <LabelInputContainer>
                                        <Label htmlFor="phone" className="mb-2">
                                          Phone
                                        </Label>
                                        <Input
                                          name="phone"
                                          onChange={handleInput}
                                          required
                                          id="phone"
                                          placeholder="+92"
                                          type="number"
                                          value={customer?.phone}
                                        />
                                      </LabelInputContainer>
                                    </div>
                                    <LabelInputContainer className="mb-4">
                                      <Label htmlFor="cnic" className="mb-2">
                                        CNIC Number
                                      </Label>
                                      <Input
                                        required
                                        id="cnic"
                                        name="cnic"
                                        onChange={handleInput}
                                        placeholder="34201-0891231-8"
                                        type="number"
                                        value={customer?.cnic}
                                      />
                                    </LabelInputContainer>
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                      <LabelInputContainer>
                                        <Label htmlFor="debit" className="mb-2">
                                          Paid
                                        </Label>
                                        <Input
                                          id="debit"
                                          name="debit"
                                          onChange={handleInput}
                                          placeholder="0"
                                          type="number"
                                          value={customer?.debit}
                                        />
                                      </LabelInputContainer>
                                    </div>
                                    <div>
                                      <LabelInputContainer className="mb-4">
                                        <Label
                                          htmlFor="purchase"
                                          className="mb-2"
                                        >
                                          Purchase Type
                                        </Label>
                                        <Select
                                          name="purchase"
                                          onValueChange={handleSelectPurchase}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue
                                              className="text-neutral-400"
                                              placeholder={
                                                customer?.purchase ||
                                                "Select option"
                                              }
                                            />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="installment">
                                              Installment
                                            </SelectItem>
                                            <SelectItem value="permanent purchase">
                                              Permanent Purchase
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </LabelInputContainer>
                                      <LabelInputContainer className="mb-8">
                                        <Label
                                          htmlFor="product"
                                          className="mb-2"
                                        >
                                          Product
                                        </Label>
                                        <Select
                                          name="product"
                                          onValueChange={handleSelectProduct}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue
                                              className="text-neutral-400"
                                              placeholder={
                                                customer?.product?.name ||
                                                "Select Product"
                                              }
                                            />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {products
                                              ?.map((data, id) => {
                                                return (
                                                  <>
                                                    <SelectItem
                                                      value={data?._id ?? ""}
                                                      key={id}
                                                      className="capitalize"
                                                    >
                                                      {data?.name}
                                                    </SelectItem>
                                                  </>
                                                );
                                              })
                                              .reverse()}
                                          </SelectContent>
                                        </Select>
                                      </LabelInputContainer>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        btnType={loader ? "button" : "submit"}
                                      >
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
                                          <>Save Customer</>
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
                                      permanently delete your account and remove
                                      your data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
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
                        </>
                      );
                    })
                    .reverse()}
                </>
              ) : (
                <>
                  {customers
                    ?.map((data, id) => {
                      return (
                        <>
                          <TableRow key={id}>
                            <TableCell className="capitalize">
                              {data.name}
                            </TableCell>
                            <TableCell>{data.phone}</TableCell>
                            <TableCell>{data.cnic}</TableCell>
                            <TableCell>{data.debit ?? "0"}</TableCell>
                            <TableCell
                              className={
                                data?.purchase === "installment"
                                  ? "text-red-500"
                                  : "text-white"
                              }
                            >
                              {data.purchase === "permanent purchase"
                                ? "0"
                                : data.debit && data.product?.price
                                ? data?.product?.price - data?.debit
                                : "0"}
                            </TableCell>
                            <TableCell className="capitalize">
                              {data?.product?.name}
                            </TableCell>
                            <TableCell>
                              {data?.purchase === "installment" ? (
                                <>
                                  <span className="text-red-500">
                                    Installment
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-green-500">
                                    Purchased
                                  </span>
                                </>
                              )}
                            </TableCell>
                            <TableCell className="flex gap-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <FaEdit
                                    onClick={() =>
                                      fetchCustomer(data?._id ?? "")
                                    }
                                    className="hover:text-white text-gray-500 transition-all text-lg cursor-pointer"
                                  />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[30vw]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Edit your Customer
                                    </DialogTitle>
                                    <DialogDescription>
                                      Make changes to your profile here. Click
                                      save when you&apos;re done.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    onSubmit={(e) =>
                                      updating_customer(e, data?._id ?? "")
                                    }
                                  >
                                    <div className="flex items-center justify-between gap-4 mb-4 mt-4">
                                      <LabelInputContainer>
                                        <Label htmlFor="name" className="mb-2">
                                          Name
                                        </Label>
                                        <Input
                                          id="name"
                                          name="name"
                                          required
                                          placeholder="Tyler"
                                          type="text"
                                          onChange={handleInput}
                                          value={customer?.name}
                                        />
                                      </LabelInputContainer>
                                      <LabelInputContainer>
                                        <Label htmlFor="phone" className="mb-2">
                                          Phone
                                        </Label>
                                        <Input
                                          name="phone"
                                          onChange={handleInput}
                                          required
                                          id="phone"
                                          placeholder="+92"
                                          type="number"
                                          value={customer?.phone}
                                        />
                                      </LabelInputContainer>
                                    </div>
                                    <LabelInputContainer className="mb-4">
                                      <Label htmlFor="cnic" className="mb-2">
                                        CNIC Number
                                      </Label>
                                      <Input
                                        required
                                        id="cnic"
                                        name="cnic"
                                        onChange={handleInput}
                                        placeholder="34201-0891231-8"
                                        type="number"
                                        value={customer?.cnic}
                                      />
                                    </LabelInputContainer>
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                      <LabelInputContainer>
                                        <Label htmlFor="debit" className="mb-2">
                                          Paid
                                        </Label>
                                        <Input
                                          id="debit"
                                          name="debit"
                                          onChange={handleInput}
                                          placeholder="0"
                                          type="number"
                                          value={customer?.debit}
                                        />
                                      </LabelInputContainer>
                                    </div>
                                    <div>
                                      <LabelInputContainer className="mb-4">
                                        <Label
                                          htmlFor="purchase"
                                          className="mb-2"
                                        >
                                          Purchase Type
                                        </Label>
                                        <Select
                                          name="purchase"
                                          onValueChange={handleSelectPurchase}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue
                                              className="text-neutral-400"
                                              placeholder={
                                                customer?.purchase ||
                                                "Select option"
                                              }
                                            />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="installment">
                                              Installment
                                            </SelectItem>
                                            <SelectItem value="permanent purchase">
                                              Permanent Purchase
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </LabelInputContainer>
                                      <LabelInputContainer className="mb-8">
                                        <Label
                                          htmlFor="product"
                                          className="mb-2"
                                        >
                                          Product
                                        </Label>
                                        <Select
                                          name="product"
                                          onValueChange={handleSelectProduct}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue
                                              className="text-neutral-400"
                                              placeholder={
                                                customer?.product?.name ||
                                                "Select Product"
                                              }
                                            />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {products
                                              ?.map((data, id) => {
                                                return (
                                                  <>
                                                    <SelectItem
                                                      value={data?._id ?? ""}
                                                      key={id}
                                                    >
                                                      {data?.name}
                                                    </SelectItem>
                                                  </>
                                                );
                                              })
                                              .reverse()}
                                          </SelectContent>
                                        </Select>
                                      </LabelInputContainer>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        btnType={loader ? "button" : "submit"}
                                      >
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
                                          <>Save Customer</>
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
                                      permanently delete your account and remove
                                      your data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
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
                        </>
                      );
                    })
                    .reverse()}
                </>
              )}
            </TableBody>
          </Table>
        </section>
      </DashboardWrapperManager>
    </>
  );
}
