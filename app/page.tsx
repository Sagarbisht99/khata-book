"use client";

import React, { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const trimmedName = shopName.trim();
    if (!trimmedName) {
      toast.error("❌ Shop name cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/createshop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopName: trimmedName }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        toast.success("✅ Shop created successfully!");
        setShopName("");
      } else {
        const message = data?.message || "❌ Failed to create shop.";
        toast.error(message);
      }
    } catch (error) {
      console.error("Error creating shop:", error);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-amber-100 border border-amber-300 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-900 mb-4 sm:mb-6 lg:mb-8 text-center">
          Add a Shop
        </h1>

        <form onSubmit={submitHandler} className="space-y-4 sm:space-y-5">
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter shop name"
            className="w-full p-3 sm:p-4 bg-amber-50 text-amber-900 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-amber-600 transition text-base sm:text-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 text-amber-50 p-3 sm:p-4 rounded-lg font-semibold hover:bg-amber-900 transition duration-200 disabled:opacity-50 text-base sm:text-lg"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Page;
