"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AIInvoiceGeneratorProps {
  onGenerated: (data: any) => void;
}

export function AIInvoiceGenerator({ onGenerated }: AIInvoiceGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the invoice you want to create");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate invoice");
      }

      // Pass the AI-generated data to parent component
      onGenerated(result.data);
      setPrompt(""); // Clear the prompt
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-5 dark:from-purple-950/20 dark:to-blue-950/20">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
        <h3 className="font-semibold">AI Invoice Generator</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-prompt">
          Describe your invoice in plain English
        </Label>
        <Textarea
          id="ai-prompt"
          placeholder="Example: Web design for Acme Corp, 40 hours at ₹2500/hr, client email: contact@acme.com, due in 15 days"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          rows={3}
          className="resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex items-center gap-2">
        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate Invoice
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Powered by Microsoft Foundry AI
        </p>
      </div>

      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer font-medium">
          What can AI do?
        </summary>
        <ul className="mt-2 space-y-1 pl-4">
          <li>• Extract client details from descriptions</li>
          <li>• Calculate quantities and amounts automatically</li>
          <li>• Apply correct HSN/SAC codes for services</li>
          <li>• Set appropriate GST rates</li>
          <li>• Calculate due dates intelligently</li>
          <li>• Break down complex work into line items</li>
        </ul>
      </details>
    </div>
  );
}
