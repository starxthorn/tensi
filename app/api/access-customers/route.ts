import { connectdb } from "@/lib/db";
import Customer from "@/models/Customer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectdb();
  const userid = req.nextUrl.searchParams.get("userid");
  try {
    const customers = await Customer.find({ user: userid }).populate("product");
    return NextResponse.json(
      {
        response: customers,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
  }
}
