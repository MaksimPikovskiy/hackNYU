import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ready to make informed investment decisions?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start exploring how Congressional bills could impact your portfolio
          today.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link href="/auth/sign-up">
            Explore Policies
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
