import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar isLanding />
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">
              Fastest way to find companies to invest in companies
            </h2>
          </main>
        </div>
        <Footer />
      </div>
    </main>
  );
}
