"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } else {
      setSuccess("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-neutral-900 p-8 rounded-xl shadow-lg border border-neutral-700"
      >
        <h2 className="text-3xl font-semibold text-white mb-6">
          Contact Us
        </h2>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-2 block">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Your Name"
            required
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-2 block">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Your Email"
            required
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-2 block">Message</label>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Write your message..."
            required
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && (
          <p className="text-green-400 text-sm mt-4">{success}</p>
        )}
      </form>
    </div>
  );
}
