"use client";
import React, { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import MobileSlider from "./MobileSlider";
import Link from "next/link";

const Navbar = () => {
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 bg-amber-50 border-b border-amber-300 text-amber-900 shadow-sm ${
          showNavbar ? "top-0" : "-top-24"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/">
            <div className="text-lg md:text-2xl font-extrabold tracking-wide cursor-pointer select-none">
              📝 Khata Book
            </div>
          </Link>

          {/* Desktop Menu */}
          <header className="hidden md:flex items-center gap-6">
            <ul className="hidden md:flex space-x-8 font-medium text-sm mr-4">
              <Link href="/">
                <li className="hover:text-amber-700 cursor-pointer transition-colors duration-200">
                  Home
                </li>
              </Link>

              <Link href="/Shop">
                <li className="hover:text-amber-700 cursor-pointer transition-colors duration-200">
                  Shop
                </li>
              </Link>
            </ul>

            <SignedOut>
              <SignInButton>
                <button className="text-amber-700 hover:text-amber-900 font-semibold px-4 py-1 rounded-md transition-colors duration-200">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="ml-2 bg-amber-700 hover:bg-amber-900 text-amber-50 font-semibold px-4 py-1 rounded-md transition-colors duration-200">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>

          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setIsSliderOpen(true)}
            className="md:hidden cursor-pointer text-amber-900 hover:text-amber-700 transition-colors duration-200"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Slider */}
      <MobileSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
      />
    </>
  );
};

export default Navbar;
