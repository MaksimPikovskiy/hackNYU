import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { EnvVarWarning } from "./env-var-warning";
import { AuthButton } from "./auth-button";
import { DashboardButton } from "./dashboard-button";
import Image from "next/image";

type Props = {
  isLanding?: boolean;
};

export default function Navbar({ isLanding }: Props) {
  return (
    <nav className="fixed z-50 w-full flex justify-center border-b border-b-foreground/10 bg-background h-16">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
        <div>
          <Link
            href={"/"}
            className="flex gap-2 items-center font-semibold text-xl"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width="842"
              height="842"
              className="w-12 h-12"
            />
            PolicyPulse
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
