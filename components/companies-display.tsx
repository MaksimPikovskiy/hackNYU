"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Company = {
  name: string;
  industries: string[];
};

export default function CompanyDisplay() {
  const [companies, setCompanies] = useState<Company[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCompanies() {
      try {
        const res = await fetch("/api/companies");

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const json = await res.json();
        setCompanies(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    getCompanies();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Current Companies</h2>
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <LoaderCircle className="w-12 h-12 animate-spin" />
        </div>
      ) : companies ? (
        companies.map((company) => (
          <div key={company.name}>
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <p>{company.industries.join(", ")}</p>
          </div>
        ))
      ) : (
        <div className="flex w-full items-center justify-center">
          <h2>No Companies Found.</h2>
        </div>
      )}

      {error && <div className="text-sm text-red-700">{error}</div>}
    </div>
  );
}
