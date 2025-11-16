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

export default function PolicyView({ selectedPolicy }: Props) {
    const [policy, setPolicy] = useState<Bill | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        getBill();
    }, [selectedPolicy]);

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8">
                        <LoaderCircle className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                        <div className="text-sm text-muted-foreground">Loading bill information...</div>
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
                    <div className="text-center text-muted-foreground">No bill data available</div>
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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">{policy.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
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
                                        <span className="font-semibold">Sponsor{policy.sponsors.length > 1 ? "s" : ""}: </span>
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
    );
}
