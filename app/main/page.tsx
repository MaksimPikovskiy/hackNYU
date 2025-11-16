import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import InputForm from "@/components/input-form";
import PolicyDisplay from "@/components/policies-display";
import IndustryDisplay from "@/components/industries-display";
import CompanyDisplay from "@/components/companies-display";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <PolicyDisplay />
      <IndustryDisplay />
      <CompanyDisplay />
      <div>
        <h2 className="font-bold text-2xl mb-4">Input Form</h2>
        <InputForm />
      </div>
    </div>
  );
}
