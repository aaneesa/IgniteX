"use client";

import { useState } from "react";

export default function ResumeGenerate({ refresh }) {
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [message, setMessage] = useState("");

  const [improving, setImproving] = useState(false);
  const [saving, setSaving] = useState(false);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
  };

  const improveBio = async () => {
    const token = getToken();
    if (!bio.trim()) return;

    setImproving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resume/improve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current: bio,
            type: "bio",
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setBio(data.improved);
      }
    } catch (err) {
      console.error(err);
    }

    setImproving(false);
  };

  const handleGenerate = async () => {
    setSaving(true);

    const token = getToken();

    const content = `
BIO:
${bio}

EXPERIENCE:
${experience}

SKILLS:
${skills}

PROJECTS:
${projects}
`;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        refresh(); 
      } else {
        setMessage(data.message || "Error generating resume");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }

    setSaving(false);
  };

  return (
    <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Build Your Resume
      </h2>

      <div className="mb-6">
        <label className="text-gray-300 text-sm">Professional Bio</label>
        <textarea
          className="w-full mt-1 p-4 bg-neutral-800 rounded-lg border border-neutral-700 text-white resize-none h-28"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short professional bio..."
        />

        <button
          onClick={improveBio}
          disabled={improving}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 disabled:opacity-50"
        >
          {improving ? "Improving..." : "Improve with AI ✨"}
        </button>
      </div>

      <div className="mb-6 bg-neutral-800/60 p-4 rounded-lg">
        <label className="text-gray-300 text-sm">Experience</label>
        <textarea
          className="w-full mt-1 p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white h-24 resize-none"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="List your work experience..."
        />
      </div>

      <div className="mb-6 bg-neutral-800/60 p-4 rounded-lg">
        <label className="text-gray-300 text-sm">Skills</label>
        <textarea
          className="w-full mt-1 p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white h-20 resize-none"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Eg: JavaScript, React, Node.js..."
        />
      </div>

      <div className="mb-6 bg-neutral-800/60 p-4 rounded-lg">
        <label className="text-gray-300 text-sm">Projects</label>
        <textarea
          className="w-full mt-1 p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white h-24 resize-none"
          value={projects}
          onChange={(e) => setProjects(e.target.value)}
          placeholder="Mention 2–3 good projects..."
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={saving}
        className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Resume"}
      </button>

      {message && (
        <p className="text-red-400 text-center mt-3">{message}</p>
      )}
    </div>
  );
}
