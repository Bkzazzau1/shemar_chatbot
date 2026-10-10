// Frontend-only demonstration store. No API, remote database, or server is used.
// Data is kept in this browser's localStorage for academic presentation only.
export const DEMO_STORAGE_KEY = "shemar_customer_support_demo_v1";

export function initialDemoState(seedFaqs) {
  return {
    faqs: seedFaqs.map((faq) => ({ ...faq, id: faq.intent })),
    seededFaqIds: seedFaqs.map((faq) => faq.intent),
    conversations: [],
    feedback: [],
    escalations: [],
  };
}

export function loadDemoState(seedFaqs) {
  const fallback = initialDemoState(seedFaqs);
  try {
    const value = JSON.parse(window.localStorage.getItem(DEMO_STORAGE_KEY) || "null");
    if (!value || !Array.isArray(value.faqs) ||
        !Array.isArray(value.conversations) ||
        !Array.isArray(value.feedback) ||
        !Array.isArray(value.escalations)) return fallback;
    return mergeNewSeedFaqs(value, seedFaqs);
  } catch {
    return fallback;
  }
}

// Adds FAQs introduced since this browser last saved, keeping seed order so keyword ties
// resolve the same way for everyone. FAQs the administrator deleted are not brought back.
function mergeNewSeedFaqs(state, seedFaqs) {
  const seeded = new Set(state.seededFaqIds || []);
  const byId = new Map(state.faqs.map((faq) => [faq.id, faq]));
  const seedIds = new Set(seedFaqs.map((faq) => faq.intent));
  const faqs = seedFaqs
    .map((faq) => byId.get(faq.intent) || (seeded.has(faq.intent) ? null : { ...faq, id: faq.intent }))
    .filter(Boolean)
    .concat(state.faqs.filter((faq) => !seedIds.has(faq.id)));
  return { ...state, faqs, seededFaqIds: [...new Set([...seeded, ...seedIds])] };
}

export function saveDemoState(state) {
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    // Private browsing and storage restrictions can prevent persistence.
    return false;
  }
}

export function demoRecordId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
