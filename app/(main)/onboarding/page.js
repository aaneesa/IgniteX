"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    industry: "",
    experience: "",
    bio: "",
    skills: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        router.replace("/roadmap");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 p-10 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Complete Your Profile
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Help us personalize your weekly learning roadmap ✨
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Industry */}
          <div>
            <label className="text-gray-300 text-sm">Industry</label>
            <input
              type="text"
              placeholder="e.g., Web Development, AI, Marketing"
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
              onChange={(e) =>
                setForm({ ...form, industry: e.target.value })
              }
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="text-gray-300 text-sm">Experience</label>
            <input
              type="text"
              placeholder="e.g., Beginner, 1 year, 3 years"
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-gray-300 text-sm">Bio</label>
            <textarea
              placeholder="Tell us about your goals, background, or interests..."
              rows="4"
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none resize-none"
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-gray-300 text-sm">Skills</label>
            <input
              type="text"
              placeholder="e.g., JavaScript, UI/UX, Python"
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
              onChange={(e) =>
                setForm({ ...form, skills: e.target.value })
              }
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Save & Continue →
          </button>

          {message && (
            <p className="text-red-400 text-center mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
