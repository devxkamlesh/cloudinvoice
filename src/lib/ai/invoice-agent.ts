/**
 * Microsoft Foundry AI Agent Integration
 * Uses gpt-5.6-terra for intelligent invoice generation
 */

export interface AIInvoiceData {
  task: string;
  data: {
    clientName: string | null;
    clientEmail: string | null;
    clientPhone: string | null;
    clientGSTIN: string | null;
    clientAddress: string | null;
    clientStateCode: string | null;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      hsnSac: string;
      taxRate: number;
      discount: number;
    }>;
    notes: string | null;
    terms: string | null;
    dueDate: string;
    taxMode: "INTRA_STATE" | "INTER_STATE";
  };
}

export interface FoundryConfig {
  endpoint: string;
  apiKey: string;
}

/**
 * Get Foundry configuration from environment
 */
export function getFoundryConfig(): FoundryConfig {
  const endpoint = process.env.FOUNDRY_ENDPOINT;
  const apiKey = process.env.FOUNDRY_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error(
      "Microsoft Foundry credentials not configured. Please set FOUNDRY_ENDPOINT and FOUNDRY_API_KEY in your .env file."
    );
  }

  return { endpoint, apiKey };
}

/**
 * Call Microsoft Foundry AI agent with user prompt
 */
export async function generateInvoiceWithAI(
  prompt: string
): Promise<AIInvoiceData> {
  const { endpoint, apiKey } = getFoundryConfig();

  // Azure AI Agent endpoint format
  const agentEndpoint = `${endpoint}/agents/CloudinvoiceAgent/chat/completions`;

  const response = await fetch(agentEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey, // Azure uses "api-key" header
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Foundry API error (${response.status}): ${errorText}`
    );
  }

  const result = await response.json();

  // Extract the AI response (Azure AI format)
  const aiMessage = result.choices?.[0]?.message?.content || result.content;
  if (!aiMessage) {
    throw new Error("No response from AI agent");
  }

  // Parse JSON response
  let aiData: AIInvoiceData;
  try {
    aiData = JSON.parse(aiMessage);
  } catch {
    throw new Error(`Failed to parse AI response: ${aiMessage}`);
  }

  // Validate task type
  if (aiData.task !== "generate_invoice") {
    throw new Error(
      `Unexpected task type: ${aiData.task}. Expected "generate_invoice"`
    );
  }

  return aiData;
}

/**
 * Convert AI invoice data to form-compatible format
 */
export function aiInvoiceToFormData(aiData: AIInvoiceData) {
  const { data } = aiData;

  return {
    // Client details
    client: {
      name: data.clientName || "",
      email: data.clientEmail || "",
      phone: data.clientPhone || "",
      gstin: data.clientGSTIN || "",
      address: data.clientAddress || "",
      stateCode: data.clientStateCode || "",
    },

    // Invoice items
    items: data.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.unitPrice,
      hsnSac: item.hsnSac,
      taxRate: item.taxRate,
      discount: item.discount || 0,
      // Calculate amount
      amount:
        item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100),
    })),

    // Invoice metadata
    dueDate: data.dueDate,
    notes: data.notes || "",
    terms: data.terms || "",
    taxMode: data.taxMode,
  };
}
