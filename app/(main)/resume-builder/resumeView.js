"use client";

import { useState } from "react";

export default function ResumeView({ resume, refresh }) {
  const [content, setContent] = useState(resume.content);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
  };

  // UPDATE Resume
  const handleUpdate = async () => {
    const token = getToken();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resume/update/${resume.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setEditMode(false);
        refresh();
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  // DELETE Resume
  const handleDelete = async () => {
    const token = getToken();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resume/delete/${resume.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        refresh();
      } else {
        setMessage(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
      <h2 className="text-2xl font-bold mb-4">Your Resume</h2>

      {editMode ? (
        <textarea
          className="w-full h-60 bg-neutral-800 text-white p-4 rounded-lg border border-neutral-700"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <pre className="bg-neutral-800 p-4 rounded-lg text-gray-300 overflow-x-auto whitespace-pre-wrap">
          {content}
        </pre>
      )}

      <div className="flex gap-4 mt-4">
        {editMode ? (
          <button
            className="flex-1 py-3 bg-green-500 rounded-lg"
            onClick={handleUpdate}
          >
            Save
          </button>
        ) : (
          <button
            className="flex-1 py-3 bg-blue-500 rounded-lg"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        )}

        <button
          className="flex-1 py-3 bg-red-500 rounded-lg"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {message && (
        <p className="text-red-400 text-center mt-3">{message}</p>
      )}
    </div>
  );
}
