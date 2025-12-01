"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { industries } from "@/data/industries";

export default function OnboardingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    industry: "",
    subIndustry: "",
    experience: "",
    bio: "",
    skills: [],
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

    // 🔥 FINAL FORMAT STORED
    const finalIndustry = `${form.industry} - ${form.subIndustry}`;

    const payload = {
      ...form,
      industry: finalIndustry,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
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

  // get selected industry info
  const selectedIndustry = industries.find(
    (i) => i.name === form.industry
  );

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
            <select
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
              value={form.industry}
              onChange={(e) =>
                setForm({
                  ...form,
                  industry: e.target.value,
                  subIndustry: "", 
                })
              }
              required
            >
              <option value="">Select Industry</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.name}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subindustry */}
          {form.industry && (
            <div>
              <label className="text-gray-300 text-sm">Specialization</label>
              <select
                className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
                value={form.subIndustry}
                onChange={(e) =>
                  setForm({ ...form, subIndustry: e.target.value })
                }
                required
              >
                <option value="">Select Specialization</option>
                {selectedIndustry?.subIndustries.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Experience */}
          <div>
            <label className="text-gray-300 text-sm">Experience</label>
            <input
              type="number"
              placeholder="e.g., 0, 1, 3"
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
              onChange={(e) =>
                setForm({ ...form, experience: parseInt(e.target.value) })
              }
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-gray-300 text-sm">Bio</label>
            <textarea
              rows="4"
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white resize-none"
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
              className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
              onChange={(e) =>
                setForm({
                  ...form,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
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
