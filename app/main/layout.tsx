import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full items-center">
        <Navbar />
        <div className="mx-auto max-w-7xl p-5 py-20 md:py-28">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  );
}