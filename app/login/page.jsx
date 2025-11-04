"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful");
        setTimeout(() => router.push("/"), 200);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black-50">
      <form onSubmit={handleLogin} className="bg-gray-600 border-2 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-semibold flex justify-center items-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
        <p>Don't have an account? <span className="text-amber-100"><Link href ='/signup'>Signup</Link></span></p>
        {message && <p className="text-center mt-3 text-sm">{message}</p>}

      </form>
    </div>
  );
}
