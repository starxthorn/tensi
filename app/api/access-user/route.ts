import User from "@/models/User";
import { connectdb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectdb();
  const userid = req.nextUrl.searchParams.get("userid");
  try {
    const user = await User.findById(userid);
    return NextResponse.json(
      {
        response: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await connectdb();
  const userid = req.nextUrl.searchParams.get("userid");
  try {
    const user = await User.findByIdAndUpdate(userid, await req.json(), {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (user) {
      return NextResponse.json(
        {
          message: "profile is updated",
          response: user,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error occurred" }, { status: 500 });
  }
}
