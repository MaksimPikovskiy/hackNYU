"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  system_prompt_bill_summarization,
  formatBillSummarizationMessage,
  system_prompt_recommendations,
  formatRecommendationsMessage,
} from "@/utils/constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  selectedPolicy: string;
};

type Bill = {
  title: string;
  number: string;
  type: string;
  congress: number;
  introducedDate: string;
  latestAction?: {
    actionDate: string;
    text: string;
  };
  sponsors?: Array<{
    fullName: string;
    party: string;
    state: string;
  }>;
  cosponsors?: {
    count: number;
  };
  policyArea?: {
    name: string;
  };
  legislationUrl?: string;
  laws?: Array<{
    number: string;
    type: string;
  }>;
  subjects?: {
    count: number;
  };
  summaries?: {
    count: number;
  };
};

type BillData = {
  congress_id: number;
  title: string;
  bill_type: string;
  bill_number: string;
  industries: string[];
};

type Recommendation = {
  industry_name: string;
  company_name: string;
  percentage: number;
};

export default function PolicyView({ selectedPolicy }: Props) {
  const [policy, setPolicy] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);

  const [summaries, setSummaries] = useState<Map<string, string>>(new Map());
  const [loadingSummaries, setLoadingSummaries] = useState<Set<string>>(
    new Set()
  );
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    async function getBill() {
      try {
        setLoading(true);
        setError(null);
        const [congress_id, bill_type, bill_number] = selectedPolicy.split("-");

        const res = await fetch("/api/selected-bill", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            congress_id,
            bill_type,
            bill_number,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const json = await res.json();
        const data = json.bill;
        setPolicy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    async function getSelectedBill() {
      try {
        const [congress_id, bill_type, bill_number] = selectedPolicy.split("-");
        const res = await fetch("/api/bills");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }
        const bills: BillData[] = await res.json();

        const matchingBill = bills.find(
          (bill) =>
            bill.congress_id.toString() === congress_id &&
            bill.bill_type === bill_type &&
            bill.bill_number === bill_number
        );

        if (matchingBill) {
          setIndustries(matchingBill.industries || []);
        } else {
          setIndustries([]);
        }
      } catch (err) {
        console.error("Error fetching bill industries:", err);
        setIndustries([]);
      }
    }

    getBill();
    getSelectedBill();
  }, [selectedPolicy]);

  useEffect(() => {
    async function getRecommendations() {
      if (!policy || industries.length === 0) {
        return;
      }

      try {
        setLoadingRecommendations(true);
        const userPrompt = formatRecommendationsMessage(
          policy.title,
          policy.type,
          policy.number,
          policy.congress,
          industries
        );

        const res = await fetch("/api/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_prompt: system_prompt_recommendations,
            user_prompt: userPrompt,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const text = await res.text();

        try {
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          const jsonText = jsonMatch ? jsonMatch[0] : text;
          const parsed = JSON.parse(jsonText);

          if (Array.isArray(parsed)) {
            setRecommendations(parsed);
          } else {
            console.error("Invalid recommendations format:", parsed);
            setRecommendations([]);
          }
        } catch (parseError) {
          console.error("Error parsing recommendations JSON:", parseError);
          console.error("Raw response:", text);
          setRecommendations([]);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    }

    getRecommendations();
  }, [policy, industries]);

  const getBillKey = (policy: Bill) => {
    return `${policy.congress}-${policy.type}-${policy.number}`;
  };

  const handleSummarize = async (policy: Bill) => {
    const billKey = getBillKey(policy);

    // Don't re-summarize if already summarized or currently loading
    if (summaries.has(billKey) || loadingSummaries.has(billKey)) {
      return;
    }

    setLoadingSummaries((prev) => new Set(prev).add(billKey));

    try {
      const userPrompt = formatBillSummarizationMessage(
        policy.title,
        policy.type,
        policy.number,
        policy.congress,
        industries
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

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <LoaderCircle className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
            <div className="text-sm text-muted-foreground">
              Loading bill information...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!policy) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No bill data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const billNumber = `${policy.type}. ${policy.number}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const billKey = getBillKey(policy);
  const summary = summaries.get(billKey);
  const isSummarizing = loadingSummaries.has(billKey);

  return (
    <div className="w-full space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{policy.title}</CardTitle>
            <Button
              onClick={() => handleSummarize(policy)}
              disabled={isSummarizing || !!summary}
              variant="outline"
            >
              {isSummarizing ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  Summarizing...
                </>
              ) : summary ? (
                "Summary Generated"
              ) : (
                "Generate Summary"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {summary && (
              <AccordionItem value="summary">
                <AccordionTrigger>AI Summary</AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summary}
                    </ReactMarkdown>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="overview">
              <AccordionTrigger>Overview</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Bill Number: </span>
                    <Badge variant="outline">{billNumber}</Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Congress: </span>
                    <span>{policy.congress}th Congress</span>
                  </div>
                  <div>
                    <span className="font-semibold">Introduced: </span>
                    <span>{formatDate(policy.introducedDate)}</span>
                  </div>
                  {policy.policyArea && (
                    <div>
                      <span className="font-semibold">Policy Area: </span>
                      <span>{policy.policyArea.name}</span>
                    </div>
                  )}
                  {industries.length > 0 && (
                    <div>
                      <span className="font-semibold">
                        Affected Industries:{" "}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {industries.map((industry, index) => (
                          <Badge key={index} variant="secondary">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="status">
              <AccordionTrigger>Status</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {policy.latestAction && (
                    <div>
                      <span className="font-semibold">Latest Action: </span>
                      <div className="mt-1">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(policy.latestAction.actionDate)}
                        </div>
                        <div>{policy.latestAction.text}</div>
                      </div>
                    </div>
                  )}
                  {policy.laws && policy.laws.length > 0 && (
                    <div>
                      <span className="font-semibold">Laws: </span>
                      <div className="mt-1 space-y-1">
                        {policy.laws.map((law, index) => (
                          <Badge key={index} variant="secondary">
                            {law.type} {law.number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sponsorship">
              <AccordionTrigger>Sponsorship</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {policy.sponsors && policy.sponsors.length > 0 && (
                    <div>
                      <span className="font-semibold">
                        Sponsor{policy.sponsors.length > 1 ? "s" : ""}:{" "}
                      </span>
                      <div className="mt-1 space-y-1">
                        {policy.sponsors.map((sponsor, index) => (
                          <div key={index}>
                            {sponsor.fullName}
                            {sponsor.party && (
                              <Badge variant="outline" className="ml-2">
                                {sponsor.party}-{sponsor.state}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {policy.cosponsors && (
                    <div>
                      <span className="font-semibold">Cosponsors: </span>
                      <span>{policy.cosponsors.count}</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="details">
              <AccordionTrigger>Additional Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {policy.subjects && (
                    <div>
                      <span className="font-semibold">Subjects: </span>
                      <span>{policy.subjects.count}</span>
                    </div>
                  )}
                  {policy.summaries && (
                    <div>
                      <span className="font-semibold">Summaries: </span>
                      <span>{policy.summaries.count}</span>
                    </div>
                  )}
                  {policy.legislationUrl && (
                    <div>
                      <span className="font-semibold">Legislation URL: </span>
                      <a
                        href={policy.legislationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View on Congress.gov
                      </a>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Investment Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">
                Analyzing bill impact on companies...
              </span>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {Array.from(
                new Set(recommendations.map((r) => r.industry_name))
              ).map((industry) => {
                const industryRecs = recommendations.filter(
                  (r) => r.industry_name === industry
                );
                return (
                  <div key={industry} className="border-l-2 border-muted pl-4">
                    <div className="font-semibold mb-3 text-lg">{industry}</div>
                    <div className="space-y-2">
                      {industryRecs.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-muted/50 last:border-b-0"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {rec.company_name}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {rec.percentage}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                affected
                              </div>
                            </div>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${rec.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No recommendations available yet. Recommendations will appear once
              analysis is complete.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
