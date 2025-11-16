import { BarChart3, Search, TrendingUp } from "lucide-react";

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
      <h2 className="text-3xl font-bold text-foreground mb-12 text-balance">
        What We Offer
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Search Bills
          </h3>
          <p className="text-muted-foreground">
            Easily search through Congressional bills to find policies that
            could impact your investment portfolio.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Smart Analysis
          </h3>
          <p className="text-muted-foreground">
            Advanced AI analyzes bill content to determine potential market
            impacts and company valuations.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Investment Rankings
          </h3>
          <p className="text-muted-foreground">
            See which companies are most impacted with percentage-based
            investment impact rankings.
          </p>
        </div>
      </div>
    </section>
  );
}
