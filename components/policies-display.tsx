"use client";

import { useEffect, useState } from "react";

import { LoaderCircle } from "lucide-react";
import PoliciesSearch from "./policies-search";
import PolicyView from "./policy-view";

type Policy = {
  congress_id: string;
  title: string;
  bill_type: string;
  bill_number: string;
  industries: string[];
};

export default function PolicyDisplay() {
  const [policies, setPolicies] = useState<Policy[] | undefined>();
  // const [industries, setIndustries] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
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
        json.sort((a: Policy, b: Policy) => {

          if (a.congress_id !== b.congress_id) {
            return Number(b.congress_id) - Number(a.congress_id);
          }
          return Number(b.bill_number) - Number(a.bill_number);
        });
        setPolicies(json);
        if (json.length > 0) {
          setSelectedPolicy(json[0].congress_id +
            "-" +
            json[0].bill_type +
            "-" +
            json[0].bill_number)
        }
        // const data = json.bills;
        // setPolicies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    // async function getIndustries() {
    //   try {
    //     const res = await fetch("/api/industries");

    //     if (!res.ok) {
    //       const text = await res.text();
    //       throw new Error(text || res.statusText);
    //     }

    //     const json = await res.json();
    //     setIndustries(json);
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : "Unknown error");
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    getPolicies();
    // getIndustries();
  }, []);

  return (
    <div className="flex flex-col">
      {error && <div className="text-sm text-red-700">{error}</div>}
      <div className="w-full grid grid-cols-6 gap-4">
        <div className="col-span-2 border-r pr-4">
          <h2 className="font-bold text-2xl mb-2 mt-4">Recent Policies</h2>
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <LoaderCircle className="w-12 h-12 animate-spin" />
            </div>
          ) : (
            <PoliciesSearch policies={policies} setSelectedPolicy={setSelectedPolicy} />
          )}
        </div>
        <div className="col-span-4">
          {loading || !selectedPolicy ? (
            <div className="flex w-full items-center justify-center">
              <LoaderCircle className="w-12 h-12 animate-spin" />
            </div>
          ) : (
            <PolicyView selectedPolicy={selectedPolicy} />
          )}
        </div>
      </div>
    </div>
  );
}