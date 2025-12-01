"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Roadmap() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchRoadmap() {
      try {
        const statusRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!statusRes.ok) throw new Error("Failed to fetch onboarding status");
        const statusData = await statusRes.json();

        if (!statusData.isOnboarded) {
          router.replace("/onboarding");
          return;
        }
        const planRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/learning-plan`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!planRes.ok) throw new Error("Failed to fetch learning plan");

        const planData = await planRes.json();
        const parsedPlan = JSON.parse(planData.plan.planJson);
        setPlan(parsedPlan);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, [router]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500 text-lg">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">Error: {error}</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Your Roadmap for {plan.role}
      </h1>

      <div className="grid gap-8">
        {plan.weeks.map((week) => (
          <div
            key={week.week}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">
              Week {week.week}: {week.title}
            </h2>

            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Tasks:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {week.tasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Resources:</h3>
              <ul className="space-y-1">
                {week.resources.map((res, idx) => (
                  <li key={idx}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {res.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
