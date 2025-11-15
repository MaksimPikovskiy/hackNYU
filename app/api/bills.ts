const API_KEY = process.env.CONGRESS_API_KEY;

if (!API_KEY) {
    throw new Error("CONGRESS_API_KEY is not defined in .env.local");
}

export const getBills = async () => {
    const bills = await fetch(`https://api.congress.gov/v3/bill?api_key=${API_KEY}`);

    return bills.json();
}

