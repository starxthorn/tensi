import { connectdb } from "@/lib/db";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectdb();
  const userid = req.nextUrl.searchParams.get("userid");
  try {
    const categories = await Category.find({ user: userid });
    return NextResponse.json(
      {
        response: categories,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
  }
}
