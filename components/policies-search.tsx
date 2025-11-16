"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Filter, X, Sparkles, LoaderCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  system_prompt_bill_summarization,
  formatBillSummarizationMessage,
} from "@/utils/constants";

type Policy = {
  congress_id: number;
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
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(
    new Set()
  );
  const [selectedBillTypes, setSelectedBillTypes] = useState<Set<string>>(
    new Set()
  );
  const [selectedCongressIds, setSelectedCongressIds] = useState<Set<number>>(
    new Set()
  );
  const [summaries, setSummaries] = useState<Map<string, string>>(new Map());
  const [loadingSummaries, setLoadingSummaries] = useState<Set<string>>(
    new Set()
  );

  // Get unique values for filters
  const uniqueIndustries = useMemo(() => {
    if (!policies) return [];
    const industries = new Set<string>();
    policies.forEach((policy) => {
      policy.industries.forEach((ind) => industries.add(ind));
    });
    return Array.from(industries).sort();
  }, [policies]);

  const uniqueBillTypes = useMemo(() => {
    if (!policies) return [];
    const types = new Set<string>();
    policies.forEach((policy) => {
      if (policy.bill_type) types.add(policy.bill_type);
    });
    return Array.from(types).sort();
  }, [policies]);

  const uniqueCongressIds = useMemo(() => {
    if (!policies) return [];
    const ids = new Set<number>();
    policies.forEach((policy) => {
      ids.add(policy.congress_id);
    });
    return Array.from(ids).sort((a, b) => b - a);
  }, [policies]);

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

  const filteredResults = useMemo(() => {
    if (!policies) return [];

    let filtered = policies;

    // Apply search query
    if (query.trim()) {
      filtered = fuse.search(query).map((r) => r.item);
    }

    // Apply industry filter
    if (selectedIndustries.size > 0) {
      filtered = filtered.filter((policy) =>
        policy.industries.some((ind) => selectedIndustries.has(ind))
      );
    }

    // Apply bill type filter
    if (selectedBillTypes.size > 0) {
      filtered = filtered.filter((policy) =>
        selectedBillTypes.has(policy.bill_type)
      );
    }

    // Apply Congress ID filter
    if (selectedCongressIds.size > 0) {
      filtered = filtered.filter((policy) =>
        selectedCongressIds.has(policy.congress_id)
      );
    }

    return filtered;
  }, [
    query,
    fuse,
    policies,
    selectedIndustries,
    selectedBillTypes,
    selectedCongressIds,
  ]);

  const hasActiveFilters =
    selectedIndustries.size > 0 ||
    selectedBillTypes.size > 0 ||
    selectedCongressIds.size > 0;

  const clearFilters = () => {
    setSelectedIndustries(new Set());
    setSelectedBillTypes(new Set());
    setSelectedCongressIds(new Set());
  };

  const toggleIndustry = (industry: string) => {
    const newSet = new Set(selectedIndustries);
    if (newSet.has(industry)) {
      newSet.delete(industry);
    } else {
      newSet.add(industry);
    }
    setSelectedIndustries(newSet);
  };

  const toggleBillType = (billType: string) => {
    const newSet = new Set(selectedBillTypes);
    if (newSet.has(billType)) {
      newSet.delete(billType);
    } else {
      newSet.add(billType);
    }
    setSelectedBillTypes(newSet);
  };

  const toggleCongressId = (congressId: number) => {
    const newSet = new Set(selectedCongressIds);
    if (newSet.has(congressId)) {
      newSet.delete(congressId);
    } else {
      newSet.add(congressId);
    }
    setSelectedCongressIds(newSet);
  };

  const getBillKey = (policy: Policy) => {
    return `${policy.congress_id}-${policy.bill_type}-${policy.bill_number}`;
  };

  const handleSummarize = async (policy: Policy) => {
    const billKey = getBillKey(policy);
    
    // Don't re-summarize if already summarized or currently loading
    if (summaries.has(billKey) || loadingSummaries.has(billKey)) {
      return;
    }

    setLoadingSummaries((prev) => new Set(prev).add(billKey));

    try {
      const userPrompt = formatBillSummarizationMessage(
        policy.title,
        policy.bill_type,
        policy.bill_number,
        policy.congress_id,
        policy.industries
      );

      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_prompt: system_prompt_bill_summarization,
          user_prompt: userPrompt,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      const summary = await res.text();
      setSummaries((prev) => new Map(prev).set(billKey, summary));
    } catch (err) {
      console.error("Error summarizing bill:", err);
      // Optionally show error to user
    } finally {
      setLoadingSummaries((prev) => {
        const newSet = new Set(prev);
        newSet.delete(billKey);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bills or policies…"
          className="border p-2 rounded w-full flex-1"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {selectedIndustries.size +
                    selectedBillTypes.size +
                    selectedCongressIds.size}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-[80vh] overflow-y-auto">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Industries
            </DropdownMenuLabel>
            <div className="max-h-48 overflow-y-auto">
              {uniqueIndustries.map((industry) => (
                <DropdownMenuCheckboxItem
                  key={industry}
                  checked={selectedIndustries.has(industry)}
                  onCheckedChange={() => toggleIndustry(industry)}
                >
                  {industry}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Bill Type
            </DropdownMenuLabel>
            {uniqueBillTypes.map((billType) => (
              <DropdownMenuCheckboxItem
                key={billType}
                checked={selectedBillTypes.has(billType)}
                onCheckedChange={() => toggleBillType(billType)}
              >
                {billType}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Congress
            </DropdownMenuLabel>
            {uniqueCongressIds.map((congressId) => (
              <DropdownMenuCheckboxItem
                key={congressId}
                checked={selectedCongressIds.has(congressId)}
                onCheckedChange={() => toggleCongressId(congressId)}
              >
                Congress {congressId}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />

            {hasActiveFilters && (
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full justify-start"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Array.from(selectedIndustries).map((industry) => (
            <Badge
              key={industry}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => toggleIndustry(industry)}
            >
              {industry}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {Array.from(selectedBillTypes).map((billType) => (
            <Badge
              key={billType}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => toggleBillType(billType)}
            >
              {billType}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {Array.from(selectedCongressIds).map((congressId) => (
            <Badge
              key={congressId}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => toggleCongressId(congressId)}
            >
              Congress {congressId}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {filteredResults.length > 0 ? (
        <div className="text-sm text-muted-foreground">
          Showing {filteredResults.length} of {policies?.length || 0} policies
        </div>
      ) : null}

      {filteredResults.length > 0 ? (
        <Accordion type="multiple">
          {filteredResults.map((policy) => {
            const billKey = getBillKey(policy);
            const summary = summaries.get(billKey);
            const isLoading = loadingSummaries.has(billKey);
            const hasSummary = !!summary;

            return (
              <AccordionItem
                key={billKey}
                value={billKey}
              >
                <AccordionTrigger>{policy.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="text-sm text-slate-500">
                      Congress {policy.congress_id}
                    </div>
                    <div className="text-lg font-semibold">
                      {policy.bill_type} {policy.bill_number}
                    </div>
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold">Industries:</span>{" "}
                      {policy.industries.join(", ")}
                    </div>

                    <div className="pt-2 border-t">
                      {!hasSummary && !isLoading && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSummarize(policy)}
                          className="gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Summarize Bill
                        </Button>
                      )}

                      {isLoading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Generating summary...
                        </div>
                      )}

                      {hasSummary && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">AI Summary</h4>
                            <Badge variant="secondary" className="text-xs">
                              Token-optimized
                            </Badge>
                          </div>
                          <div className="text-sm text-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                            {summary}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">No Policies Found</h2>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
