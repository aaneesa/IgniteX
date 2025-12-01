"use client";
import { useState, useEffect } from "react";

export default function ResumePage({ initialContent }) {
  const [form, setForm] = useState({
    contactInfo: { email: "", mobile: "", linkedin: "", twitter: "" },
    summary: "",
    skills: "",
    experience: [],
    education: [],
    projects: [],
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e, section, index, field) => {
    if (section === "experience" || section === "education" || section === "projects") {
      const updated = [...form[section]];
      updated[index][field] = e.target.value;
      setForm({ ...form, [section]: updated });
    } else if (section === "contactInfo") {
      setForm({ ...form, contactInfo: { ...form.contactInfo, [field]: e.target.value } });
    } else {
      setForm({ ...form, [field]: e.target.value });
    }
  };

  const addEntry = (section) => {
    setForm({
      ...form,
      [section]: [...form[section], { title: "", organization: "", startDate: "", endDate: "", current: false, description: "" }],
    });
  };

  const removeEntry = (section, index) => {
    const updated = [...form[section]];
    updated.splice(index, 1);
    setForm({ ...form, [section]: updated });
  };

  const handleAiImprove = async () => {
    if (!form.summary) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/improve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: form.summary, type: "summary" }),
      });
      const data = await res.json();
      if (data.success) setForm({ ...form, summary: data.improved });
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: form }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Resume saved successfully!");
      } else {
        setSuccess("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setSuccess("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-neutral-900 p-8 rounded-xl shadow-lg border border-neutral-700 space-y-6 text-gray-300"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Resume Builder</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.contactInfo.email}
            onChange={(e) => handleChange(e, "contactInfo", null, "email")}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="tel"
            placeholder="Mobile"
            value={form.contactInfo.mobile}
            onChange={(e) => handleChange(e, "contactInfo", null, "mobile")}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="url"
            placeholder="LinkedIn"
            value={form.contactInfo.linkedin}
            onChange={(e) => handleChange(e, "contactInfo", null, "linkedin")}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="url"
            placeholder="GitHub"
            value={form.contactInfo.github}
            onChange={(e) => handleChange(e, "contactInfo", null, "github")}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div>
          <label className="block mb-2">Professional Summary</label>
          <textarea
            value={form.summary}
            onChange={(e) => handleChange(e, null, null, "summary")}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white h-32"
            placeholder="Write your professional bio..."
          />
          <button
            type="button"
            onClick={handleAiImprove}
            disabled={aiLoading}
            className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {aiLoading ? "Improving..." : "Improve with AI"}
          </button>
        </div>

        {/* SKILLS */}
        <div>
          <label className="block mb-2">Skills</label>
          <textarea
            value={form.skills}
            onChange={(e) => handleChange(e, null, null, "skills")}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white h-24"
            placeholder="List your skills..."
          />
        </div>

        {/* EXPERIENCE */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Experience</h2>
          {form.experience.map((exp, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Position"
                value={exp.title}
                onChange={(e) => handleChange(e, "experience", idx, "title")}
                className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white"
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.organization}
                onChange={(e) => handleChange(e, "experience", idx, "organization")}
                className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white"
              />
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => handleChange(e, "experience", idx, "description")}
                className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white"
              />
              <button
                type="button"
                onClick={() => removeEntry("experience", idx)}
                className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("experience")}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            Add Experience
          </button>
        </div>

        {/* PROJECTS */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          {form.projects.map((proj, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-2">
              <input
                type="text"
                placeholder="Project Name"
                value={proj.title}
                onChange={(e) => handleChange(e, "projects", idx, "title")}
                className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white"
              />
              <textarea
                placeholder="Description"
                value={proj.description}
                onChange={(e) => handleChange(e, "projects", idx, "description")}
                className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white"
              />
              <button
                type="button"
                onClick={() => removeEntry("projects", idx)}
                className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry("projects")}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            Add Project
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Resume"}
        </button>

        {success && <p className="text-green-400 mt-2">{success}</p>}
      </form>
    </div>
  );
}
