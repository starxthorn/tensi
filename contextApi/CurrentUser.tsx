"use client";
import { CategoryType, CustomerType, ProductType, UserType } from "@/lib/type";
import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  user: UserType | null;
  categories: CategoryType[] | null;
  products: ProductType[] | null;
  customers: CustomerType[] | null;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserContextProviderType {
  children: React.ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderType) => {
  const [user, setUser] = useState<UserType | null>({});
  const [categories, setCategries] = useState<CategoryType[] | null>([]);
  const [customers, setCustomers] = useState<CustomerType[] | null>([]);
  const [products, setProducts] = useState<ProductType[] | null>([]);
  const session = useSession();

  const fetchingUserData = async () => {
    if (session.status === "authenticated") {
      try {
        const fetchUser = await fetch(
          `/api/access-user?userid=${session?.data?.user?._id}`,
          {
            method: "GET",
          }
        );
        if (fetchUser.ok) {
          const data = await fetchUser.json();
          setUser(data.response);
        }
        const fetchCategories = await fetch(
          `/api/access-categories?userid=${session?.data?.user?._id}`,
          {
            method: "GET",
          }
        );
        if (fetchCategories.ok) {
          const data = await fetchCategories.json();
          setCategries(data.response);
        }
        const fetchProducts = await fetch(
          `/api/access-products?userid=${session?.data?.user?._id}`,
          {
            method: "GET",
          }
        );
        if (fetchProducts.ok) {
          const data = await fetchProducts.json();
          setProducts(data.response);
        }
        const fetchCustomers = await fetch(
          `/api/access-customers?userid=${session?.data?.user?._id}`,
          {
            method: "GET",
          }
        );
        if (fetchCustomers.ok) {
          const data = await fetchCustomers.json();
          console.log(data);
          setCustomers(data.response);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchingUserData();
  }, [session]);

  return (
    <UserContext.Provider value={{ user, categories, customers, products }}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
