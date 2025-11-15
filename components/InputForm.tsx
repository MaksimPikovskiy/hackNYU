"use client";

import { promptAI } from "@/app/api/prompt";
import { useState } from "react";

export default function InputForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await promptAI(input);

      if (!res) {
        throw new Error(`API error: ${res}`);
      }

      setResponse(res.text || JSON.stringify(res, null, 2));
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="input" className="font-semibold">
          Enter prompt:
        </label>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your prompt..."
          className="border border-gray-300 px-3 py-2 rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="bg-green-100 text-green-800 p-3 rounded">
          <strong>Response:</strong>
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto whitespace-pre-wrap">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
