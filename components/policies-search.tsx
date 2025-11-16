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
  congress: string;
  number: string;
  title: string;
  type?: string;
  originChamber?: string;
  latestAction?: { text?: string; actionDate?: string };
  url?: string;
};

type Props = {
  policies: Policy[] | undefined;
};

export default function PoliciesSearch({ policies }: Props) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(policies ?? [], {
      keys: ["title", "number", "type", "originChamber", "latestAction.text"],
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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

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
              key={policy.congress + " - " + policy.number}
              value={policy.congress + " - " + policy.number}
            >
              <AccordionTrigger>{policy.title}</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-slate-500">
                  {policy.type} • Congress {policy.congress}
                </div>
                <div className="text-lg font-semibold">
                  {policy.type} {policy.number}
                </div>
                <div className="text-sm text-slate-600">
                  Origin: {policy.originChamber}
                </div>

                <div className="text-sm mt-2">{policy.latestAction?.text}</div>
                {policy.latestAction?.actionDate && (
                  <div className="text-xs text-slate-500">
                    Action date: {formatDate(policy.latestAction.actionDate)}
                  </div>
                )}

                <a
                  href={policy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-600 underline mt-2"
                >
                  View policy
                </a>
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
