"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Bill = {
  congress: string;
  number: string;
  title: string;
  type?: string;
  originChamber?: string;
  latestAction?: { text?: string; actionDate?: string };
  url?: string;
};

export default function BillsDisplay() {
  const [bills, setBills] = useState<Bill[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getBills() {
      try {
        const res = await fetch("/api/bills");

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const json = await res.json();
        const data = json.bills;
        setBills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    getBills();
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
      <h2 className="font-bold text-2xl mb-4">Current Bills</h2>
      {bills && (
        <Accordion type="multiple">
          {bills.map((bill) => (
            <AccordionItem
              key={bill.congress + " - " + bill.number}
              value={bill.congress + " - " + bill.number}
            >
              <AccordionTrigger>{bill.title}</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-slate-500">
                  {bill.type} • Congress {bill.congress}
                </div>
                <div className="text-lg font-semibold">
                  {bill.type} {bill.number}
                </div>
                <div className="text-sm text-slate-600">
                  Origin: {bill.originChamber}
                </div>

                <div className="text-sm mt-2">{bill.latestAction?.text}</div>
                {bill.latestAction?.actionDate && (
                  <div className="text-xs text-slate-500">
                    Action date: {formatDate(bill.latestAction.actionDate)}
                  </div>
                )}

                <a
                  href={bill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-600 underline mt-2"
                >
                  View bill
                </a>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
