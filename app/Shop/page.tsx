"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loader from "../Components/Loader";

interface ItemType {
  itemName: string;
  price: number;
  date: string;
}

interface ShopType {
  _id: string;
  userId: string;
  shopName: string;
  items: ItemType[];
  date: string;
}

const ShopPage = () => {
  const [shops, setShops] = useState<ShopType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  const fetchShops = useCallback(async () => {
    try {
      const response = await fetch("/api/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }

      const data = await response.json();
      setShops(data.shops);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch shops:", err);
      setError("Error fetching shops. Please try again later.");
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleDeleteConfirm = (shopId: string) => {
    setConfirmId(shopId); // Show confirmation modal
  };

  const handleDelete = async () => {
    if (!confirmId) return;

    try {
      const response = await fetch("/api/deleteshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopId: confirmId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete shop");
      }

      setShops((prevShops) =>
        prevShops.filter((shop) => shop._id !== confirmId)
      );
      setConfirmId(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete shop:", err);
      setError("Error deleting shop. Please try again later.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-700 my-8 text-center">
          🏪 Our Shops
        </h1>

        {shops.length === 0 ? (
          <div className="text-center">
            <Link
              href="/"
              className="bg-amber-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-amber-300 text-amber-700 text-lg inline-block"
            >
              Add a new shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-amber-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-amber-300 flex flex-col"
              >
                <Link
                  href={`/shopkeeper/${shop.shopName}`}
                  className="block mb-4"
                  aria-label={`View details of ${shop.shopName}`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-amber-700 mb-2">
                    {shop.shopName}
                  </h2>
                  <p className="text-sm sm:text-base text-amber-600">
                    Created on:{" "}
                    <span className="font-medium text-amber-800">
                      {new Date(shop.date).toLocaleString()}
                    </span>
                  </p>
                </Link>
                <button
                  onClick={() => handleDeleteConfirm(shop._id)}
                  className="mt-auto bg-amber-700 hover:bg-amber-900 text-amber-50 font-semibold py-3 px-6 rounded-xl transition duration-200"
                >
                  Delete Shop
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
            <h3 className="text-lg font-semibold mb-4 text-amber-900">
              Are you sure you want to delete this shop?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
