import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shop from "@/models/shop";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { shopId } = await request.json();

    if (!shopId) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    await dbConnect();

    const deletedShop = await Shop.findOneAndDelete({
      _id: shopId,
      userId: userId
    });

    if (!deletedShop) {
      return NextResponse.json(
        { error: "Shop not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Shop deleted successfully",
      deletedShop
    });
  } catch (error) {
    console.error("API /api/deleteshop error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 