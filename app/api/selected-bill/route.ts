import { NextResponse } from "next/server";

const API_KEY = process.env.CONGRESS_API_KEY;

export async function GET(req: Request) {
    if (!API_KEY) {
        return NextResponse.json(
            { error: "CONGRESS_API_KEY is not defined in environment" },
            { status: 500 }
        );
    }

    try {
        const { congress_id, bill_type, bill_number } = await req.json();

        const res = await fetch(
            `https://api.congress.gov/v3/bill/${congress_id}/${bill_type}/${bill_number}?api_key=${API_KEY}`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: text || res.statusText },
                { status: res.status }
            );
        }

        const json = await res.json();
        return NextResponse.json(json);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}
