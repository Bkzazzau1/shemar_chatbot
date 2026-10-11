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
import { answerCustomer } from "./chatEngine.js";

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
  return <div className={className}>{children}</div>;
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
    image: null,
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
    image: null,
  },
  {
    id: 6,
    name: "Royal Ladies Kaftan",
    category: "Kaftan",
    price: "₦48,500",
    rating: 4.8,
    image: null,
  },
  {
    id: 7,
    name: "Corporate Women Blazer",
    category: "Corporate Wear",
    price: "₦42,000",
    rating: 4.6,
    image: null,
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
    image: null,
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
    intent: "delivery_fee",
    keywords: ["delivery fee", "delivery fees", "delivery cost", "delivery charge", "shipping fee", "shipping cost", "how much is delivery", "how much", "fee"],
    answer:
      "Delivery fees depend on your location and package size. Deliveries within Kaduna cost less than interstate deliveries, and the exact fee is confirmed before you make payment.",
  },
  {
    intent: "delivery_time",
    keywords: ["how long", "how many days", "when will", "delivery time", "arrive", "fast delivery", "express"],
    answer:
      "Orders within Kaduna are usually delivered in 1 to 2 working days. Other states in Nigeria usually take 2 to 5 working days after payment is confirmed.",
  },
  {
    intent: "international_shipping",
    keywords: ["international", "outside nigeria", "abroad", "overseas", "uk", "usa", "ghana"],
    answer:
      "Shemar Collection currently delivers within Nigeria. For delivery outside Nigeria, please contact customer support so we can confirm options and costs for your country.",
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
    keywords: ["payment", "pay", "card", "transfer", "bank", "cash", "pos", "pay on delivery", "payment on delivery"],
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
    intent: "cancel_order",
    keywords: ["cancel", "cancellation", "cancel my order"],
    answer:
      "You can cancel an order before it is dispatched. Please contact customer support with your order number as soon as possible. Orders that have already been dispatched follow the return policy.",
  },
  {
    intent: "change_order",
    keywords: ["change", "change my order", "modify", "edit my order", "change address", "change size"],
    answer:
      "You can change the size, colour or delivery address of an order before it is dispatched. Send your order number and the change you need to customer support.",
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
    keywords: ["discount", "discounts", "sale", "promo", "promotion", "coupon", "cheaper"],
    answer:
      "Shemar Collection offers discounts during selected promotions and seasonal sales. Follow our updates or contact customer support to learn about current offers.",
  },
  {
    intent: "store_location",
    keywords: ["shop location", "store location", "address", "visit", "physical shop", "physical"],
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
    intent: "price",
    keywords: ["price", "prices", "cost", "how much does", "expensive", "affordable", "budget"],
    answer:
      "Prices are shown on each product card. For example, scarves start from ₦18,500, handbags from ₦45,000 and evening dresses from ₦58,000.",
  },
  {
    intent: "colours",
    keywords: ["colour", "colours", "color", "colors", "other colour", "other colours"],
    answer:
      "Many of our items come in more than one colour. Tell customer support the product name and they will confirm which colours are currently available.",
  },
  {
    intent: "quality",
    keywords: ["original", "quality", "fabric", "material", "authentic", "genuine"],
    answer:
      "Shemar Collection sells carefully selected, quality women’s fashion. Fabric and material details are provided for each item, and customer support can share more photos on request.",
  },
  {
    intent: "care_instructions",
    keywords: ["wash", "washing", "iron", "dry clean", "care for", "care instructions", "fade"],
    answer:
      "Hand-wash delicate items in cold water, or dry-clean silk, embellished gowns and abayas. Iron on low heat on the reverse side and dry away from direct sunlight to protect the colour.",
  },
  {
    intent: "custom_tailoring",
    keywords: ["custom", "tailor", "tailoring", "sew", "made to measure", "customise", "customize", "bespoke"],
    answer:
      "Custom or made-to-measure requests can be discussed with customer support. Please share your measurements, the style you want and your deadline.",
  },
  {
    intent: "occasion_wear",
    keywords: ["wedding", "weddings", "bridal", "party", "parties", "occasion", "owambe", "event", "dinner"],
    answer:
      "For weddings, parties and special events, we recommend our luxury evening dresses, Ankara gowns, kaftans and gold jewelry sets. Customer support can help you style a complete look.",
  },
  {
    intent: "new_arrivals",
    keywords: ["new arrivals", "new arrival", "new collection", "latest", "restock", "new items"],
    answer:
      "New arrivals are added regularly. Check the Products section for the latest items, or ask customer support about restocks of a particular item.",
  },
  {
    intent: "wholesale",
    keywords: ["wholesale", "bulk", "reseller", "resell", "large order"],
    answer:
      "We accept bulk and wholesale orders. Contact customer support with the items and quantities you need for a price quote.",
  },
  {
    intent: "gift",
    keywords: ["gift", "gifts", "gift wrap", "gift wrapping", "wrapping", "present", "voucher"],
    answer:
      "Gift wrapping is available on request. Add a note at checkout or tell customer support, and we can also include a personal message with the order.",
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
  { intent: "thanks", keywords: ["thank", "thanks", "thank you", "bye", "goodbye"], answer: "You are welcome! Thank you for shopping with Shemar Collection. Ask me anything else at any time." },
  { intent: "service_information", keywords: ["what services", "services do you offer", "what can you help with", "how does it work"], answer: "I can help explain the sample collection, prices, sizing, delivery, payment options, returns and order questions. This is a demonstration, so real orders and payments are not connected." },
  { intent: "payment_confirmation", keywords: ["payment confirmation", "i have paid", "i paid", "transfer receipt", "payment pending", "payment successful", "payment not reflecting"], answer: "Once a real payment has been made, the shop must confirm it through its verified payment channel. This demo cannot check transactions." },
  { intent: "pay_on_delivery", keywords: ["pay on delivery", "cash on delivery", "payment on delivery", "pay when it arrives"], answer: "Payment on delivery depends on the merchant and destination. It is mentioned in this demo's sample policies, but confirm whether it is offered for a real order before relying on it." },
  { intent: "wrong_item", keywords: ["wrong item", "incorrect item", "wrong colour sent", "wrong size sent", "sent the wrong item"], answer: "Sorry if an order arrives different from what you selected. Keep the packaging and order details, take a clear photo and contact the shop through its verified support channel for an exchange review." },
  { intent: "damaged_item", keywords: ["arrived damaged", "damaged package", "item is damaged", "defective product", "torn dress"], answer: "If an item arrives damaged, keep the packaging, take photos of the problem and contact the seller promptly with the order reference. This demo cannot create a real return ticket." },
  { intent: "checkout_support", keywords: ["checkout not working", "cannot checkout", "can't checkout", "cart error", "checkout error"], answer: "This storefront demonstrates adding products to a cart counter, but it does not process real checkouts. Please use the merchant's verified shop for orders and payments." },
  { intent: "gift_delivery", keywords: ["send as a gift", "send to someone", "gift for someone", "deliver a gift"], answer: "A gift order would need the recipient's delivery arrangements confirmed by the shop. Gift wrapping is shown as a sample service, not a confirmed live order option." },
  { intent: "returns_eligibility", keywords: ["return after", "refund timeline", "return window", "how many days to return"], answer: "The demonstration FAQ refers to contacting support within 24 hours of delivery for an issue. Actual return eligibility and refund timing must be confirmed against the shop's current policies." },
  { intent: "store_pickup", keywords: ["can i collect", "pick up", "pickup", "collect in person", "self collection"], answer: "Collection arrangements depend on whether the shop has an active pickup location. This demo has no verified collection address, so confirm arrangements directly before travelling." },
  { intent: "delivery_address", keywords: ["change delivery address", "wrong address", "update my address", "delivery address change"], answer: "If you need to change an address, contact the shop with your order reference before dispatch. This demo does not update real orders or addresses." },
  { intent: "privacy", keywords: ["is this secure", "is my information safe", "privacy", "personal information", "card details", "is my data saved"], answer: "This chat is a browser-only demonstration. Conversation records are saved locally in this browser for the demo administrator view. Do not enter private account details, payment information or passwords." },
  { intent: "preorder", keywords: ["preorder", "pre order", "reserve an item", "out of stock"], answer: "This sample catalogue is not linked to stock or reservations. A real preorder can only be confirmed by the shop through its official contact channel." },
  { intent: "order_number", keywords: ["where do i find my order number", "lost my order number", "order reference", "order id"], answer: "A real order reference is usually in an order confirmation message or receipt. This demo does not generate order numbers or retrieve purchases. Please ask the shop if you cannot find yours." },
];


