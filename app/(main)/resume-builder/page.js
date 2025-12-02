"use client";

import { useState, useEffect } from "react";

export default function ResumeBuilderPage() {
  const initialForm = {
    contactInfo: {
      email: "",
      mobile: "",
      linkedin: "",
      github: "",
      leetcode: "",
      codeforces: "",
    },
    summary: "",
    skills: "",
    experience: [],
    education: [],
    projects: [],
  };

  const [form, setForm] = useState(initialForm);
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
  };

  // Fetch user's existing resume
  const fetchResume = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && data.resumes.length > 0) {
        const userResume = data.resumes[0];
        const resumeContent = JSON.parse(userResume.content);

        setForm({
          ...initialForm,       // ensure all default fields exist
          ...resumeContent,     // override with existing resume
        });
        setResumeId(userResume.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  // Handle input changes
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

  // Add & Remove entries
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

  // AI Improve Summary
  const handleAiImprove = async () => {
    if (!form.summary) return;
    setAiLoading(true);
    const token = getToken();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/improve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  // Save or Update Resume
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();
    if (!token) return;

    try {
      const url = resumeId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/resume/${resumeId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/resume`;
      const method = resumeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: form }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(resumeId ? "Resume updated successfully!" : "Resume saved successfully!");
        if (!resumeId) setResumeId(data.resume.id); // set id after creation
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

  // Delete Resume
  const handleDelete = async () => {
    const token = getToken();
    if (!token || !resumeId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/${resumeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setForm(initialForm);
        setResumeId(null);
        setSuccess("Resume deleted successfully!");
      } else {
        setSuccess("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setSuccess("Something went wrong.");
    }
  };

  const contactFields = ["email", "mobile", "linkedin", "github", "leetcode", "codeforces"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-neutral-900 p-8 rounded-xl shadow-lg border border-neutral-700 space-y-6 text-gray-300">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Resume Builder</h1>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactFields.map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form.contactInfo?.[field] || ""}
              onChange={(e) => handleChange(e, "contactInfo", null, field)}
              className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          ))}
        </div>

        {/* Summary */}
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

        {/* Skills */}
        <div>
          <label className="block mb-2">Skills</label>
          <textarea
            value={form.skills}
            onChange={(e) => handleChange(e, null, null, "skills")}
            className="w-full p-3 bg-neutral-800 rounded-lg border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-white h-24"
            placeholder="List your skills..."
          />
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Experience</h2>
          {form.experience.map((exp, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-2">
              <input type="text" placeholder="Position" value={exp.title} onChange={(e) => handleChange(e, "experience", idx, "title")} className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white" />
              <input type="text" placeholder="Company" value={exp.organization} onChange={(e) => handleChange(e, "experience", idx, "organization")} className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white" />
              <textarea placeholder="Description" value={exp.description} onChange={(e) => handleChange(e, "experience", idx, "description")} className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white" />
              <button type="button" onClick={() => removeEntry("experience", idx)} className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addEntry("experience")} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">Add Experience</button>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          {form.projects.map((proj, idx) => (
            <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-2">
              <input type="text" placeholder="Project Name" value={proj.title} onChange={(e) => handleChange(e, "projects", idx, "title")} className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white" />
              <textarea placeholder="Description" value={proj.description} onChange={(e) => handleChange(e, "projects", idx, "description")} className="w-full p-2 bg-neutral-800 rounded-lg border border-neutral-600 text-white" />
              <button type="button" onClick={() => removeEntry("projects", idx)} className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addEntry("projects")} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">Add Project</button>
        </div>

        {/* Save & Delete Buttons */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="flex-1 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition disabled:opacity-50">
            {loading ? (resumeId ? "Updating..." : "Saving...") : (resumeId ? "Update Resume" : "Save Resume")}
          </button>
          {resumeId && (
            <button type="button" onClick={handleDelete} className="flex-1 py-3 bg-red-600 rounded-lg hover:bg-red-700 text-white">
              Delete Resume
            </button>
          )}
        </div>

        {success && <p className="text-green-400 mt-2 text-center">{success}</p>}
      </form>
    </div>
  );
}
