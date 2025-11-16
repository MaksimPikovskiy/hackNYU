"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoaderCircle } from "lucide-react";

type Policy = {
  congress: string;
  number: string;
  title: string;
  type?: string;
  originChamber?: string;
  latestAction?: { text?: string; actionDate?: string };
  url?: string;
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
        const data = json.bills;
        setPolicies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    getPolicies();
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Current Policies</h2>
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <LoaderCircle className="w-12 h-12 animate-spin" />
        </div>
      ) : policies ? (
        <Accordion type="multiple">
          {policies.map((policy) => (
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

      {error && <div className="text-sm text-red-700">{error}</div>}
    </div>
  );
}
