import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import InputForm from "@/components/InputForm";
import BillsDisplay from "@/components/BillsDisplay";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <BillsDisplay />
      <div>
        <h2 className="font-bold text-2xl mb-4">Input Form</h2>
        <InputForm />
      </div>
    </div>
  );
}
