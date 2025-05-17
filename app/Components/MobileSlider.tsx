import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

interface MobileSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSlider: React.FC<MobileSliderProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 md:hidden h-full w-64 bg-amber-100 text-amber-900 shadow-lg border-l border-amber-300 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b border-amber-300">
        <span className="text-lg font-semibold">Menu</span>
        <button onClick={onClose} className="text-amber-900 text-2xl hover:text-amber-700 transition">
          &times;
        </button>
      </div>

      <div className="px-6 my-4 flex flex-col gap-2">
        <SignedOut>
          <SignInButton>
            <button className="w-full text-left p-2 rounded hover:bg-amber-200 transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="w-full text-left p-2 rounded hover:bg-amber-200 transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      <ul className="flex flex-col gap-4 px-6 py-6 text-sm font-medium">
        <Link href="/" onClick={onClose}>
          <li className="hover:text-amber-700 cursor-pointer transition">Home</li>
        </Link>

        <Link href="/Shop" onClick={onClose}>
          <li className="hover:text-amber-700 cursor-pointer transition">Shop</li>
        </Link>
      </ul>
    </div>
  );
};

export default MobileSlider;
