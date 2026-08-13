"use client";

import { useState } from "react";
import { AIInvoiceGenerator } from "./ai-invoice-generator";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratedData {
  client: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
  dueDate: string;
  notes: string;
  terms: string;
  taxMode: string;
}

export function AIInvoiceGeneratorWrapper() {
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (generatedData) {
      navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStringValue = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
  };

  const getNumberValue = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  const hasProperty = (obj: unknown, prop: string): boolean => {
    return typeof obj === 'object' && obj !== null && prop in obj;
  };

  const getProperty = (obj: unknown, prop: string): unknown => {
    if (hasProperty(obj, prop)) {
      return (obj as Record<string, unknown>)[prop];
    }
    return undefined;
  };

  return (
    <div className="space-y-4">
      <AIInvoiceGenerator onGenerated={setGeneratedData} />

      {generatedData && (
        <div className="app-panel space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">✨ Generated Invoice Data</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Client Info */}
            {generatedData.client && typeof generatedData.client === 'object' && (
              <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  CLIENT DETAILS
                </p>
                {hasProperty(generatedData.client, 'name') && Boolean(getProperty(generatedData.client, 'name')) && (
                  <p>
                    <span className="text-sm font-medium">Name:</span>{" "}
                    {getStringValue(getProperty(generatedData.client, 'name'))}
                  </p>
                )}
                {hasProperty(generatedData.client, 'email') && Boolean(getProperty(generatedData.client, 'email')) && (
                  <p className="text-sm text-muted-foreground">
                    {getStringValue(getProperty(generatedData.client, 'email'))}
                  </p>
                )}
                {hasProperty(generatedData.client, 'phone') && Boolean(getProperty(generatedData.client, 'phone')) && (
                  <p className="text-sm text-muted-foreground">
                    {getStringValue(getProperty(generatedData.client, 'phone'))}
                  </p>
                )}
                {hasProperty(generatedData.client, 'gstin') && Boolean(getProperty(generatedData.client, 'gstin')) && (
                  <p className="text-xs">
                    GSTIN: {getStringValue(getProperty(generatedData.client, 'gstin'))}
                  </p>
                )}
              </div>
            )}

            {/* Invoice Meta */}
            <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                INVOICE DETAILS
              </p>
              {generatedData.dueDate && (
                <p className="text-sm">
                  <span className="font-medium">Due Date:</span>{" "}
                  {new Date(generatedData.dueDate).toLocaleDateString()}
                </p>
              )}
              {generatedData.taxMode && (
                <p className="text-sm">
                  <span className="font-medium">Tax Mode:</span>{" "}
                  {generatedData.taxMode}
                </p>
              )}
            </div>
          </div>

          {/* Line Items */}
          {generatedData.items && Array.isArray(generatedData.items) && generatedData.items.length > 0 && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                LINE ITEMS
              </p>
              <div className="space-y-3">
                {generatedData.items.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-primary/30 pl-3">
                    <p className="font-medium">
                      {getStringValue(getProperty(item, 'description'))}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>Qty: {getStringValue(getProperty(item, 'quantity'))}</span>
                      <span>Rate: ₹{getStringValue(getProperty(item, 'rate'))}</span>
                      <span>HSN/SAC: {getStringValue(getProperty(item, 'hsnSac'))}</span>
                      <span>GST: {getStringValue(getProperty(item, 'taxRate'))}%</span>
                      {getNumberValue(getProperty(item, 'discount')) > 0 && (
                        <span>Discount: {getStringValue(getProperty(item, 'discount'))}%</span>
                      )}
                    </div>
                    <p className="mt-1 font-semibold">
                      Amount: ₹{getNumberValue(getProperty(item, 'amount')).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Terms */}
          {(generatedData.notes || generatedData.terms) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {generatedData.notes && (
                <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    NOTES
                  </p>
                  <p className="text-sm">{generatedData.notes}</p>
                </div>
              )}
              {generatedData.terms && (
                <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    TERMS
                  </p>
                  <p className="text-sm">{generatedData.terms}</p>
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
            💡 <strong>Next step:</strong> Use the form below to create a client
            (if needed), then manually fill in the invoice form with the details
            above. Full form auto-fill coming soon!
          </div>
        </div>
      )}
    </div>
  );
}
