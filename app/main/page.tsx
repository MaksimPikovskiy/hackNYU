import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getBills } from "../api/bills";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InputForm from "@/components/InputForm";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch bills on the server side to avoid using client-side hooks in an async/server component
  const bills = await getBills();

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Current Bills</h2>
        <Accordion type="multiple">
          {bills.bills.map((bill) => (
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
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Input Form</h2>
        <InputForm />
      </div>
    </div>
  );
}
