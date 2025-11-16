"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function IndustryDisplay() {
  const [industries, setIndustries] = useState<string[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getIndustries() {
      try {
        const res = await fetch("/api/industries");

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const json = await res.json();
        setIndustries(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    getIndustries();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Industries</h2>
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <LoaderCircle className="w-12 h-12 animate-spin" />
        </div>
      ) : industries ? (
        industries.map((industry) => <span key={industry}>{industry}</span>)
      ) : (
        <div className="flex w-full items-center justify-center">
          <h2>No Industries Found.</h2>
        </div>
      )}

      {error && <div className="text-sm text-red-700">{error}</div>}
    </div>
  );
}
