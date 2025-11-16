import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "public", "companies.json");

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
