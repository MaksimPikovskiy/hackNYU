import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";

export async function DashboardButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild variant={"outline"}>
        <Link href="/main">Dashboard</Link>
      </Button>
    </div>
  ) : null;
}
