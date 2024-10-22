import { connectdb } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectdb();
  const productid = req.nextUrl.searchParams.get("productid");
  try {
    const product = await Product.findById(productid);
    if (product) {
      return NextResponse.json(
        {
          response: product,
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
  try {
    const { name, price, stock, category } = await req.json();
    const ExistUser = await User.findById(userid);
    if (ExistUser) {
      const product = await Product.create({
        name,
        price,
        stock,
        category,
        user: ExistUser._id,
      });
      ExistUser.products.push(product);
      await ExistUser.save();
      if (product) {
        return NextResponse.json(
          { response: product, message: "Product created" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function PUT(req: NextRequest) {
  await connectdb();
  const productid = req.nextUrl.searchParams.get("productid");
  try {
    const product = await Product.findByIdAndUpdate(productid, await req.json(), {
      new: true,
    });
    return NextResponse.json(
      {
        message: "Product Updated",
        response: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(req: NextRequest) {
  await connectdb();
  const productid = req.nextUrl.searchParams.get("productid");
  try {
    await Product.findByIdAndDelete(productid);
    return NextResponse.json(
      {
        message: "Product Deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
