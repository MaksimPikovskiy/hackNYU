"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Button } from "./ui/button";

type Policy = {
  congress_id: string;
  title: string;
  bill_type: string;
  bill_number: string;
  industries: string[];
};

type Props = {
  policies: Policy[] | undefined;
  setSelectedPolicy: React.Dispatch<React.SetStateAction<string>>;
  selectedIndustry: string;
};

export default function PoliciesSearch({ policies, setSelectedPolicy, selectedIndustry }: Props) {
  const [query, setQuery] = useState("");

  const filteredPolicies = useMemo(() => {
    if (!policies) return [];

    if (selectedIndustry === "all") return policies;

    if (selectedIndustry) {
      return policies.filter((p) =>
        p.industries.some((industry) =>
          industry.toLowerCase() === selectedIndustry.toLowerCase()
        )
      );
    }

    return policies;
  }, [policies, selectedIndustry]);

  const fuse = useMemo(() => {
    return new Fuse(filteredPolicies ?? [], {
      keys: [
        "congress_id",
        "title",
        "bill_type",
        "bill_number",
        "industries",
        {
          name: "typeNumber",
          getFn: (p: Policy) =>
            `${p.bill_type ?? ""} ${p.bill_number ?? ""}`.trim(),
        },
      ],
      threshold: 0.3, // lower = stricter
      includeScore: true,
      ignoreLocation: true,
      includeMatches: true,
    });
  }, [filteredPolicies]);



  const results = useMemo(() => {
    if (!filteredPolicies) return [];

    if (!query.trim()) return filteredPolicies;

    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, filteredPolicies]);

  return (
    <div className="space-y-1">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search bills or policies…"
        className="border p-2 rounded w-full"
      />

      {results && results.length > 0 ? (
        <div className="space-y-4">
          {results.map((policy) => (
            <div key={
              policy.congress_id +
              "-" +
              policy.bill_type +
              "-" +
              policy.bill_number
            }>
              <div className="flex flex-row items-center justify-between mx-auto">
                <div

                >
                  <div className="text-sm text-slate-500">
                    Congress {policy.congress_id}
                  </div>
                  <div className="text-lg font-semibold">
                    {policy.bill_type} {policy.bill_number}
                  </div>
                  <div className="text-lg font-semibold">
                    {policy.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {policy.industries.join(", ")}
                  </div>
                </div>
                <Button onClick={() => setSelectedPolicy(
                  policy.congress_id +
                  "-" +
                  policy.bill_type +
                  "-" +
                  policy.bill_number
                )}>View</Button>
              </div>
              <hr className="mt-2"/>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <h2>No Policies Found.</h2>
        </div>
      )}
    </div>
  );
}
