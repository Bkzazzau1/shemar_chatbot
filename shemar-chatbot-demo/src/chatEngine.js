// Browser-only, explainable FAQ matcher. No pre-trained AI model is loaded.
// The FAQ records and replies remain editable in the demo administration.
const extraPhrases = {
  delivery_fee: ["delivery price", "delivery charges", "shipping charges", "shipping price", "how much to deliver", "cost of sending", "delivery rates", "how much is shipping"],
  delivery_time: ["when will my order arrive", "how soon", "how quickly", "delivery timeline", "how long does shipping take", "same day", "next day"],
  international_shipping: ["ship internationally", "deliver to uk", "ship to ghana", "ship to usa"],
  tracking: ["where is my order", "order status", "parcel status", "has my order been sent", "where is my package"],
  payment_confirmation: ["payment successful", "payment confirmation", "payment receipt", "transfer receipt", "i have paid", "i paid", "payment not reflecting", "confirm my payment", "confirm payment", "payment received"],
  pay_on_delivery: ["cash on delivery", "pay on delivery", "payment on delivery", "pay when it arrives"],
  delivery_address: ["change my delivery address", "change delivery address", "update delivery address", "address for delivery"],
  size_exchange: ["exchange for another size", "exchange my size", "can i exchange the size", "swap to another size"],
  return_policy: ["item does not fit", "doesnt fit", "return an item", "return my item", "exchange an item", "return policy"],
  wrong_item: ["wrong item", "incorrect item", "wrong colour sent", "wrong size sent", "sent the wrong"],
  damaged_item: ["arrived damaged", "damaged package", "item is damaged", "torn dress", "broken item", "defective product"],
  stock_availability: ["do you have", "is it in stock", "is it available", "still in stock", "available in medium", "in stock"],
  size_guide: ["which size", "what size", "size chart", "will this fit", "measurement chart", "size guide"],
  price: ["how much is the", "how much does the", "price of", "cost of the", "what does it cost", "price for"],
  order: ["how to order", "place an order", "buy online", "how do i buy", "checkout"],
  checkout_support: ["checkout not working", "cannot checkout", "cant checkout", "cart error"],
  gift_delivery: ["send as a gift", "send to someone", "gift for someone", "deliver a gift"],
  returns_eligibility: ["can i return after", "how many days to return", "refund timeline", "return window"],
  service_information: ["what can you do", "how can you help", "what do you help with"],
  support: ["speak to a person", "real person", "human agent", "talk to someone", "speak to customer service"],
  thanks: ["many thanks", "thank you very much", "cheers"],
};

const followUps = {
  greeting: ["What products do you sell?", "Do you deliver to Kano?", "How do I order?"],
  products: ["How much is the handbag?", "Do you have a size guide?", "What is new?"],
  delivery: ["How much is delivery?", "How long will delivery take?", "Do you ship outside Nigeria?"],
  delivery_fee: ["How long will delivery take?", "How do I place an order?", "Can I pay on delivery?"],
  delivery_time: ["How much is delivery?", "How do I track my order?", "Can I change my address?"],
  international_shipping: ["Do you deliver to Lagos?", "How do I contact support?"],
  order: ["How can I pay?", "How do I track my order?", "Can I cancel my order?"],
  tracking: ["How long will delivery take?", "Can I speak to a person?"],
  payment: ["How do I confirm payment?", "Can I pay on delivery?"],
  payment_confirmation: ["How do I track my order?", "How do I contact support?"],
  pay_on_delivery: ["How can I pay?", "How much is delivery?"],
  return_policy: ["What if my item arrives damaged?", "Can I exchange for another size?"],
  damaged_item: ["How do I request an exchange?", "How do I contact support?"],
  wrong_item: ["Can I exchange the wrong item?", "How do I contact support?"],
  size_guide: ["Is the dress available in medium?", "Can I exchange for another size?"],
  stock_availability: ["What colours are available?", "How much does the handbag cost?"],
  price: ["Do you have discounts?", "How much is delivery?"],
  discount: ["Do you have new arrivals?", "How do I place an order?"],
  complaint: ["Can I speak to a person?", "How do I request a follow-up?"],
  account_access: ["Can I speak to a person?", "How do I protect my account?"],
  gift: ["Do you offer gift wrapping?", "Can you deliver to someone else?"],
  thanks: ["What products do you sell?", "How do I order?"],
  unknown: ["Do you deliver to Kaduna?", "How do I track my order?", "What is your return policy?"],
};

const contextualIntents = new Set([
  "delivery", "delivery_fee", "delivery_time", "products", "price",
  "size_guide", "stock_availability", "tracking", "return_policy", "payment"
]);

