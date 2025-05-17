import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Shop from "@/models/shop";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "itemId is required" }, { status: 400 });
    }

    await dbConnect();

    // Remove the item from the items array in any shop that contains it
    const result = await Shop.updateOne(
      { "items._id": new ObjectId(id) },
      { $pull: { items: { _id: new ObjectId(id) } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Item not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("API /api/deleteItem error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
