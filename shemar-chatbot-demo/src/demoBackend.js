// Frontend-only demonstration store. No API, remote database, or server is used.
// Data is kept in this browser's localStorage for academic presentation only.
export const DEMO_STORAGE_KEY = "shemar_customer_support_demo_v1";

export function initialDemoState(seedFaqs) {
  return {
    faqs: seedFaqs.map((faq) => ({ ...faq, id: faq.intent })),
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
    return value;
  } catch {
    return fallback;
  }
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
