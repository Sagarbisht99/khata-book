import mongoose, { Schema, Document } from "mongoose";

// TypeScript interfaces
export interface ItemStructure {
  itemName: string;
  price: number;
  date: string;
}

export interface ShopStructure extends Document {
  userId: string; // 👈 Account/User reference
  shopName: string;
  items: ItemStructure[];
  date: string;
}

// Item schema
const ItemSchema: Schema = new Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  date: {
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  },
});

// Shop schema (❌ no slug now)
const ShopSchema: Schema = new Schema({
  userId: { type: String, required: true },
  shopName: { type: String, required: true },
  items: [ItemSchema],
  date: { type: String, required: true },
});

const Shop = mongoose.models.Shop || mongoose.model<ShopStructure>("Shop", ShopSchema);

export default Shop;
