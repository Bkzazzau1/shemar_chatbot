import { motion } from "framer-motion";
import {
    Bot,
    BrainCircuit,
    ChevronDown,
    Crown,
    Gem,
    LayoutDashboard,
    Menu,
    MessageCircle,
    RotateCcw,
    Search,
    Send,
    ShieldCheck,
    ShoppingCart,
    ShoppingBag,
    Sparkles,
    Star,
    Truck,
    Trash2,
    UserRound,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import dressImage from "./assets/product-dress.png";
import handbagImage from "./assets/product-handbag.png";
import heelsImage from "./assets/product-heels.png";
import { initialDemoState, loadDemoState, saveDemoState, demoRecordId } from "./demoBackend.js";

function Button({ children, className = "", size, variant, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl font-medium transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

const products = [
  {
    id: 1,
    name: "Luxury Black Evening Dress",
    category: "Fashion Dress",
    price: "₦58,000",
    rating: 4.9,
    image: dressImage,
  },
  {
    id: 2,
    name: "Gold Pattern Silk Scarf",
    category: "Scarf",
    price: "₦18,500",
    rating: 4.8,
    image: dressImage,
  },
  {
    id: 3,
    name: "Elegant Ladies Handbag",
    category: "Bags",
    price: "₦45,000",
    rating: 4.9,
    image: handbagImage,
  },
  {
    id: 4,
    name: "Premium Ankara Gown",
    category: "Gowns",
    price: "₦38,000",
    rating: 4.7,
    image: dressImage,
  },
  {
    id: 5,
    name: "Classy Women Abaya Set",
    category: "Abaya",
    price: "₦52,000",
    rating: 4.9,
    image: dressImage,
  },
  {
    id: 6,
    name: "Royal Ladies Kaftan",
    category: "Kaftan",
    price: "₦48,500",
    rating: 4.8,
    image: dressImage,
  },
  {
    id: 7,
    name: "Corporate Women Blazer",
    category: "Corporate Wear",
    price: "₦42,000",
    rating: 4.6,
    image: dressImage,
  },
  {
    id: 8,
    name: "Luxury Women Heels",
    category: "Shoes",
    price: "₦39,000",
    rating: 4.7,
    image: heelsImage,
  },
  {
    id: 9,
    name: "Gold Fashion Jewelry Set",
    category: "Accessories",
    price: "₦25,000",
    rating: 4.8,
    image: handbagImage,
  },
];

const knowledgeBase = [
  {
    intent: "greeting",
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    answer:
      "Hello! Welcome to Shemar Collection. I can help you with products, delivery, payment, returns, order tracking and customer support.",
  },
  {
    intent: "delivery",
    keywords: [
      "delivery",
      "deliver",
      "location",
      "kaduna",
      "abuja",
      "lagos",
      "shipping",
      "nationwide",
      "send",
      "waybill",
    ],
    answer:
      "Shemar Collection offers delivery to major locations in Nigeria including Kaduna, Abuja, Lagos, Kano and other cities. Delivery time depends on the customer’s location and selected delivery option.",
  },
  {
    intent: "payment",
    keywords: ["payment", "pay", "card", "transfer", "bank", "cash", "pos"],
    answer:
      "We accept bank transfer, card payment and payment on delivery where available. Customers receive payment confirmation before their order is processed.",
  },
  {
    intent: "return_policy",
    keywords: ["return", "refund", "exchange", "wrong", "damaged", "replace"],
    answer:
      "Products can be returned or exchanged if they are damaged, wrong, or different from what was ordered. The customer should contact support within 24 hours of delivery.",
  },
  {
    intent: "order",
    keywords: ["order", "buy", "place", "purchase", "cart", "checkout"],
    answer:
      "To place an order, select your preferred fashion item, add it to cart, proceed to checkout, enter your delivery details and choose your payment method.",
  },
  {
    intent: "tracking",
    keywords: ["track", "tracking", "where", "status", "my order", "dispatch"],
    answer:
      "Customers can track their orders by contacting support with their order number. The system can also provide order status updates when tracking is enabled.",
  },
  {
    intent: "size_guide",
    keywords: ["size", "sizes", "measurement", "measurements", "fit"],
    answer:
      "Our women’s clothing is available in different sizes. Please check the size guide for each item or send your bust, waist and hip measurements to customer support for assistance.",
  },
  {
    intent: "stock_availability",
    keywords: ["stock", "in stock", "out of stock", "still available"],
    answer:
      "Product availability is updated regularly. Please tell me the name of the item you want, and customer support can confirm its current colour and size availability.",
  },
  {
    intent: "discount",
    keywords: ["discount", "sale", "promo", "promotion", "coupon", "cheaper"],
    answer:
      "Shemar Collection offers discounts during selected promotions and seasonal sales. Follow our updates or contact customer support to learn about current offers.",
  },
  {
    intent: "store_location",
    keywords: ["shop location", "store location", "address", "visit", "physical shop"],
    answer:
      "You can contact Shemar Collection customer support for our current store address and directions before visiting the physical shop.",
  },
  {
    intent: "business_hours",
    keywords: ["opening", "closing", "business hours", "working hours", "open today", "what time"],
    answer:
      "Our customer support service is available Monday to Saturday from 9:00 AM to 6:00 PM. Messages received outside these hours will be answered on the next working day.",
  },
  {
    intent: "products",
    keywords: [
      "product",
      "sell",
      "scarf",
      "bag",
      "bags",
      "dress",
      "gown",
      "abaya",
      "kaftan",
      "heels",
      "shoe",
      "jewelry",
      "accessories",
      "women",
      "ladies",
      "fashion",
      "clothes",
      "available",
    ],
    answer:
      "Shemar Collection specializes in women’s fashion items such as luxury dresses, gowns, scarves, handbags, abayas, kaftans, corporate wear, heels and fashion accessories.",
  },
  {
    intent: "support",
    keywords: [
      "support",
      "contact",
      "help",
      "agent",
      "customer care",
      "phone",
      "whatsapp",
    ],
    answer:
      "You can contact Shemar Collection support through WhatsApp, phone call, or the customer support form on the website. A human support officer can assist when the chatbot cannot resolve the issue.",
  },
  { intent: "account_access", keywords: ["log in", "login", "password", "sign in", "my account"], answer: "Please contact customer support for assistance with your account or password." },
  { intent: "complaint", keywords: ["complaint", "not been attended", "not resolved", "dissatisfied"], answer: "We are sorry your concern remains unresolved. Please request human support for follow-up." },
  { intent: "service_information", keywords: ["what services", "services do you offer"], answer: "We assist customers with fashion products, ordering, delivery, payment, returns and account enquiries." },
];

function detectIntent(message, faqs) {
  // Rule/keyword matching for this browser-only demonstration, not a pretrained NLP model.
  const text = " " + message.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
  let best = null;
  let bestScore = 0;
  for (const faq of faqs) {
    const score = faq.keywords.reduce((sum, word) =>
      sum + (text.includes(" " + word.toLowerCase().trim() + " ") ? 1 : 0), 0);
    if (score > bestScore) { best = faq; bestScore = score; }
  }
  return best || { intent: "unknown", answer: "I could not match that enquiry. Please rephrase it or request human support." };
}

function Header({ cartCount }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#D4AF37]/20 bg-black/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
            <Crown size={23} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Shemar Collection
            </h1>
            <p className="text-xs text-[#D4AF37]">
              Women Fashion • Luxury Style • Support
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-300 md:flex">
          <a href="#home" className="hover:text-[#D4AF37]">
            Home
          </a>
          <a href="#products" className="hover:text-[#D4AF37]">
            Products
          </a>
          <a href="#support" className="hover:text-[#D4AF37]">
            Support
          </a>
          <a href="#admin" className="hover:text-[#D4AF37]">
            Admin Demo
          </a>
        </nav>

        <Button
          onClick={() => document.querySelector("#products")?.scrollIntoView()}
          className="hidden items-center gap-2 rounded-2xl bg-[#D4AF37] px-5 text-black hover:bg-[#f0cc5a] md:inline-flex"
        >
          <ShoppingCart size={17} /> Shop Premium
          {cartCount > 0 && (
            <span className="rounded-full bg-black px-2 py-0.5 text-xs text-[#D4AF37]">
              {cartCount}
            </span>
          )}
        </Button>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#D4AF37]/20 bg-black px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-neutral-300">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#support">Support</a>
            <a href="#admin">Admin Demo</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ onTryChatbot, onAddToCart }) {
  return (
    <section id="home" className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#D4AF3725,transparent_35%),radial-gradient(circle_at_bottom_left,#ffffff12,transparent_35%)]" />
      <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(135deg,rgba(212,175,55,0.08),transparent,rgba(212,175,55,0.05))]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm text-[#D4AF37]">
            <Sparkles size={16} />
            Customer Service Chatbot Demonstration
          </p>

          <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Premium women’s fashion with an interactive support demonstration.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-300">
            Shemar Collection is a luxury women’s fashion e-commerce demo used
            to showcase a browser-based customer service chatbot. Customers can ask
            about dresses, scarves, bags, abayas, delivery, payment, returns and
            order support while shopping online.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={() => document.querySelector("#products")?.scrollIntoView()}
              className="rounded-2xl bg-[#D4AF37] px-6 text-black shadow-lg shadow-[#D4AF37]/20 hover:bg-[#f0cc5a]"
            >
              Explore Collection
            </Button>

            <Button
              onClick={onTryChatbot}
              className="rounded-2xl border border-[#D4AF37]/40 bg-transparent px-6 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              Try Chatbot
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="rounded-[2rem] border border-[#D4AF37]/25 bg-white/5 p-4 shadow-2xl shadow-[#D4AF37]/10 backdrop-blur-xl">
            <CardContent className="p-0">
              <div className="rounded-[1.5rem] border border-[#D4AF37]/20 bg-gradient-to-br from-[#15110A] to-black p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#D4AF37]">Featured Product</p>
                    <h3 className="mt-1 text-2xl font-bold">
                      Luxury Black Evening Dress
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-[#D4AF37]">
                    <Gem />
                  </div>
                </div>

                <div className="mt-6 h-56 overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/20 bg-black">
                  <img
                    src={dressImage}
                    alt="Luxury Black Evening Dress"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black text-[#D4AF37]">
                      ₦58,000
                    </p>
                    <p className="flex items-center gap-1 text-sm text-neutral-300">
                      <Star
                        size={15}
                        className="fill-[#D4AF37] text-[#D4AF37]"
                      />{" "}
                      4.9 rating
                    </p>
                  </div>

                  <Button
                    onClick={() => onAddToCart(products[0])}
                    className="rounded-2xl bg-[#D4AF37] text-black hover:bg-[#f0cc5a]"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceHighlights() {
  const items = [
    {
      icon: Truck,
      title: "Nationwide Delivery",
      text: "Fast delivery support across major Nigerian cities.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      text: "Supports transfer, card payment and confirmed checkout.",
    },
    {
      icon: RotateCcw,
      title: "Easy Return Support",
      text: "Customers can ask about return and exchange policy.",
    },
  ];

  return (
    <section className="bg-[#070707] py-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.title}
            className="rounded-3xl border border-[#D4AF37]/20 bg-[#111111] shadow-lg shadow-black/40"
          >
            <CardContent className="flex gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37] text-black">
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-neutral-400">
                  {item.text}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Products({ onAddToCart }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <section id="products" className="bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">
              Women’s Collection
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
              Luxury fashion items for women
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
              Explore premium dresses, scarves, bags, abayas, kaftans, corporate
              wear, heels and fashion accessories designed for elegant women.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-[#111111] px-4 py-3 shadow-sm md:w-80">
            <Search size={18} className="text-[#D4AF37]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search women fashion..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden rounded-[1.7rem] border border-[#D4AF37]/20 bg-[#111111] shadow-lg shadow-black/40 transition hover:-translate-y-1 hover:border-[#D4AF37]/60 hover:shadow-[#D4AF37]/10"
            >
              <CardContent className="p-4">
                <div className="h-48 overflow-hidden rounded-[1.3rem] border border-[#D4AF37]/20 bg-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                      {product.category}
                    </p>

                    <p className="flex items-center gap-1 text-sm text-neutral-400">
                      <Star
                        size={14}
                        className="fill-[#D4AF37] text-[#D4AF37]"
                      />{" "}
                      {product.rating}
                    </p>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-white">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-black text-[#D4AF37]">
                      {product.price}
                    </p>

                    <Button
                      onClick={() => onAddToCart(product)}
                      className="rounded-2xl bg-[#D4AF37] text-black hover:bg-[#f0cc5a]"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const welcomeMessage = {
  sender: "bot",
  text: "Hello, welcome to Shemar Collection. Ask me about women clothes, scarves, bags, dresses, delivery, payment, returns, order tracking or customer support.",
  intent: "greeting",
};

function ChatbotWidget({ open, setOpen, faqs, onConversation, onFeedback, onEscalation }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [typing, setTyping] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [rated, setRated] = useState([]);
  const [escalated, setEscalated] = useState([]);
  const messagesEndRef = useRef(null);

  const sampleMessages = [
    "What products do you sell?",
    "Do you deliver to Kaduna?",
    "How can I make payment?",
    "What is your return policy?",
    "How do I track my order?",
    "What sizes do you have?",
    "Is this item still available?",
    "Do you offer any discounts?",
    "Where is your physical shop?",
    "What are your business hours?",
  ];

  const sendMessage = (sampleMessage) => {
    const cleanMessage = (
      typeof sampleMessage === "string" ? sampleMessage : message
    ).trim();
    if (!cleanMessage) return;

    const userMessage = { sender: "user", text: cleanMessage };
    const result = detectIntent(cleanMessage, faqs);
    const recordId = demoRecordId();
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setTyping(true);
    setShowSamples(false);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: result.answer, intent: result.intent, recordId, question: cleanMessage },
      ]);
      onConversation({ id: recordId, question: cleanMessage, answer: result.answer, intent: result.intent, createdAt: new Date().toISOString() });
      setTyping(false);
    }, 650);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  return (
    <div id="support" className="fixed bottom-5 right-5 z-50">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 flex max-h-[calc(100vh-2rem)] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-[1.7rem] border border-[#D4AF37]/30 bg-black shadow-2xl shadow-[#D4AF37]/20 sm:mb-4 sm:max-h-[calc(100vh-3rem)] sm:w-[92vw]"
        >
          <div className="flex items-center justify-between bg-[#090909] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D4AF37] text-black">
                <Bot size={21} />
              </div>

              <div>
                <h3 className="font-bold">Customer Support Demo</h3>
                <p className="text-xs text-[#D4AF37]">
                  Keyword-based intent matching
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([welcomeMessage])}
                className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-[#D4AF37]"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash2 size={17} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-white/10"
                aria-label="Close chatbot"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="min-h-40 flex-1 space-y-3 overflow-y-auto bg-[#111111] p-4 sm:h-72 sm:flex-none">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    item.sender === "user"
                      ? "bg-[#D4AF37] text-black"
                      : "border border-[#D4AF37]/20 bg-black text-neutral-200"
                  }`}
                >
                  <p>{item.text}</p>

                  {item.intent && item.sender === "bot" && (
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-[#D4AF37]">
                      Intent: {item.intent}
                    </p>
                  )}
                  {item.recordId && (
                    <div className="mt-2 flex flex-wrap gap-2 border-t border-[#D4AF37]/20 pt-2">
                      {["Helpful", "Not helpful"].map((rating) => (
                        <button key={rating} disabled={rated.includes(item.recordId)}
                          onClick={() => {
                            onFeedback({ id: demoRecordId(), conversationId: item.recordId, question: item.question, rating, createdAt: new Date().toISOString() });
                            setRated((list) => [...list, item.recordId]);
                          }}
                          className="rounded-md border border-[#D4AF37]/30 px-2 py-1 text-[10px] text-[#D4AF37] disabled:opacity-30">{rating}</button>
                      ))}
                      <button disabled={escalated.includes(item.recordId)}
                        onClick={() => {
                          onEscalation({ id: demoRecordId(), conversationId: item.recordId, question: item.question, status: "Pending", createdAt: new Date().toISOString() });
                          setEscalated((list) => [...list, item.recordId]);
                        }}
                        className="rounded-md border border-white/20 px-2 py-1 text-[10px] text-white disabled:opacity-30">
                        {escalated.includes(item.recordId) ? "Support requested" : "Request human support"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl border border-[#D4AF37]/20 bg-black px-4 py-3">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-2 w-2 rounded-full bg-[#D4AF37]"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                  <span className="ml-2 text-xs text-neutral-400">Assistant is typing</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#D4AF37]/20 bg-black p-3">
            <button
              onClick={() => setShowSamples((value) => !value)}
              className="mb-2 flex w-full items-center justify-between text-xs text-neutral-400 hover:text-[#D4AF37]"
            >
              Try a sample question
              <ChevronDown
                size={15}
                className={`transition ${showSamples ? "rotate-180" : ""}`}
              />
            </button>
            {showSamples && (
              <div className="mb-3 grid max-h-28 gap-2 overflow-y-auto sm:grid-cols-2">
                {sampleMessages.map((sample) => (
                  <button
                    key={sample}
                    onClick={() => sendMessage(sample)}
                    disabled={typing}
                    className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-2 text-left text-[11px] text-[#D4AF37] transition hover:bg-[#D4AF37]/20 disabled:opacity-50"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-[#111111] px-3 py-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your question..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
              />

              <Button
                onClick={sendMessage}
                disabled={typing}
                size="icon"
                className="rounded-xl bg-[#D4AF37] text-black"
              >
                <Send size={17} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="h-14 rounded-full bg-[#D4AF37] px-5 text-black shadow-2xl shadow-[#D4AF37]/20 hover:bg-[#f0cc5a]"
        >
          <MessageCircle className="mr-2" size={20} /> Chat Support
        </Button>
      )}
    </div>
  );
}

function AdminPreview({ demo, saveFaq, deleteFaq, setStatus, resetDemo }) {
  const [view, setView] = useState("FAQs");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ intent: "", keywords: "", answer: "" });
  const [error, setError] = useState("");
  const clear = () => { setEditing(null); setForm({ intent: "", keywords: "", answer: "" }); setError(""); };
  const submit = (event) => {
    event.preventDefault();
    const intent = form.intent.trim().toLowerCase().replace(/\s+/g, "_");
    const keywords = form.keywords.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
    if (!intent || !keywords.length || !form.answer.trim()) { setError("Complete all fields."); return; }
    if (demo.faqs.some((x) => x.intent === intent && x.id !== editing)) { setError("Intent already exists."); return; }
    saveFaq({ id: editing || demoRecordId(), intent, keywords, answer: form.answer.trim() });
    clear();
  };
  const sections = {
    FAQs: demo.faqs,
    Conversations: demo.conversations,
    Feedback: demo.feedback,
    Escalations: demo.escalations,
  };
  return <section id="admin" className="bg-[#070707] py-16 text-white">
    <div className="mx-auto max-w-7xl px-4">
      <p className="font-semibold uppercase tracking-wider text-[#D4AF37]">Browser-local demonstration</p>
      <h2 className="mt-3 text-3xl font-black">Interactive chatbot administration</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-400">
        This interface simulates backend behaviour in your browser. Records are stored only in this browser,
        not on a server. There is no real login protection, central database, human-agent integration or pre-trained NLP model.
        Do not enter actual customer or private information.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Conversations", demo.conversations.length], ["FAQs", demo.faqs.length],
          ["Feedback", demo.feedback.length], ["Pending escalations", demo.escalations.filter((x) => x.status === "Pending").length],
        ].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#D4AF37]/20 bg-[#111111] p-5">
          <p className="text-xs text-neutral-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-[#D4AF37]">{value}</p>
        </div>)}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {Object.keys(sections).map((name) => <button key={name} onClick={() => setView(name)}
          className={view === name ? "rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black" : "rounded-xl border border-[#D4AF37]/30 px-4 py-2 text-sm"}>
          {name}</button>)}
        <button className="ml-auto rounded-xl border border-white/30 px-4 py-2 text-sm" onClick={() => {
          if (window.confirm("Reset all browser-local demonstration records?")) { resetDemo(); clear(); }
        }}>Reset demo</button>
      </div>
      {view === "FAQs" && <form onSubmit={submit} className="mt-5 grid gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#111111] p-4 md:grid-cols-[1fr_1fr_2fr_auto]">
        <input aria-label="Intent name" placeholder="Intent name" value={form.intent}
          onChange={(e) => setForm((x) => ({ ...x, intent: e.target.value }))} className="rounded-lg border border-white/20 bg-black p-2 text-sm" />
        <input aria-label="Comma separated keywords" placeholder="Keywords, comma separated" value={form.keywords}
          onChange={(e) => setForm((x) => ({ ...x, keywords: e.target.value }))} className="rounded-lg border border-white/20 bg-black p-2 text-sm" />
        <textarea aria-label="Prepared answer" placeholder="Prepared answer" rows={2} value={form.answer}
          onChange={(e) => setForm((x) => ({ ...x, answer: e.target.value }))} className="rounded-lg border border-white/20 bg-black p-2 text-sm" />
        <div className="flex flex-col gap-2"><button type="submit" className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black">Save</button>
          <button type="button" onClick={clear} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Clear</button></div>
        {error && <p className="text-xs text-red-300">{error}</p>}
      </form>}
      <div className="mt-5 max-h-[35rem] space-y-3 overflow-y-auto">
        {sections[view].map((row) => <div key={row.id} className="rounded-2xl border border-white/15 bg-[#111111] p-4 text-sm">
          {view === "FAQs" ? <>
            <h3 className="font-bold text-[#D4AF37]">{row.intent}</h3>
            <p className="mt-1 text-xs text-neutral-400">{row.keywords.join(", ")}</p>
            <p className="mt-2">{row.answer}</p>
            <div className="mt-3 flex gap-4">
              <button className="text-[#D4AF37] underline" onClick={() => {
                setEditing(row.id); setForm({ intent: row.intent, keywords: row.keywords.join(", "), answer: row.answer }); setError("");
              }}>Edit</button>
              <button className="text-red-300 underline" onClick={() => {
                if (window.confirm("Delete this demo FAQ?")) deleteFaq(row.id);
              }}>Delete</button>
            </div>
          </> : <>
            <p className="text-xs text-[#D4AF37]">{row.intent || row.rating || row.status || "Customer enquiry"} · {new Date(row.createdAt).toLocaleString()}</p>
            <p className="mt-2">{row.question}</p>
            {row.answer && <p className="mt-2 text-neutral-400">{row.answer}</p>}
            {view === "Escalations" && <select value={row.status} onChange={(e) => setStatus(row.id, e.target.value)}
              aria-label="Demo escalation status" className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-black p-2 text-[#D4AF37]">
              <option value="Pending">Pending</option><option value="In review">In review</option><option value="Resolved">Resolved (demo)</option>
            </select>}
          </>}
        </div>)}
        {!sections[view].length && <p className="text-sm text-neutral-400">No records yet. Try the chat demonstration.</p>}
      </div>
    </div>
  </section>;
}

function HowItWorks() {
  const steps = [
    { title: "Customer Question", text: "The customer enters a support request.", icon: MessageCircle },
    { title: "Text Processing", text: "The message is normalized for analysis.", icon: BrainCircuit },
    { title: "Intent Detection", text: "The demo identifies the closest customer-service intent.", icon: Search },
    { title: "Knowledge Matching", text: "The intent is matched with the prepared knowledge base.", icon: LayoutDashboard },
    { title: "Helpful Response", text: "A suitable customer-service answer is displayed.", icon: Bot },
  ];

  return (
    <section id="how-it-works" className="border-y border-[#D4AF37]/15 bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">System Process</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">How the chatbot works</h2>
          <p className="mt-4 leading-7 text-neutral-400">
            The demonstration follows a transparent, keyword-based customer support workflow from question to response.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-3xl border border-[#D4AF37]/20 bg-[#111111] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-black">
                  <step.icon size={20} />
                </div>
                <span className="text-2xl font-black text-[#D4AF37]/30">0{index + 1}</span>
              </div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ShemarCollectionChatbotDemo() {
  const [cartCount, setCartCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(true);
  const [cartNotice, setCartNotice] = useState("");
  const [demo, setDemo] = useState(() => loadDemoState(knowledgeBase));
  useEffect(() => { saveDemoState(demo); }, [demo]);
  const addRecord = (key, row) => setDemo((state) => ({ ...state, [key]: [row, ...state[key]] }));
  const saveFaq = (row) => setDemo((state) => ({ ...state, faqs: state.faqs.some((v) => v.id === row.id) ? state.faqs.map((v) => v.id === row.id ? row : v) : [...state.faqs, row] }));

  const addToCart = (product) => {
    setCartCount((count) => count + 1);
    setCartNotice(`${product.name} added to cart`);
    window.setTimeout(() => setCartNotice(""), 2200);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header cartCount={cartCount} />
      <Hero onTryChatbot={() => setChatOpen(true)} onAddToCart={addToCart} />
      <ServiceHighlights />
      <Products onAddToCart={addToCart} />
      <HowItWorks />
      <AdminPreview demo={demo} saveFaq={saveFaq}
        deleteFaq={(id) => setDemo((state) => ({ ...state, faqs: state.faqs.filter((v) => v.id !== id) }))}
        setStatus={(id, status) => setDemo((state) => ({ ...state, escalations: state.escalations.map((v) => v.id === id ? { ...v, status } : v) }))}
        resetDemo={() => setDemo(initialDemoState(knowledgeBase))} />

      <footer className="border-t border-[#D4AF37]/20 bg-black px-4 py-10 text-center text-sm text-neutral-500">
        <p>
          © 2026 Shemar Collection. Premium women’s fashion e-commerce demo for
          Keyword-based customer support demonstration. No real backend or deployed NLP model.
        </p>
      </footer>

      {cartNotice && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-1/2 top-24 z-[60] -translate-x-1/2 rounded-2xl border border-[#D4AF37]/30 bg-[#111111] px-5 py-3 text-sm text-white shadow-2xl"
        >
          <span className="mr-2 text-[#D4AF37]">✓</span>{cartNotice}
        </motion.div>
      )}
      <ChatbotWidget open={chatOpen} setOpen={setChatOpen} faqs={demo.faqs}
        onConversation={(row) => addRecord("conversations", row)}
        onFeedback={(row) => addRecord("feedback", row)}
        onEscalation={(row) => addRecord("escalations", row)} />
    </div>
  );
}
