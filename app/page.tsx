import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full">
        <Navbar isLanding />
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
