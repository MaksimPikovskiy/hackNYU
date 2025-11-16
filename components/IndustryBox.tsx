"use client";

import { useState } from "react";

type IndustryBoxProps = {
  title?: string;
  industries: string[];
};

export default function IndustryBox({ title = "Industries", industries }: IndustryBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="w-full max-w-md border rounded-xl p-4 cursor-pointer select-none transition hover:bg-gray-50"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">{title}</p>
        <span className="text-gray-600">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="mt-3 text-sm text-gray-700">
          <ul className="list-disc list-inside space-y-1">
            {industries.map((industry, idx) => (
              <li key={idx}>{industry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
