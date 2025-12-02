"use client";
import { useState, useEffect } from "react";
import PrimaryButton from "@/app/components/ui/primaryButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const emptyResume = {
  bio: "",
  experience: [],
  skills: [],
  education: [],
  projects: [],
  contactInfo: {
    email: "",
    linkedin: "",
    github: "",
    leetcode: "",
    codeforces: "",
  },
};

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState(null);
  const [form, setForm] = useState(emptyResume);
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

          const content = JSON.parse(data.resume.content || "{}");

          setForm({
            ...emptyResume,
            ...content,
            experience: content.experience || [],
            skills: content.skills || [],
            education: content.education || [],
            projects: content.projects || [],
            contactInfo: {
              ...emptyResume.contactInfo,
              ...(content.contactInfo || {}),
            },
          });
        }
      } catch (err) {}
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
      } else {
        setMessage(data.error || "Error saving resume");
      }
    } catch (err) {
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
        setForm(emptyResume);
      } else {
        setMessage(data.error || "Error deleting resume");
      }
    } catch (err) {
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

      if (data.success) {
        setForm({ ...form, [type]: data.improved });
      } else {
        setMessage(data.error || "Error improving resume");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8 flex justify-center">
      <div className="w-full max-w-3xl bg-neutral-900 p-8 rounded-xl border border-neutral-800">
        <h1 className="text-3xl font-bold text-gray-400 text-center mb-4">Resume Generator</h1>

        {message && <p className="text-green-400 mb-4">{message}</p>}

        <div
          id="resume-preview"
          className="p-8 rounded-lg"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.5,
          }}
        >
          {form.bio && (
            <div className="mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>Bio</h2>
              <p style={{ marginBottom: "8px" }}>{form.bio}</p>
            </div>
          )}

          {form.experience.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>Experience</h2>
              <ul style={{ marginLeft: "16px", marginBottom: "8px" }}>
                {form.experience.map((exp, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{exp}</li>
                ))}
              </ul>
            </div>
          )}

          {form.skills.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>Skills</h2>
              <ul style={{ marginLeft: "16px", marginBottom: "8px" }}>
                {form.skills.map((skill, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {form.education.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>Education</h2>
              <ul style={{ marginLeft: "16px", marginBottom: "8px" }}>
                {form.education.map((edu, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{edu}</li>
                ))}
              </ul>
            </div>
          )}

          {form.projects.length > 0 && (
            <div className="mb-6">
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>Projects</h2>
              <ul style={{ marginLeft: "16px", marginBottom: "8px" }}>
                {form.projects.map((p, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>Contact Info</h2>
            <ul style={{ marginLeft: "16px" }}>
              {Object.entries(form.contactInfo).map(([key, value]) => (
                <li key={key} style={{ marginBottom: "4px" }}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <label className="font-semibold text-gray-300">Bio</label>
            <textarea
              className="w-full p-3 mt-1 bg-neutral-800 rounded-lg text-white"
              value={form.bio}
              onChange={(e) => handleChange(e, "bio")}
              placeholder="Write a short professional summary..."
            />
            <div className="mt-2">
              <PrimaryButton onClick={() => handleImprove("bio")} className="text-green-300!">
                Improve Bio
              </PrimaryButton>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-semibold text-gray-300">Experience</label>
            {form.experience.map((exp, i) => (
              <input
                key={i}
                className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
                value={exp}
                onChange={(e) => handleChange(e, "experience", i)}
                placeholder="Add an experience"
              />
            ))}
            <div className="mt-2">
              <PrimaryButton onClick={() => handleAddField("experience")} className="text-green-300!">
                Add Experience
              </PrimaryButton>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-semibold text-gray-300">Skills</label>
            {form.skills.map((skill, i) => (
              <input
                key={i}
                className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
                value={skill}
                onChange={(e) => handleChange(e, "skills", i)}
                placeholder="Add a skill"
              />
            ))}
            <div className="mt-2">
              <PrimaryButton onClick={() => handleAddField("skills")} className="text-green-300!">
                Add Skill
              </PrimaryButton>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-semibold text-gray-300">Education</label>
            {form.education.map((edu, i) => (
              <input
                key={i}
                className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
                value={edu}
                onChange={(e) => handleChange(e, "education", i)}
                placeholder="Add an education entry"
              />
            ))}
            <div className="mt-2">
              <PrimaryButton onClick={() => handleAddField("education")} className="text-green-300!">
                Add Education
              </PrimaryButton>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-semibold text-gray-300">Projects</label>
            {form.projects.map((p, i) => (
              <input
                key={i}
                className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
                value={p}
                onChange={(e) => handleChange(e, "projects", i)}
                placeholder="Add a project"
              />
            ))}
            <div className="mt-2">
              <PrimaryButton onClick={() => handleAddField("projects")} className="text-green-300!">
                Add Project
              </PrimaryButton>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-semibold text-gray-300">Contact Info</label>

            <input
              type="email"
              placeholder="Email"
              value={form.contactInfo.email}
              onChange={(e) => handleChange(e, "contactInfo", null, "email")}
              className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
            />

            <input
              placeholder="LinkedIn URL"
              value={form.contactInfo.linkedin}
              onChange={(e) => handleChange(e, "contactInfo", null, "linkedin")}
              className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
            />

            <input
              placeholder="GitHub URL"
              value={form.contactInfo.github}
              onChange={(e) => handleChange(e, "contactInfo", null, "github")}
              className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
            />

            <input
              placeholder="LeetCode Username"
              value={form.contactInfo.leetcode}
              onChange={(e) => handleChange(e, "contactInfo", null, "leetcode")}
              className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
            />

            <input
              placeholder="Codeforces Handle"
              value={form.contactInfo.codeforces}
              onChange={(e) => handleChange(e, "contactInfo", null, "codeforces")}
              className="w-full mt-2 p-2 bg-neutral-800 rounded-lg text-white"
            />
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            <PrimaryButton onClick={handleSubmit} disabled={loading} className="text-green-300!">
              {resume ? "Update Resume" : "Create Resume"}
            </PrimaryButton>

            {resume && (
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-black text-red-400 rounded-full hover:bg-red-700"
              >
                Delete
              </button>
            )}

            <PrimaryButton onClick={downloadPDF} className="text-green-300!">
              Download Resume as PDF
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
