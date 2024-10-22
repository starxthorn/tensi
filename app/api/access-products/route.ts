import { connectdb } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectdb();
  const userid = req.nextUrl.searchParams.get("userid");
  try {
    const products = await Product.find({ user: userid });
    return NextResponse.json(
      {
        response: products,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
  }
}
