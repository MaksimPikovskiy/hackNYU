"use client";

import { useEffect, useState } from "react";

import { LoaderCircle } from "lucide-react";
import PoliciesSearch from "./policies-search";

type Policy = {
  congress_id: number;
  title: string;
  bill_type: string;
  bill_number: string;
  industries: string[];
};

export default function PolicyDisplay() {
  const [policies, setPolicies] = useState<Policy[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getPolicies() {
      try {
        const res = await fetch("/api/bills");

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const json = await res.json();
        setPolicies(json);
        // const data = json.bills;
        // setPolicies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    getPolicies();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Current Policies</h2>
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <LoaderCircle className="w-12 h-12 animate-spin" />
        </div>
      ) : (
        <PoliciesSearch policies={policies} />
      )}

      {error && <div className="text-sm text-red-700">{error}</div>}
    </div>
  );
}
