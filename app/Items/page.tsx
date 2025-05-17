"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/additem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemName, amount }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/shopkeeper/${data.shop.shopName}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    setItemName("");
    setAmount("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-amber-300">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 mb-6 sm:mb-8 text-center">
          Add New Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="itemName"
              className="block mb-2 text-sm sm:text-base text-amber-600 font-semibold"
            >
              Item Name:
            </label>
            <input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter grocery item"
              required
              className="w-full rounded-md border border-amber-300 bg-amber-100 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block mb-2 text-sm sm:text-base text-amber-600 font-semibold"
            >
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full rounded-md border border-amber-300 bg-amber-100 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 sm:py-3 rounded-md transition-colors text-sm sm:text-base mt-4 sm:mt-6"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
