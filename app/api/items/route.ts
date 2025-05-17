import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shop, { ShopStructure } from "@/models/shop";

export async function POST(request: Request) {
  try {
    const { shopName } = await request.json();

    if (!shopName) {
      return NextResponse.json({ error: "shopName is required" }, { status: 400 });
    }

    await dbConnect();

    // Use findOne and cast result to ShopStructure or null (because .lean() returns plain object without mongoose methods)
    const shop = (await Shop.findOne({ shopName }).lean()) as (ShopStructure & { _id: string }) | null;

    if (!shop) {
      return NextResponse.json({ items: [] });
    }

    // shop.items should be defined because your schema requires it, but still safe fallback:
    return NextResponse.json({ items: shop.items || [] });
  } catch (error) {
    console.error("API /api/items error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
