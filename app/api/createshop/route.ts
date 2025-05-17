import dbConnect from "@/lib/dbConnect";
import Shop from "@/models/shop";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { shopName } = body;

    if (!shopName || typeof shopName !== "string" || shopName.length < 2) {
      return NextResponse.json(
        { message: "Shop name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newShop = await Shop.create({
      shopName,
      userId,
      items: [],
      date: new Date(),
    });

    return NextResponse.json(
      {
        message: "Shop created successfully!",
        shop: {
          id: newShop._id,
          shopName: newShop.shopName,
          date: newShop.date,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Shop creation error:", error);

    const message = error;

    return NextResponse.json({ message }, { status: 500 });
  }
}