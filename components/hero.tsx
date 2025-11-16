import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          See How Congressional Bills Move Markets
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          Analyze bills from Congress and discover which companies are
          positioned to gain or lose most. Track policy impact with precision
          investment rankings.
        </p>
        <Button asChild size="lg">
          <Link href="/auth/sign-up">
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
