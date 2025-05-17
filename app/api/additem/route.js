import {  NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shop from "@/models/shop";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();

  try {
    await dbConnect();

    const body = await req.json();
    const { itemName, amount } = body;

    // ✅ Check if a shop already exists for this user
    let existingShop = await Shop.findOne({ userId });

    let shopName = "My Grocery Shop"; // default
    if (existingShop) {
      shopName = existingShop.shopName; // use existing shop name
    } else {
      // optional: you can create one here if needed
      existingShop = await Shop.create({
        userId,
        shopName,
        items: [],
        date: new Date().toISOString(),
      });
    }

    const newItem = {
      itemName,
      price: Number(amount),
      date: new Date().toISOString(),
    };

    const updatedShop = await Shop.findOneAndUpdate(
      { userId, shopName },
      { $push: { items: newItem } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, shop: updatedShop });
  } catch (error) {
    console.error("Error in /api/additem:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
