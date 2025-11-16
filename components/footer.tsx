import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
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
    </footer>
  );
}
