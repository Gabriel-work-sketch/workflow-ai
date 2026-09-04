import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function callAi(messages: Msg[], maxTokens = 1200): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured. Missing API key.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Too many requests right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits are exhausted. Please add credits to continue.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

const lengthHint = (l: string) =>
  l === "short" ? "Keep the response brief and to the point." : l === "detailed" ? "Provide a thorough, detailed response." : "Keep the response balanced in length.";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        purpose: z.string().min(1).max(2000),
        recipient: z.string().max(200).default(""),
        keyInfo: z.string().max(4000).default(""),
        tone: z.enum(["Formal", "Friendly", "Persuasive"]),
        length: z.enum(["short", "balanced", "detailed"]).default("balanced"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const content = await callAi([
      {
        role: "system",
        content:
          "You are a workplace communication expert. You write clear, professional business emails. Return only the email text, starting with a 'Subject:' line. No markdown fences, no commentary.",
      },
      {
        role: "user",
        content: `Generate a professional workplace email using the following information:

Purpose: ${data.purpose}
Recipient: ${data.recipient || "Not specified"}
Key information: ${data.keyInfo || "Not specified"}
Tone: ${data.tone}

Requirements:
- Professional language
- Clear structure
- Appropriate greeting
- Strong closing statement
${lengthHint(data.length)}`,
      },
    ]);
    return { content };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        notes: z.string().min(10).max(20000),
        length: z.enum(["short", "balanced", "detailed"]).default("balanced"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const content = await callAi([
      {
        role: "system",
        content:
          "You are a meeting notes analyst. You produce concise, well-structured business summaries in plain text with clear section headings and bullet points using '-'. No markdown fences.",
      },
      {
        role: "user",
        content: `Analyze the following meeting notes and provide the output using exactly these sections:

Meeting Summary
Key Points
Decisions
Action Items
Next Steps

${lengthHint(data.length)}

Meeting notes:
${data.notes}`,
      },
    ]);
    return { content };
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1).max(8000),
            }),
          )
          .min(1)
          .max(40),
        length: z.enum(["short", "balanced", "detailed"]).default("balanced"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const content = await callAi(
      [
        {
          role: "system",
          content: `You are the AI Workplace Assistant. You are professional, helpful and concise. You focus on workplace productivity: drafting emails, summarizing reports, creating meeting agendas, improving business messages and generating workplace ideas. Use clear business language. ${lengthHint(data.length)}`,
        },
        ...data.messages,
      ],
      1500,
    );
    return { content };
  });
