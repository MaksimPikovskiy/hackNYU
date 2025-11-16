"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Policy = {
  congress_id: string;
  title: string;
  bill_type: string;
  bill_number: string;
  industries: string[];
};

type Props = {
  policies: Policy[] | undefined;
};

export default function PoliciesSearch({ policies }: Props) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(policies ?? [], {
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
  }, [policies]);

  const results = useMemo(() => {
    if (!policies) return [];

    if (!query.trim()) return policies;

    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, policies]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search bills or policies…"
        className="border p-2 rounded w-full"
      />

      {results ? (
        <Accordion type="multiple">
          {results.map((policy) => (
            <AccordionItem
              key={
                policy.congress_id +
                "-" +
                policy.bill_type +
                "-" +
                policy.bill_number
              }
              value={
                policy.congress_id +
                "-" +
                policy.bill_type +
                "-" +
                policy.bill_number
              }
            >
              <AccordionTrigger>{policy.title}</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-slate-500">
                  Congress {policy.congress_id}
                </div>
                <div className="text-lg font-semibold">
                  {policy.bill_type} {policy.bill_number}
                </div>
                <div className="text-xs text-slate-500">
                  {policy.industries.join(", ")}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex w-full items-center justify-center">
          <h2>No Policies Found.</h2>
        </div>
      )}
    </div>
  );
}
