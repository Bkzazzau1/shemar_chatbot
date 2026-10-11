import test from "node:test";
import assert from "node:assert/strict";
import { answerCustomer, normaliseMessage } from "./chatEngine.js";

const faqs = [
  { intent: "greeting", keywords: ["hello", "hi", "hey"], answer: "Hello and welcome." },
  { intent: "delivery_fee", keywords: ["delivery fee", "how much is delivery", "how much", "fee"], answer: "Delivery charges vary." },
  { intent: "delivery_time", keywords: ["how long", "how many days", "delivery time"], answer: "Delivery times vary." },
  { intent: "delivery", keywords: ["delivery", "deliver", "shipping", "kano", "abuja"], answer: "Delivery is available for selected areas." },
  { intent: "payment", keywords: ["payment", "pay", "bank", "card", "pay on delivery"], answer: "Ask the shop about payment." },
  { intent: "pay_on_delivery", keywords: ["pay on delivery", "cash on delivery"], answer: "Payment on delivery must be confirmed." },
  { intent: "payment_confirmation", keywords: ["i paid", "payment receipt"], answer: "Check payment with the shop." },
  { intent: "return_policy", keywords: ["return", "exchange", "refund"], answer: "Please confirm the return policy." },
  { intent: "size_guide", keywords: ["size", "sizes", "measurement"], answer: "Please ask about size measurements." },
  { intent: "size_exchange", keywords: ["exchange for another size", "exchange my size"], answer: "Please request a size exchange." },
  { intent: "wrong_item", keywords: ["wrong item", "incorrect item"], answer: "Contact support about the wrong item." },
  { intent: "damaged_item", keywords: ["arrived damaged", "damaged package"], answer: "Contact support about a damaged item." },
  { intent: "order", keywords: ["order", "buy", "checkout"], answer: "This is a demo shopping site." },
  { intent: "tracking", keywords: ["track", "tracking", "my order", "where"], answer: "Order status is not connected." },
  { intent: "price", keywords: ["price", "prices", "cost", "how much does"], answer: "See the prices in the catalogue." },
  { intent: "products", keywords: ["products", "sell", "dress", "bag", "handbag"], answer: "We show fashion products." },
  { intent: "stock_availability", keywords: ["stock", "in stock", "available"], answer: "Live stock is not connected." },
  { intent: "gift", keywords: ["gift", "gift wrapping"], answer: "Ask the shop about gifting." },
  { intent: "support", keywords: ["support", "help", "agent"], answer: "Request support." },
  { intent: "privacy", keywords: ["demo store", "privacy"], answer: "Only browser-local demo storage." },
  { intent: "delivery_address", keywords: ["change my delivery address"], answer: "Ask about changing address." },
  { intent: "thanks", keywords: ["thank", "thanks", "bye"], answer: "You're welcome!" },
  { intent: "late_delivery", keywords: ["order is late", "delivery is delayed", "delayed", "havent received my order"], answer: "Ask the shop to check with the courier." },
  { intent: "missing_item", keywords: ["missing item", "missing from my order"], answer: "Report the missing item." },
  { intent: "order_confirmation", keywords: ["did my order go through", "order confirmation"], answer: "The shop confirms real orders." },
  { intent: "refund_status", keywords: ["my refund", "where is my refund"], answer: "The shop must confirm refunds." },
  { intent: "installment", keywords: ["instalments", "installments", "pay in instalments"], answer: "Ask about part payment." },
  { intent: "price_negotiation", keywords: ["last price", "is the price negotiable"], answer: "Catalogue prices are fixed." },
  { intent: "plus_size", keywords: ["plus size", "xl"], answer: "Send your measurements." },
  { intent: "modest_wear", keywords: ["modest wear", "sell hijab", "hijab"], answer: "See our abayas and kaftans." },
  { intent: "styling_advice", keywords: ["what goes with", "recommend"], answer: "Pair the dress with gold jewelry." },
  { intent: "jewelry", keywords: ["jewelry", "sell earrings", "earrings"], answer: "Fashion jewelry is available." },
  { intent: "holiday_hours", keywords: ["sunday", "public holiday", "sallah"], answer: "Support is closed on Sundays." },
];

