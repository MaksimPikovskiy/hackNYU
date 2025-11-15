"use client";

import React, { useState } from "react";

type Props = {
  initialValue?: string;
};

export default function InputForm({ initialValue }: Props) {
  const [value, setValue] = useState(initialValue ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      const text = await res.text();
      setResult(text);
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 items-start"
      >
        <input
          id="prompt"
          name="prompt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your prompt..."
          className="flex-1 border rounded px-3 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {error && <div className="text-sm text-red-700">{error}</div>}

      {result && (
        <pre className="text-xs font-mono p-3 rounded border max-h-48 overflow-auto whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