function Header({ cartCount, page, onTryChatbot }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="shemar-header sticky top-0 z-40 border-b border-[#D4AF37]/20 bg-black/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
            <Crown size={23} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Shemar Collection
            </h1>
            <p className="text-xs text-[#D4AF37]">
              Premium fashion • Thoughtful service
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
          <button type="button" onClick={onTryChatbot} className="hover:text-[#D4AF37]">
            Support
          </button>
          <a href="#admin" className={page === "admin" ? "text-[#D4AF37]" : "hover:text-[#D4AF37]"}>
            Admin Demo
          </a>
        </nav>

        <Button
          onClick={() => { if (page === "admin") window.location.hash = "#products"; else document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" }); }}
          className="hidden items-center gap-2 rounded-full bg-[#D4AF37] px-5 text-black shadow-lg shadow-[#D4AF37]/10 transition hover:bg-[#f0cc5a] md:inline-flex"
        >
          <ShoppingCart size={17} /> Shop Premium
          {cartCount > 0 && (
            <span className="rounded-full bg-black px-2 py-0.5 text-xs text-[#D4AF37]">
              {cartCount}
            </span>
          )}
        </Button>

        <button aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} className="rounded-xl border border-[#D4AF37]/25 p-2 text-[#D4AF37] md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#D4AF37]/20 bg-black px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-neutral-300">
            <a href="#home" onClick={() => setOpen(false)}>Home</a>
            <a href="#products" onClick={() => setOpen(false)}>Products</a>
            <button type="button" className="text-left" onClick={() => { setOpen(false); onTryChatbot(); }}>Support</button>
            <a href="#admin" onClick={() => setOpen(false)}>Admin Demo</a>
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

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm text-[#D4AF37]">
            <Sparkles size={16} />
            Customer Service Chatbot Demonstration
          </p>

          <h2 className="shemar-display max-w-2xl text-5xl font-medium leading-[1.08] tracking-tight text-[#FBF5E9] sm:text-6xl lg:text-7xl">
            A little luxury. <span className="text-[#D4AF37]">Every day.</span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-300">
            Explore a thoughtfully curated collection of women’s fashion. Browse the pieces you love and experience our interactive customer support demonstration for delivery, payments, returns and more.
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
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) =>
      (category === "All" || product.category === category) &&
      `${product.name} ${product.category}`.toLowerCase().includes(term)
    );
  }, [query, category]);

  return (
    <section id="products" className="shemar-products relative overflow-hidden bg-[#080807] px-4 py-16 text-white sm:px-6 md:py-24">
      <div className="pointer-events-none absolute left-[-10rem] top-32 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="shemar-eyebrow flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              <span className="h-px w-8 bg-[#D4AF37]" /> Curated by Shemar
            </p>
            <h2 className="shemar-display mt-3 text-4xl font-semibold leading-tight text-[#F7F2E8] sm:text-5xl">
              The Collection<span className="text-[#D4AF37]">.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#A8A49B] sm:text-base">
              Beautifully considered pieces for everyday elegance and unforgettable occasions.
            </p>
          </div>
          <label className="flex w-full items-center gap-3 rounded-2xl border border-[#D4AF37]/25 bg-[#171613] px-4 py-3.5 text-[#D4AF37] shadow-lg shadow-black/20 focus-within:border-[#D4AF37]/70 lg:max-w-sm">
            <Search size={18} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the collection..." aria-label="Search products"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#928E85]" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-[#BDB6A5] hover:text-white"><X size={16} /></button>}
          </label>
        </div>

        <div className="shemar-filters mb-7 flex items-center gap-2 overflow-x-auto pb-3" role="group" aria-label="Product categories">
          {categories.map((item) => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                category === item
                  ? "border-[#D4AF37] bg-[#D4AF37] text-[#17130B] shadow-md shadow-[#D4AF37]/10"
                  : "border-white/15 bg-white/[0.035] text-[#BBB5A9] hover:border-[#D4AF37]/50 hover:text-[#F5DF9B]"
              }`}>
              {item === "All" ? "All pieces" : item}
            </button>
          ))}
        </div>
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs text-[#A8A49B]">
          <span>{filtered.length} {filtered.length === 1 ? "piece" : "pieces"} in view</span>
          <span className="hidden sm:inline">The Shemar edit · Demonstration catalogue</span>
        </div>

        {filtered.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {filtered.map((product, index) => (
              <article key={product.id}
                className="shemar-product-card group flex min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-[#E0C879]/15 bg-[#131210] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/55 hover:shadow-[0_25px_60px_-35px_rgba(212,175,55,.4)]">
                <div className="shemar-product-image relative aspect-[5/4] overflow-hidden bg-[#211C17]">
                  {product.image ? (
                    <img src={product.image} alt={product.name} loading={index > 2 ? "lazy" : "eager"}
                      className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.07]" />
                  ) : (
                    <div className="shemar-product-placeholder flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
                      aria-label={`Image not yet available for ${product.name}`}>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black/30 text-[#D4AF37]">
                        <Gem size={26} strokeWidth={1.2} />
                      </div>
                      <span className="shemar-display text-2xl text-[#F4E7C9]">{product.category}</span>
                      <span className="text-[10px] uppercase tracking-[.25em] text-[#BEAA7A]">Photo coming soon</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F7E7B8] backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="shemar-display text-[1.45rem] font-semibold leading-snug text-[#F6F2EA] sm:text-[1.65rem]">{product.name}</h3>
                    <span className="mt-1 flex shrink-0 items-center gap-1 text-xs text-[#D7C18A]" title="Sample catalogue rating">
                      <Star size={13} fill="currentColor" />{product.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#9E998F]">Shemar Collection · Fashion edit</p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#D4AF37]/15 pt-4" style={{ marginTop: "1.6rem" }}>
                    <div>
                      <p className="text-[10px] uppercase tracking-[.16em] text-[#9E998F]">Price</p>
                      <p className="mt-0.5 text-xl font-bold tracking-tight text-[#F1D37E]">{product.price}</p>
                    </div>
                    <button type="button" onClick={() => onAddToCart(product)}
                      aria-label={`Add ${product.name} to cart`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#D4AF37] px-4 py-3 text-xs font-semibold text-[#18130A] shadow-lg shadow-black/20 transition hover:bg-[#F0D681] active:scale-95 sm:px-5 sm:text-sm">
                      <ShoppingBag size={16} /> Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-dashed border-[#D4AF37]/25 bg-[#14120F] px-6 py-16 text-center">
            <Search size={30} className="text-[#D4AF37]" />
            <h3 className="shemar-display text-2xl text-white">No matching pieces</h3>
            <p className="text-sm text-[#AFA99E]">Try another search or browse the full collection.</p>
            <button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-2 rounded-full border border-[#D4AF37]/40 px-5 py-2 text-sm text-[#F3D579] hover:bg-[#D4AF37]/10">View all pieces</button>
          </div>
        )}
      </div>
    </section>
  );
}

const welcomeMessage = {
  sender: "bot",
  text: "Hello! Welcome to Shemar Collection. Looking for a style, checking delivery, or need help with an order? Tell me what you need, or choose a question below. This is a shop demonstration, not a live order service.",
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
    "How much is the black evening dress?",
    "Is the handbag in stock?",
    "Do you have a size guide?",
    "What colours are available?",
    "Do you deliver to Kano?",
    "How much is delivery to Abuja?",
    "How long does delivery take?",
    "Can I change my delivery address?",
    "Do you ship outside Nigeria?",
    "How do I place an order?",
    "How do I track my order?",
    "Can I cancel my order?",
    "Can I collect my order?",
    "Can I pay on delivery?",
    "How do I confirm my payment?",
    "What if I receive the wrong item?",
    "My dress arrived damaged",
    "What is your return policy?",
    "Can I exchange my size?",
    "Do you have discounts?",
    "Can you gift wrap an item?",
    "Do you make custom outfits?",
    "What are your business hours?",
    "What information does this demo store?",
    "Can I speak to a person?",
  ];

  const sendMessage = (sampleMessage) => {
    const cleanMessage = (
      typeof sampleMessage === "string" ? sampleMessage : message
    ).trim();
    if (!cleanMessage) return;

    const userMessage = { sender: "user", text: cleanMessage };
    const previousReply = [...messages].reverse().find((item) => item.sender === "bot" && item.recordId);
    const result = answerCustomer(cleanMessage, faqs, { lastIntent: previousReply?.intent }, products);
    if (!result) return;
    const recordId = demoRecordId();
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setTyping(true);
    setShowSamples(false);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: result.answer, intent: result.intent, recordId, question: cleanMessage, suggestions: result.suggestions },
      ]);
      onConversation({ id: recordId, question: cleanMessage, answer: result.answer, intent: result.intent, createdAt: new Date().toISOString() });
      setTyping(false);
    }, 650);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  return (
    <div id="support" className="fixed bottom-4 right-3 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="shemar-chat-shell flex flex-col overflow-hidden rounded-[1.6rem] border border-[#D4AF37]/40 bg-[#10100E] text-white shadow-[0_28px_90px_rgba(0,0,0,.65)]"
        >
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 bg-[#181611] px-4 py-4 text-white sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/10">
                <Bot size={21} />
              </div>

              <div>
                <h3 className="font-bold">Shemar Concierge</h3>
                <p className="text-xs text-[#D4AF37]">
                  Customer assistance · Demo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => { setMessages([welcomeMessage]); setRated([]); setEscalated([]); }}
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

          <div className="shemar-chat-messages min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#100F0D] p-4 sm:p-5">
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
                      : "border border-[#D4AF37]/20 bg-[#211F1A] text-[#F0EDE7]"
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

          <div className="border-t border-[#D4AF37]/20 bg-[#171510] p-3.5 sm:p-4">
            <button
              onClick={() => setShowSamples((value) => !value)}
              className="mb-3 flex w-full items-center justify-between text-xs text-[#D7C8A3] hover:text-[#D4AF37]"
            >
              Try a sample question
              <ChevronDown
                size={15}
                className={`transition ${showSamples ? "rotate-180" : ""}`}
              />
            </button>
            {showSamples && (
              <div className="mb-3 grid max-h-36 gap-2 overflow-y-auto sm:grid-cols-2">
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
            <div className="flex items-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-[#0B0A09] px-3 py-2.5 focus-within:border-[#D4AF37]">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="How can we help you?"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
              />

              <Button
                onClick={sendMessage}
                disabled={typing}
                size="icon"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-black transition hover:bg-[#F0D681]"
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
          className="shemar-chat-launch flex h-14 items-center gap-2 rounded-full border border-[#F5DA81]/40 bg-[#D4AF37] px-5 text-sm font-semibold text-black shadow-[0_10px_35px_rgba(212,175,55,.25)] transition hover:-translate-y-1 hover:bg-[#F1D780]"
        >
          <MessageCircle size={20} /> Chat with us
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
  return <section id="admin" className="min-h-[calc(100vh-81px)] bg-[#070707] py-16 text-white">
    <div className="mx-auto max-w-7xl px-4">
      <a href="#home" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#D4AF37]">← Back to store</a>
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
  const [chatOpen, setChatOpen] = useState(false);
  const [cartNotice, setCartNotice] = useState("");
  const [demo, setDemo] = useState(() => loadDemoState(knowledgeBase));
  const [page, setPage] = useState(() => (window.location.hash === "#admin" ? "admin" : "store"));
  useEffect(() => { saveDemoState(demo); }, [demo]);
  useEffect(() => {
    const onHashChange = () => setPage(window.location.hash === "#admin" ? "admin" : "store");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    // The target section only exists after the page switch renders, so scroll once it has.
    const target = page === "store" && window.location.hash ? document.querySelector(window.location.hash) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [page]);
  const addRecord = (key, row) => setDemo((state) => ({ ...state, [key]: [row, ...state[key]] }));
  const saveFaq = (row) => setDemo((state) => ({ ...state, faqs: state.faqs.some((v) => v.id === row.id) ? state.faqs.map((v) => v.id === row.id ? row : v) : [...state.faqs, row] }));

  const addToCart = (product) => {
    setCartCount((count) => count + 1);
    setCartNotice(`${product.name} added to cart`);
    window.setTimeout(() => setCartNotice(""), 2200);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header cartCount={cartCount} page={page} onTryChatbot={() => setChatOpen(true)} />
      {page === "admin" ? (
        <AdminPreview demo={demo} saveFaq={saveFaq}
          deleteFaq={(id) => setDemo((state) => ({ ...state, faqs: state.faqs.filter((v) => v.id !== id) }))}
          setStatus={(id, status) => setDemo((state) => ({ ...state, escalations: state.escalations.map((v) => v.id === id ? { ...v, status } : v) }))}
          resetDemo={() => setDemo(initialDemoState(knowledgeBase))} />
      ) : (
        <>
          <Hero onTryChatbot={() => setChatOpen(true)} onAddToCart={addToCart} />
          <ServiceHighlights />
          <Products onAddToCart={addToCart} />
          <HowItWorks />
        </>
      )}

      <footer className="border-t border-[#D4AF37]/20 bg-black px-4 py-10 text-center text-sm text-neutral-500">
        <p>
          © 2026 Shemar Collection. Demonstration catalogue and browser-local customer support; no real backend or deployed NLP model.
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
