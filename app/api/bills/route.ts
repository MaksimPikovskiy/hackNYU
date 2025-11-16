import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const API_KEY = process.env.CONGRESS_API_KEY;

export async function GET() {
    if (!API_KEY) {
        return NextResponse.json(
            { error: "CONGRESS_API_KEY is not defined in environment" },
            { status: 500 }
        );
    }

    try {
        // const res = await fetch(
        //   `https://api.congress.gov/v3/bill?api_key=${API_KEY}`,
        //   { next: { revalidate: 60 } }
        // );

        // if (!res.ok) {
        //   const text = await res.text();
        //   return NextResponse.json(
        //     { error: text || res.statusText },
        //     { status: res.status }
        //   );
        // }

        // const json = await res.json();
        // return NextResponse.json(json);
        const filePath = path.join(process.cwd(), "public", "bills.json");

        const fileContents = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}
