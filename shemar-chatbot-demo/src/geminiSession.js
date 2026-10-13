// Temporary, presentation-only bridge to Google's pre-trained Gemini model.
// The API key is never embedded, persisted, or placed in a URL.
export async function answerWithGemini(key, question, history, faqs, products) {
  const approved = faqs.map(({ intent, answer }) => `${intent}: ${answer}`).join("\n");
  const catalogue = products.map(({ name, price, category }) =>
    `${name} — ${price} (${category})`
  ).join("\n");
  const instructions = [
    "You are Shemar Concierge, a friendly customer service assistant for Shemar Collection, a women's fashion shop.",
    "Answer naturally and briefly in English, usually 1 to 3 sentences.",
    "Use the approved information and catalogue below, and never invent prices, stock availability, shipping prices, refund decisions, transaction status, addresses, or delivery guarantees.",
    "Ask a concise follow-up when the customer's request is unclear.",
    "No real order lookup, payment processing, or live staff handover is available. Refer customers to verified shop contact channels for those matters.",
    "Never request passwords, card details or other sensitive information.",
    "Don't mention API implementation or the language model unless asked about it.",
    "CATALOGUE:\n" + catalogue,
    "APPROVED ANSWERS:\n" + approved,
  ].join("\n\n");

  const context = history
    .filter((item) => item.sender === "user" || (item.sender === "bot" && item.recordId))
    .slice(-8)
    .map(({ sender, text }) => ({
      role: sender === "user" ? "user" : "model",
      parts: [{ text }],
    }));
  context.push({ role: "user", parts: [{ text: question }] });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 22000);
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instructions }] },
          contents: context,
          generationConfig: { temperature: 0.35, maxOutputTokens: 400 },
        }),
        signal: controller.signal,
      }
    );
    if (!response.ok) {
      throw new Error(`Gemini returned HTTP ${response.status}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "").join("\n").trim();
    if (!text) throw new Error("Gemini returned no reply");
    return text;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
