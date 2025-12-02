"use client";
import { useState, useEffect } from "react";

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState(null);
  const [form, setForm] = useState({
  bio: "",
  experience: [],
  skills: [],
  education: [],
  projects: [],
  contactInfo: { email: "", linkedin: "", github: "", leetcode: "", codeforces: "" },
});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () =>
    document.cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

useEffect(() => {
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

      const content = JSON.parse(data.resume.content);

setForm({
  bio: content.bio || content.summary || "", 
  experience: content.experience || [],
  skills: Array.isArray(content.skills) 
         ? content.skills 
         : content.skills?.split(",").filter(Boolean) || [],
  education: content.education || [],
  projects: content.projects || [],
  contactInfo: content.contactInfo || {
    email: "",
    linkedin: "",
    github: "",
    leetcode: "",
    codeforces: "",
  },
});
    }
  } catch (err) {
    console.error(err);
  }
};

  fetchResume();
}, []);


  const handleChange = (e, field, index = null, subField = null) => {
    if (index !== null) {
      const arr = [...form[field]];
      arr[index] = e.target.value;
      setForm({ ...form, [field]: arr });
    } else if (subField) {
      setForm({ ...form, [field]: { ...form[field], [subField]: e.target.value } });
    } else {
      setForm({ ...form, [field]: e.target.value });
    }
  };

  const handleAddField = (field) => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/resume/`;
      const method = resume ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: form }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Resume saved successfully!");
        setResume(data.resume);
      } else setMessage(data.error || "Error saving resume");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!resume || !token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Resume deleted");
        setResume(null);
        setForm({ bio: "", experience: [], skills: [], contactInfo: { email: "", linkedin: "", github: "", leetcode: "", codeforces: "" } });
      } else setMessage(data.error || "Error deleting resume");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  const handleImprove = async (type) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/improve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current: form[type], type }),
      });
      const data = await res.json();
      if (data.success) setForm({ ...form, [type]: data.improved });
      else setMessage(data.error || "Error improving resume");
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
          <button onClick={() => handleImprove("bio")} className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">Improve Bio</button>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <label className="text-white font-semibold">Experience</label>
          {form.experience.map((exp, i) => (
            <input key={i} className="w-full mb-2 p-2 bg-neutral-800 rounded-lg text-white" value={exp} onChange={(e) => handleChange(e, "experience", i)} />
          ))}
          <button onClick={() => handleAddField("experience")} className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">Add Experience</button>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="text-white font-semibold">Skills</label>
          {form.skills.map((skill, i) => (
            <input key={i} className="w-full mb-2 p-2 bg-neutral-800 rounded-lg text-white" value={skill} onChange={(e) => handleChange(e, "skills", i)} />
          ))}
          <button onClick={() => handleAddField("skills")} className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">Add Skill</button>
        </div>

        {/* Contact Info */}
        {/* Contact Info */}
<div className="mb-4">
  <label className="text-white font-semibold">Contact Info</label>
  {["email", "linkedin", "github", "leetcode", "codeforces"].map((field) => (
    <input
      key={field}
      type={field === "email" ? "email" : "text"}
      placeholder={field}
      value={form.contactInfo?.[field] || ""} // <-- safe fallback
      onChange={(e) => handleChange(e, "contactInfo", null, field)}
      className="w-full mb-2 p-2 bg-neutral-800 rounded-lg text-white"
    />
  ))}
</div>


        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200">{resume ? "Update Resume" : "Create Resume"}</button>
          {resume && <button onClick={handleDelete} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>}
        </div>
      </div>
    </div>
  );
}
