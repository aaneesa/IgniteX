"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";  // <-- added
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // <-- auth context login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        document.cookie = `token=${data.token}; path=/; max-age=604800;`;
        login(data.token);  
        router.replace("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-input w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome Back
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Login to continue your journey.
        </p>

        <form className="my-8" onSubmit={handleLogin}>
          {/* Email */}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </LabelInputContainer>

          {/* Password */}
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </LabelInputContainer>

          {/* Login Button */}
          <button
            type="submit"
            className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-700 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
          >
            Login →
            <BottomGradient />
          </button>

          {/* Link */}
          <p className="mt-3 text-sm text-neutral-300 text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-400 hover:underline">
              Sign up
            </Link>
          </p>

          {message && (
            <p className="text-center mt-3 text-sm text-neutral-300">
              {message}
            </p>
          )}

          <div className="my-8 h-1px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </form>
      </div>
    </div>
  );
}

/* Social Button */
const SocialButton = ({ icon, label }) => (
  <button
    type="button"
    className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:text-white dark:shadow-[0px_0px_1px_1px_#262626]"
  >
    <span className="h-4 w-4 text-neutral-800 dark:text-neutral-300">
      {icon}
    </span>
    <span className="text-sm text-neutral-700 dark:text-neutral-300">
      {label}
    </span>
    <BottomGradient />
  </button>
);

/* Gradient Underline Effect */
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

/* Input+Label wrapper */
const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
