"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Roadmap() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/login");
      return;
    }

    async function checkStatus() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch status");

        const data = await res.json();

        if (!data.isOnboarded) {
          router.replace("/onboarding");
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    checkStatus();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <h1>Your Roadmap Content...</h1>;
}