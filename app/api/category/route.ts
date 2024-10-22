import { connectdb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Category from "@/models/Category";

export async function POST(req: NextRequest) {
  await connectdb();
  const userid = req.nextUrl.searchParams.get("userid");
  try {
    const { category } = await req.json();
    const user = await User.findById(userid);
    if (user) {
      const creating_category = await Category.create({
        category,
        user: user._id,
      });
      user.categories.push(creating_category);
      await user.save();
      return NextResponse.json(
        {
          message: "Category created",
          response: creating_category,
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(req: NextRequest) {
  await connectdb();
  const categoryid = req.nextUrl.searchParams.get("categoryid");
  try {
    await Category.findByIdAndDelete(categoryid);
    return NextResponse.json(
      {
        message: "Category deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
  }
}
