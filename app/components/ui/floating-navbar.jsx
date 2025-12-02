"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export const FloatingNav = ({ navItems, className }) => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [visible] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0;";
    logout();
    router.push("/login");
  };

  const handleMouseEnter = (idx) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(idx);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200); // 200ms delay
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 fixed top-6 left-1/2 -translate-x-1/2 rounded-full dark:bg-black bg-white shadow-input z-50 px-4 py-2 sm:px-6 sm:py-3 md:px-10",
          className
        )}
      >
        {/* Nav Items */}
        {navItems.map((item, idx) => {
          const hasDropdown = item.dropdown && item.dropdown.length > 0;

          return (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              {hasDropdown ? (
                <button className="text-sm text-neutral-700 dark:text-neutral-50 hover:text-neutral-400 flex items-center gap-1">
                  {item.name}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-neutral-700 dark:text-neutral-50 hover:text-neutral-400"
                >
                  {item.name}
                </Link>
              )}

              {/* Dropdown */}
              {hasDropdown && (
                <div
                  className={cn(
                    "absolute left-0 mt-2 bg-white dark:bg-neutral-900 shadow-lg rounded-xl py-2 w-40 z-50 transition-opacity duration-200",
                    openDropdown === idx
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  )}
                >
                  {item.dropdown.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Button Section */}
        <div className="ml-2 sm:ml-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="border text-xs sm:text-sm font-medium relative border-neutral-200 dark:border-white/20 text-black dark:text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-full"
            >
              <span>Logout</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-red-500 to-transparent h-px" />
            </button>
          ) : (
            <Link href="/login">
              <button className="border text-xs sm:text-sm font-medium relative border-neutral-200 dark:border-white/20 text-black dark:text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-full">
                <span>Login</span>
                <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-blue-500 to-transparent h-px" />
              </button>
            </Link>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
