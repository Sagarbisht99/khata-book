'use client'
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Loader from "@/app/Components/Loader";

interface Item {
  _id: string;
  itemName: string;
  price: number;
  date: string;
}

interface ShopPageProps {
  params: Promise<{
    shopName: string;
  }>;
}

const ShopNamePage = ({ params }: ShopPageProps) => {
  const resolvedParams = use(params);
  const shopName = resolvedParams.shopName;

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shopName }),
        });

        if (!res.ok) throw new Error("Failed to fetch items");

        const data = await res.json();
        setItems(data.items || []);
      } catch (error) {
        console.error(error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [shopName]);

  const handleDeleteConfirm = (id: string) => {
    setConfirmId(id);
  };

  const handleDelete = async () => {
    if (!confirmId) return;

    try {
      const res = await fetch("/api/deleteItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: confirmId }),
      });

      if (!res.ok) throw new Error("Failed to delete item");

      setItems((prev) => prev.filter((item) => item._id !== confirmId));
      setConfirmId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xs sm:max-w-md lg:max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mt-6 mb-6 sm:mb-8 lg:mb-10">
          🛍️ {shopName}
        </h1>

        {items.length === 0 ? (
          <div className="text-center">
            <Link
              href="/Items"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-medium transition duration-200"
            >
              Add Item
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-amber-200 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3"
              >
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-semibold">{item.itemName}</h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    ₹{item.price.toLocaleString("en-IN")} —{" "}
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteConfirm(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition"
                >
                  Delete
                </button>
              </div>
            ))}

            <div className="text-center mt-6 sm:mt-8 bg-yellow-100 p-3 sm:p-4 rounded-lg border border-yellow-300 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold">
                Total Price: ₹{totalPrice.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Link
                href="/Items"
                className="inline-block bg-amber-700 hover:bg-amber-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-medium transition duration-200"
              >
                Add Item
              </Link>
            </div>
          </div>
        )}
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm text-center">
            <h3 className="text-base sm:text-lg font-bold mb-4 text-amber-900">
              Are you sure you want to delete this item?
            </h3>
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setConfirmId(null)}
                className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 sm:px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm sm:text-base"
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

export default ShopNamePage;
