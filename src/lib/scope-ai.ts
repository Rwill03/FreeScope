/**
 * Scope evaluation and estimation via Ollama (local LLM).
 * No embeddings or vector stores — natural language reasoning only.
 */

import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an expert technical project manager interpreting software contracts and scope documents.

Your task is to:
1. Compare a FEATURE REQUEST against a PROJECT SCOPE (contract/requirements).
2. Determine scope alignment: in_scope, out_of_scope, or partial.
3. If in_scope: state clearly that the feature is covered; tasks and price are optional (price 0 or included).
4. If out_of_scope or partial: explain why, list missing scope items, and provide a full estimation (task breakdown, hours, total price using the given hourly rate).

RULES:
- Base your decision ONLY on the contract/scope text and the feature description.
- Be conservative: when in doubt between in_scope and partial, choose partial.
- Round hours to 0.5.
- Currency: EUR. Use the freelancer's hourly rate for price.
- Output ONLY valid JSON, no markdown or extra text.

You MUST respond with exactly this JSON structure (no other keys, no comments):
{
  "scope_status": "in_scope" | "out_of_scope" | "partial",
  "scope_reasoning": "string explaining your decision",
  "missing_scope_items": ["item1", "item2"],
  "tasks": [
    { "name": "string", "hours": number, "skills": ["string"] }
  ],
  "total_hours": number,
  "hourly_rate": number,
  "total_price": number,
  "confidence": "low" | "medium" | "high",
  "assumptions": ["string"]
}

When scope_status is "in_scope", set total_hours and total_price to 0 and tasks can be empty or minimal.
When out_of_scope or partial, fill all fields.`;

export type ScopeAIInput = {
  projectScope: string;
  featureDescription: string;
  freelancerHourlyRate: number;
  freelancerSkills: string[];
};

export type ScopeAIResult = {
  scope_status: "in_scope" | "out_of_scope" | "partial";
  scope_reasoning: string;
  missing_scope_items: string[];
  tasks: Array< { name: string; hours: number; skills: string[] } >;
  total_hours: number;
  hourly_rate: number;
  total_price: number;
  confidence: "low" | "medium" | "high";
  assumptions: string[];
};

function buildUserMessage(input: ScopeAIInput): string {
  return `PROJECT SCOPE (contract/requirements):
---
${input.projectScope}
---

FEATURE REQUEST:
---
${input.featureDescription}
---

FREELANCER:
- Hourly rate (EUR): ${input.freelancerHourlyRate}
- Skills: ${(input.freelancerSkills || []).join(", ") || "Not specified"}

Respond with ONLY the JSON object, no other text.`;
}

export async function evaluateScopeAndEstimate(
  input: ScopeAIInput
): Promise<ScopeAIResult> {
  const baseURL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2";

  const client = new OpenAI({
    apiKey: "ollama",
    baseURL,
  });

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserMessage(input) },
    ],
    temperature: 0.2,
  });

  const raw = response.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("Empty response from LLM");

  const jsonStr = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("LLM did not return valid JSON");
  }

  const o = parsed as Record<string, unknown>;
  const scopeStatus = o.scope_status as string;
  if (!["in_scope", "out_of_scope", "partial"].includes(scopeStatus)) {
    throw new Error(`Invalid scope_status: ${scopeStatus}`);
  }

  return {
    scope_status: scopeStatus as ScopeAIResult["scope_status"],
    scope_reasoning: String(o.scope_reasoning ?? ""),
    missing_scope_items: Array.isArray(o.missing_scope_items)
      ? o.missing_scope_items.map(String)
      : [],
    tasks: Array.isArray(o.tasks)
      ? o.tasks.map((t: unknown) => {
          const x = t as Record<string, unknown>;
          return {
            name: String(x.name ?? ""),
            hours: Number(x.hours) || 0,
            skills: Array.isArray(x.skills) ? x.skills.map(String) : [],
          };
        })
      : [],
    total_hours: Number(o.total_hours) || 0,
    hourly_rate: Number(o.hourly_rate) ?? input.freelancerHourlyRate,
    total_price: Number(o.total_price) || 0,
    confidence: ["low", "medium", "high"].includes(String(o.confidence))
      ? (o.confidence as ScopeAIResult["confidence"])
      : "medium",
    assumptions: Array.isArray(o.assumptions)
      ? o.assumptions.map(String)
      : [],
  };
}
