import { NextResponse } from "next/server";

export async function GET() {

    try {
        return NextResponse.json(true);
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}