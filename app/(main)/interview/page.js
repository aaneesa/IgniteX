"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  return document.cookie.split("; ").find((c) => c.trim().startsWith("token="))?.split("=")[1];
}

export default function InterviewPrepPage() {
  const [category, setCategory] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); 
  const [answers, setAnswers] = useState({}); 
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const params = new URLSearchParams({ page, limit, search, category: filterCategory, sort, order });
      const res = await fetch(`${API}/api/assessments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAssessments(data.assessments);
        setTotalPages(data.pages || 1);
      } else {
        setMessage(data.error || "Failed to load");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [page, search, filterCategory, sort, order]);

  const handleGenerate = async () => {
    if (!category) { setMessage("Enter a category"); return; }
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Assessment generated");
        setCategory("");
        fetchList();
      } else {
        setMessage(data.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this assessment?")) return;
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/assessments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Deleted");
        fetchList();
      } else setMessage(data.error || "Delete failed");
    } catch (err) { setMessage("Server error"); }
  };

  const openAttempt = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/assessments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setSelected(data.assessment);
        setAnswers({}); // reset answers
        setResult(null);
      } else setMessage(data.error || "Failed to open");
    } catch (err) { setMessage("Server error"); }
  };

  const submitAttempt = async () => {
    if (!selected) return;
    try {
      const token = getToken();
      const payload = Object.keys(answers).map(qId => ({
  qId: Number(qId),
  selectedIndex: answers[qId] 
}));
      const res = await fetch(`${API}/api/assessments/${selected.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        fetchList();
      } else setMessage(data.error || "Attempt failed");
    } catch (err) { setMessage("Server error"); }
  };

  const handleUpdateCategory = async (id, newCategory) => {
    try {
      const token = getToken();
      const res = await fetch(`${API}/api/assessments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: newCategory }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Updated");
        fetchList();
      } else setMessage(data.error || "Update failed");
    } catch (err) { setMessage("Server error"); }
  };

  return (
    <div className="min-h-screen p-8 bg-neutral-950 text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Interview Prep (AI)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input className="p-2 bg-neutral-800 rounded" placeholder="Category to generate (e.g. JavaScript)" value={category} onChange={(e)=>setCategory(e.target.value)} />
        <button className="px-4 py-2 bg-white text-black rounded" onClick={handleGenerate} disabled={loading}>Generate 10Q</button>
        <div className="flex gap-2">
          <input className="p-2 bg-neutral-800 rounded flex-1" placeholder="Search category/tip" value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label>Sort</label>
        <select value={sort} onChange={(e)=>setSort(e.target.value)} className="p-2 bg-neutral-800 rounded">
          <option value="createdAt">Created</option>
          <option value="quizScore">Score</option>
        </select>
        <select value={order} onChange={(e)=>setOrder(e.target.value)} className="p-2 bg-neutral-800 rounded">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {message && <div className="mb-4 text-yellow-300">{message}</div>}

      <div className="bg-neutral-900 p-4 rounded mb-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-300">
              <th className="p-2">Category</th>
              <th className="p-2">Score</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.length === 0 && <tr><td colSpan="4" className="p-4">No assessments</td></tr>}
            {assessments.map(a => (
              <tr key={a.id} className="odd:bg-neutral-800">
                <td className="p-2">{a.category}</td>
                <td className="p-2">{Math.round(a.quizScore)}</td>
                <td className="p-2">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={()=>openAttempt(a.id)} className="px-2 py-1 bg-green-500 rounded">Attempt</button>
                  <button onClick={()=>{ const newCat=prompt("New category", a.category); if(newCat) handleUpdateCategory(a.id, newCat); }} className="px-2 py-1 bg-yellow-600 rounded">Edit</button>
                  <button onClick={()=>handleDelete(a.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div>Page {page} / {totalPages}</div>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 bg-neutral-800 rounded">Prev</button>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 bg-neutral-800 rounded">Next</button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="bg-neutral-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">{selected.category}</h2>
          <div className="mb-2 text-sm text-gray-400">Tip: {selected.improvementTip}</div>

          {selected.questions.map((q) => (
            <div key={q.qId} className="mb-3">
              <div className="mb-1"><strong>Q{q.qId}:</strong> {q.question}</div>
              {q.options.map((opt, idx) => (
                <label key={idx} className="block cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${q.qId}`}
                    checked={answers[q.qId] === idx}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.qId]: idx }))}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <div className="flex gap-2 mt-3">
            <button onClick={submitAttempt} className="px-4 py-2 bg-white text-black rounded">Submit</button>
            <button onClick={()=>{ setSelected(null); setAnswers({}); setResult(null); }} className="px-4 py-2 bg-neutral-800 rounded">Close</button>
          </div>

          {result && (
            <div className="mt-4 p-3 bg-neutral-800 rounded">
              <div>Score: {Math.round(result.score)} / 100</div>
              <div>Correct: {result.correct} / {result.total}</div>
              <div className="mt-2 text-sm">{result.improvementTip}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
