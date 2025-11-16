import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-4 py-16">
      <div className="flex gap-8 items-center">
        <p>
          Made for{" "}
          <a
            href="https://hacknyu.org/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            HackNYU 2025
          </a>
        </p>
        <ThemeSwitcher />
      </div>
      <p>
        &copy; {currentYear} PolicyPulse. Policy intelligence for smarter
        investing.
      </p>
    </footer>
  );
}
