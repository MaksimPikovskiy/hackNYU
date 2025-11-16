import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { EnvVarWarning } from "./env-var-warning";
import { AuthButton } from "./auth-button";
import { DashboardButton } from "./dashboard-button";

type Props = {
  isLanding?: boolean;
};

export default function Navbar({ isLanding }: Props) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"} className="text-xl">
            HackNYU
          </Link>
        </div>
        <div className="flex flex-row gap-4">
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          {isLanding && <DashboardButton />}
        </div>
      </div>
    </nav>
  );
}
