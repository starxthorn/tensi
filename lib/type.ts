export interface CategoryType {
  _id?: string;
  category?: string;
  user?: UserType | null;
}

export interface ProductType {
  _id?: string;
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  user?: UserType | null;
}

export interface CustomerType {
  _id?: string;
  name?: string;
  phone?: number;
  cnic?: number;
  credit?: number;
  debit?: number;
  product?: ProductType | null;
  purchase?: "installment" | "permanent purchase";
  user?: UserType | null;
}

export interface UserType {
  _id?: string;
  avatar?: string;
  name?: string;
  password?: string;
  email?: string;
  phone?: number;
  location?: string;
  cnic?: number;
  cnic_picture?: string;
  description?: string;
  verified?: "not verified" | "verified" | "pending";
  categories?: CategoryType[] | null;
  products?: ProductType[] | null;
  customers?: CustomerType[] | null;
}
