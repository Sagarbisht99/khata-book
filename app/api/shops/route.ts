import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shop from "@/models/shop";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const shops = await Shop.find({ userId }).lean();

    return NextResponse.json({ shops });
  } catch (error) {
    console.error("API /api/shops error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 