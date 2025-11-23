"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export const FloatingNav = ({ navItems, className }) => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [visible] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto rounded-full dark:bg-black bg-white shadow-input z-50 pr-2 pl-8 py-2 items-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={idx}
            href={navItem.href}
            className="text-sm text-neutral-700 dark:text-neutral-50 hover:text-neutral-400"
          >
            {navItem.name}
          </Link>
        ))}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border text-sm font-medium relative border-neutral-200 dark:border-white/20 text-black dark:text-white px-4 py-2 rounded-full"
          >
            <span>Logout</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-red-500 to-transparent  h-px" />
          </button>
        ) : (
          <Link href="/login">
            <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/20 text-black dark:text-white px-4 py-2 rounded-full">
              <span>Login</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </button>
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
