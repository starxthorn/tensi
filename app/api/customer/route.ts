import { connectdb } from "@/lib/db";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectdb();
  const customerid = req.nextUrl.searchParams.get("customerid");
  try {
    const customer = await Customer.findById(customerid).populate("product");
    if (customer) {
      return NextResponse.json(
        {
          response: customer,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function POST(req: NextRequest) {
  await connectdb();
  const userid = req.nextUrl.searchParams.get("userid");
  const productid = req.nextUrl.searchParams.get("productid");
  try {
    const { name, phone, cnic, purchase, credit, debit } = await req.json();
    const ExistUser = await User.findById(userid);
    const ExistProduct = await Product.findById(productid);
    if (ExistUser && ExistProduct) {
      const customer = await Customer.create({
        name,
        phone,
        cnic,
        purchase,
        credit,
        debit,
        product: ExistProduct._id,
        user: ExistUser._id,
      });
      ExistUser.customers.push(customer);
      ExistProduct.customers.push(customer);
      await ExistUser.save();
      await ExistProduct.save();
      return NextResponse.json(
        { response: customer, message: "Customer created" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function PUT(req: NextRequest) {
  await connectdb();
  const customerid = req.nextUrl.searchParams.get("customerid");
  try {
    const customer = await Customer.findByIdAndUpdate(
      customerid,
      await req.json(),
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    return NextResponse.json(
      {
        message: "Customer updated",
        response: customer,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(req: NextRequest) {
  await connectdb();
  const customerid = req.nextUrl.searchParams.get("customerid");
  try {
    await Customer.findByIdAndDelete(customerid);
    return NextResponse.json(
      {
        message: "Customer Deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
