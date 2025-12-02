"use client";

import { useState, useEffect } from "react";

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState(null); // existing resume
  const [form, setForm] = useState({
    bio: "",
    experience: [],
    skills: [],
    contactInfo: {
      email: "",
      linkedin: "",
      github: "",
      leetcode: "",
      codeforces: "",
    },
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

  // Fetch current user's resume
  const fetchResume = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.resume) {
        setResume(data.resume);
        setForm(JSON.parse(data.resume.content));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleChange = (e, field, index = null, subField = null) => {
    if (index !== null && subField !== null) {
      const updatedArr = [...form[field]];
      updatedArr[index][subField] = e.target.value;
      setForm({ ...form, [field]: updatedArr });
    } else if (subField) {
      setForm({ ...form, [field]: { ...form[field], [subField]: e.target.value } });
    } else {
      setForm({ ...form, [field]: e.target.value });
    }
  };

  const handleAddExperience = () => {
    setForm({ ...form, experience: [...form.experience, ""] });
  };

  const handleAddSkill = () => {
    setForm({ ...form, skills: [...form.skills, ""] });
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/resume/`;
      const method = resume ? "PUT" : "POST";

      const res = await fetch(url + (resume ? resume.id : ""), {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: form }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Resume saved successfully!");
        fetchResume();
      } else {
        setMessage(data.error || "Error saving resume");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!resume) return;
    const token = getToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/${resume.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Resume deleted");
        setResume(null);
        setForm({
          bio: "",
          experience: [],
          skills: [],
          contactInfo: { email: "", linkedin: "", github: "", leetcode: "", codeforces: "" },
        });
      } else {
        setMessage(data.error || "Error deleting resume");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  const handleImprove = async (type) => {
    const token = getToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/improve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current: form[type], type }),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, [type]: data.improved });
      } else {
        setMessage(data.error || "Error improving resume");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8 flex justify-center">
      <div className="w-full max-w-3xl bg-neutral-900 p-8 rounded-xl border border-neutral-800">
        <h1 className="text-3xl font-bold text-white mb-4">Resume Builder</h1>

        {message && <p className="text-red-400 mb-4">{message}</p>}

        {/* Bio */}
        <div className="mb-4">
          <label className="text-white font-semibold">Bio</label>
          <textarea
            className="w-full p-3 bg-neutral-800 rounded-lg text-white"
            value={form.bio}
            onChange={(e) => handleChange(e, "bio")}
          />
          <button
            onClick={() => handleImprove("bio")}
            className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            Improve Bio with AI
          </button>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <label className="text-white font-semibold">Experience</label>
          {form.experience.map((exp, i) => (
            <input
              key={i}
              className="w-full mb-2 p-2 bg-neutral-800 rounded-lg text-white"
              value={exp}
              onChange={(e) => {
                const exps = [...form.experience];
                exps[i] = e.target.value;
                setForm({ ...form, experience: exps });
              }}
            />
          ))}
          <button onClick={handleAddExperience} className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
            Add Experience
          </button>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="text-white font-semibold">Skills</label>
          {form.skills.map((skill, i) => (
            <input
              key={i}
              className="w-full mb-2 p-2 bg-neutral-800 rounded-lg text-white"
              value={skill}
              onChange={(e) => {
                const skills = [...form.skills];
                skills[i] = e.target.value;
                setForm({ ...form, skills });
              }}
            />
          ))}
          <button onClick={handleAddSkill} className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
            Add Skill
          </button>
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <label className="text-white font-semibold">Contact Info</label>
          {["email", "linkedin", "github", "leetcode", "codeforces"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              placeholder={field}
              className="w-full mb-2 p-2 bg-neutral-800 rounded-lg text-white"
              value={form.contactInfo[field]}
              onChange={(e) => handleChange(e, "contactInfo", null, field)}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            {resume ? "Update Resume" : "Create Resume"}
          </button>

          {resume && (
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