const cases = [
  ["Hi!", "greeting"],
  ["Do you deliver to Kano?", "delivery"],
  ["How much is delivery to Abuja?", "delivery_fee"],
  ["How long does delivery take?", "delivery_time"],
  ["Can I pay on delivery?", "pay_on_delivery"],
  ["How do I confirm my payment?", "payment_confirmation"],
  ["Can I exchange for another size?", "size_exchange"],
  ["My dress arrived damaged", "damaged_item"],
  ["I received the wrong item", "wrong_item"],
  ["How much does the handbag cost?", "price"],
  ["Where is my order?", "tracking"],
  ["Can I change my delivery address?", "delivery_address"],
  ["What information does this demo store?", "privacy"],
  ["Can I speak to a person?", "support"],
  ["Do you have a size guide?", "size_guide"],
  ["I need something different from this", "unknown"],
  ["Thanks so much!", "thanks"],
  ["My order is late", "late_delivery"],
  ["My delivery is delayed", "late_delivery"],
  ["I haven't received my order", "late_delivery"],
  ["One item is missing from my order", "missing_item"],
  ["Did my order go through?", "order_confirmation"],
  ["Where is my refund?", "refund_status"],
  ["Can I pay in instalments?", "installment"],
  ["What is your last price?", "price_negotiation"],
  ["Is the price negotiable?", "price_negotiation"],
  ["Do you have plus size dresses?", "plus_size"],
  ["Do you sell hijab?", "modest_wear"],
  ["What goes with the black dress?", "styling_advice"],
  ["Do you sell earrings?", "jewelry"],
  ["Are you open on Sunday?", "holiday_hours"],
];

for (const [question, expected] of cases) {
  test("matches " + JSON.stringify(question) + " as " + expected, () => {
    assert.equal(answerCustomer(question, faqs).intent, expected);
  });
}

test("delivery follow-up keeps previous topic and uses the requested city", () => {
  const answer = answerCustomer("What about Abuja?", faqs, { lastIntent: "delivery" });
  assert.equal(answer.intent, "delivery");
  assert.match(answer.answer, /Abuja/);
});

test("catalogue price is specific and based on supplied sample products", () => {
  const answer = answerCustomer("How much does the handbag cost?", faqs, {}, [
    { name: "Elegant Ladies Handbag", price: "₦45,000" },
  ]);
  assert.match(answer.answer, /₦45,000/);
  assert.match(answer.answer, /demo catalogue/);
});

test("jewelry price comes from the supplied catalogue", () => {
  const answer = answerCustomer("How much is the jewelry set?", faqs, {}, [
    { name: "Gold Fashion Jewelry Set", price: "₦25,000" },
  ]);
  assert.equal(answer.intent, "price");
  assert.match(answer.answer, /₦25,000/);
});

test("updated demo FAQ answer overrides the seed answer", () => {
  const changed = faqs.map((item) =>
    item.intent === "thanks" ? { ...item, answer: "Glad I could help!" } : item
  );
  assert.equal(answerCustomer("Thank you", changed).answer, "Glad I could help!");
});

test("deleting a FAQ makes the matcher stop returning that category", () => {
  const reduced = faqs.filter((item) => item.intent !== "size_exchange");
  assert.notEqual(answerCustomer("Can I exchange for another size?", reduced).intent, "size_exchange");
});

test("matching is word-boundary aware; hi is not found inside shipping", () => {
  assert.notEqual(answerCustomer("shipping", faqs).intent, "greeting");
});

test("normalisation handles punctuation and smart apostrophes", () => {
  assert.equal(normaliseMessage("  What’s   the   PRICE?! "), "whats the price");
});

test("unknown enquiry offers guided follow-ups", () => {
  const result = answerCustomer("abcdefgh xyzqqq", faqs);
  assert.equal(result.intent, "unknown");
  assert.equal(result.suggestions.length, 3);
});