export function normaliseMessage(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function containsPhrase(text, phrase) {
  const query = normaliseMessage(phrase);
  return !!query && (" " + text + " ").includes(" " + query + " ");
}
function scoreFaq(text, faq) {
  const keywords = Array.isArray(faq.keywords) ? faq.keywords : [];
  const phrases = [...keywords, ...(extraPhrases[faq.intent] || [])];
  let strongest = 0;
  let matches = 0;
  for (const phrase of phrases) {
    if (!containsPhrase(text, phrase)) continue;
    const words = normaliseMessage(phrase).split(" ").length;
    strongest = Math.max(strongest, words > 1 ? 8 + words * 5 : 2);
    matches++;
  }
  const specificIntents = new Set(["pay_on_delivery", "payment_confirmation", "wrong_item", "damaged_item", "size_exchange", "delivery_address", "checkout_support", "store_pickup", "returns_eligibility", "gift_delivery"]);
  return strongest ? strongest + Math.min(matches, 5) + (specificIntents.has(faq.intent) ? 8 : 0) : 0;
}
function contextualFollowup(text) {
  return /^(what about|how about|and |what if|is it|do you also|does it|same for|for |okay and|ok and|can you)/.test(text)
    || /^(kano|kaduna|abuja|lagos|zaria|enugu|ibadan|jos|port harcourt)$/.test(text);
}
function cataloguePrice(text, catalogue) {
  const aliases = [
    [/\bhandbag|hand bag\b/, "Elegant Ladies Handbag"],
    [/\bheels?|shoes?\b/, "Luxury Women Heels"],
    [/\bscarf\b/, "Gold Pattern Silk Scarf"],
    [/\bblack dress|evening dress\b/, "Luxury Black Evening Dress"],
    [/\bblazer|corporate\b/, "Corporate Women Blazer"],
    [/\bkaftan\b/, "Royal Ladies Kaftan"],
    [/\babaya\b/, "Classy Women Abaya Set"],
    [/\bankara|gown\b/, "Premium Ankara Gown"],
  ];
  for (const [pattern, name] of aliases) {
    if (!pattern.test(text)) continue;
    const product = catalogue.find((item) => item.name === name);
    if (product) return product.name + " is listed at " + product.price + " in our demo catalogue. Availability and checkout are not connected to a live shop. Would you like details on sizes or delivery?";
  }
  return null;
}
const cities = ["Kaduna", "Kano", "Abuja", "Lagos", "Zaria", "Ibadan", "Jos", "Enugu", "Port Harcourt"];
function cityIn(text) {
  return cities.find((city) => containsPhrase(text, city)) || null;
}
function answerFor(intent, fallback, text, catalogue) {
  const city = cityIn(text);
  if (intent === "delivery_fee") return city
    ? "For " + city + ", the charge depends on the item and delivery address. This demo does not calculate live shipping fees, so the shop would need to confirm the exact amount."
    : "Delivery charges depend on destination and parcel. This demo cannot calculate a live shipping fee. Which city would you like to deliver to?";
  if (intent === "delivery_time") return city
    ? "Delivery to " + city + " depends on dispatch and courier arrangements. This demo has no live delivery estimates, so please confirm the timeframe before placing a real order."
    : "Delivery time depends on your city and the courier. Tell me your destination; actual arrival times must be confirmed with the shop.";
  if (intent === "delivery" && city) return "The demo covers delivery enquiries about " + city + " and other Nigerian cities. Exact shipping fees and delivery dates require confirmation. Would you like to ask about delivery cost or timing?";
  if (intent === "price") return cataloguePrice(text, catalogue) || fallback;
  if (intent === "stock_availability") return "The catalogue contains sample products, not live stock. Tell me the item and size you want. Actual availability must be confirmed with the shop.";
  if (intent === "tracking") return "I can explain tracking, but this demo cannot look up real orders. For a real update, contact the shop or courier using your order reference. Please don't share private payment details here.";
  if (intent === "support") return "Use 'Request human support' below to create a demo follow-up record. No real support officer is notified. For a genuine enquiry, use the shop's verified contact details.";
  if (intent === "payment_confirmation") return "For a real payment, check your bank notification and contact the shop through its verified channel. This demo cannot verify transfers or card payments. Never share passwords or card numbers here.";
  return fallback;
}

export function answerCustomer(message, faqs, context = {}, catalogue = []) {
  const text = normaliseMessage(message);
  if (!text) return null;
  const choices = Array.isArray(faqs) ? faqs : [];
  const scored = choices
    .map((faq) => ({ faq, score: scoreFaq(text, faq) }))
    .sort((a, b) => b.score - a.score);
  let matching = scored.find((item) => item.score > 0)?.faq || null;
  const topScore = scored[0]?.score || 0;
  if (contextualFollowup(text) && contextualIntents.has(context.lastIntent)) {
    if (topScore < 16 || (topScore <= 5 && matching?.intent !== context.lastIntent)) {
      matching = choices.find((faq) => faq.intent === context.lastIntent) || matching;
    }
  }
  if (!matching) return {
    intent: "unknown",
    answer: "I'm not sure I understood. I can help with product details, delivery, order questions, payments, sizes or returns. Please choose a question below or rephrase.",
    suggestions: followUps.unknown,
  };
  return {
    intent: matching.intent,
    answer: answerFor(matching.intent, matching.answer, text, catalogue),
    suggestions: followUps[matching.intent] || ["How do I place an order?", "How much is delivery?"],
  };
}
