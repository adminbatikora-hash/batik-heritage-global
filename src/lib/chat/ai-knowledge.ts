// AI Knowledge Base for the Batikora store
// This simulates RAG (Retrieval Augmented Generation) responses

import { IntentType } from "./types";

const KNOWLEDGE_BASE = {
  products: {
    categories: ["Men Batik", "Women Batik", "Accessories", "Home & Living"],
    materials: ["Pure Silk", "Premium Cotton", "Silk Blend", "Linen", "Cotton Sateen"],
    priceRange: "$89 - $499",
    bestsellers: [
      "Royal Parang Silk Shirt ($189)",
      "Mega Mendung Dress ($259)",
      "Kawung Premium Blazer ($349)",
      "Truntum Elegant Gown ($499)",
    ],
    sizeGuide: "XS (chest 32-34), S (34-36), M (36-38), L (38-40), XL (40-42), XXL (42-44)",
  },
  shipping: {
    freeShipping: "Free worldwide shipping on orders over $150",
    methods: [
      { name: "Standard Shipping", days: "10-14 business days", cost: "Free over $150, otherwise $15" },
      { name: "Express Shipping", days: "5-7 business days", cost: "$25" },
      { name: "Priority Shipping", days: "3-5 business days", cost: "$45" },
      { name: "Overnight Shipping", days: "1-2 business days", cost: "$75" },
    ],
    carriers: ["DHL", "FedEx", "UPS", "EMS"],
    countries: "We ship to 50+ countries including US, Canada, UK, Germany, France, Australia, Singapore, Japan",
    tracking: "You will receive a tracking number via email once your order ships. Track at our website or carrier's site.",
  },
  returns: {
    policy: "30-day return policy for unworn items in original packaging",
    process: "Email support@batikora.com with your order number. We'll send a prepaid return label.",
    refundTime: "Refunds processed within 5-7 business days after we receive the item",
    exchanges: "Free exchanges available for different sizes or colors",
    exceptions: "Custom-made and sale items are final sale",
  },
  payment: {
    methods: ["PayPal", "Credit Card (Visa, Mastercard, Amex)", "Debit Card", "Bank Transfer"],
    currency: "We accept USD, EUR, GBP, AUD, SGD, JPY",
    security: "All payments are encrypted with 256-bit SSL. We never store your card details.",
    installments: "Pay in 4 installments with PayPal Pay Later (available in select countries)",
  },
  faq: [
    { q: "Are your batik products authentic?", a: "Yes! Every piece is hand-crafted by certified Indonesian artisans. Each item comes with a certificate of authenticity." },
    { q: "How do I care for batik?", a: "Hand wash in cold water with mild detergent. Do not wring. Dry flat in shade. Iron on low heat on reverse side." },
    { q: "Do you offer custom orders?", a: "Yes! We offer custom batik pieces. Contact us with your design ideas and we'll connect you with our artisans." },
    { q: "What's your customer service hours?", a: "Our AI assistant is available 24/7. Human agents are available Mon-Fri 9AM-6PM WIB (GMT+7)." },
    { q: "Do you offer wholesale pricing?", a: "Yes! For orders of 50+ pieces, we offer wholesale pricing. Email wholesale@batikora.com." },
  ],
  store: {
    name: "Batikora",
    founded: "2009",
    mission: "Bringing authentic Indonesian Batik to the world while empowering artisan communities",
    location: "Jl. Malioboro No. 123, Yogyakarta, Indonesia",
    email: "hello@batikora.com",
    phone: "+62 274 123 456",
    hours: "Mon-Fri 9AM-6PM WIB, Sat 9AM-3PM WIB",
  },
};

export function detectIntent(message: string): IntentType {
  const lower = message.toLowerCase();

  if (lower.match(/order.*status|track|where.*order|shipping.*status|when.*arrive/)) {
    return "order_status";
  }
  if (lower.match(/refund|return|exchange|money back|send back/)) {
    return "refund_request";
  }
  if (lower.match(/ship|deliver|how long|arrive|postal|tracking/)) {
    return "shipping_inquiry";
  }
  if (lower.match(/pay|payment|card|paypal|invoice|billing|charge/)) {
    return "payment_inquiry";
  }
  if (lower.match(/complain|unhappy|dissatisfied|terrible|worst|angry|disappointed/)) {
    return "complaint";
  }
  if (lower.match(/bug|error|broken|not working|issue|problem|technical/)) {
    return "technical_support";
  }
  if (lower.match(/product|price|size|color|material|silk|cotton|shirt|dress|batik|buy|order|stock/)) {
    return "product_inquiry";
  }

  return "general";
}

export function generateAIResponse(message: string, intent: IntentType): string {
  const kb = KNOWLEDGE_BASE;

  switch (intent) {
    case "product_inquiry":
      if (message.toLowerCase().includes("size")) {
        return `Great question! Here's our size guide:\n\n${kb.products.sizeGuide}\n\nOur batik tends to have a relaxed fit. If you're between sizes, we recommend going with your usual size. Would you like help finding a specific product?`;
      }
      if (message.toLowerCase().includes("material") || message.toLowerCase().includes("silk") || message.toLowerCase().includes("cotton")) {
        return `We use only the finest materials for our batik:\n\n• **Pure Silk** - Luxurious hand-painted batik\n• **Premium Cotton** - Comfortable everyday wear\n• **Silk Blend** - Best of both worlds\n• **Cotton Sateen** - Elegant with subtle sheen\n\nAll materials are sourced sustainably. Which type interests you?`;
      }
      if (message.toLowerCase().includes("recommend") || message.toLowerCase().includes("best")) {
        return `Here are our current bestsellers:\n\n🏆 ${kb.products.bestsellers.join("\n🏆 ")}\n\nAll items are handcrafted by master artisans. Would you like more details on any of these?`;
      }
      return `I'd be happy to help you find the perfect batik piece! We have collections for:\n\n• **Men** - Shirts, blazers, formal wear\n• **Women** - Dresses, blouses, accessories\n• **Price range**: ${kb.products.priceRange}\n\nWhat type of piece are you looking for? I can recommend something based on your occasion, budget, or style preference.`;

    case "shipping_inquiry":
      if (message.toLowerCase().includes("free")) {
        return `Yes! We offer **free worldwide shipping** on all orders over $150 🎉\n\nFor orders under $150, standard shipping is just $15. We ship to 50+ countries!`;
      }
      if (message.toLowerCase().includes("track")) {
        return `To track your order:\n\n1. Check your email for the tracking number (sent when order ships)\n2. Visit our website → My Account → Orders\n3. Or track directly on the carrier's website (DHL/FedEx/UPS)\n\nCan you share your order number? I can look it up for you!`;
      }
      return `Here are our shipping options:\n\n📦 **Standard** - ${kb.shipping.methods[0].days} (${kb.shipping.methods[0].cost})\n🚀 **Express** - ${kb.shipping.methods[1].days} ($25)\n⚡ **Priority** - ${kb.shipping.methods[2].days} ($45)\n✈️ **Overnight** - ${kb.shipping.methods[3].days} ($75)\n\n${kb.shipping.countries}\n\nWhich shipping option works best for you?`;

    case "refund_request":
      return `I understand you'd like to make a return. Here's our policy:\n\n✅ **30-day return window** for unworn items\n✅ **Free exchanges** for size/color\n✅ Refund processed in **5-7 business days**\n\n**How to return:**\n1. Email support@batikora.com with your order number\n2. We'll send a prepaid return label\n3. Ship the item in original packaging\n\nWould you like me to help you start a return? Please share your order number.`;

    case "payment_inquiry":
      return `We accept multiple payment methods:\n\n💳 **Credit/Debit Cards** - Visa, Mastercard, Amex\n🅿️ **PayPal** - Including Pay Later (pay in 4)\n🏦 **Bank Transfer** - Available in select countries\n\n🔒 All payments are encrypted with 256-bit SSL\n💱 We accept: USD, EUR, GBP, AUD, SGD, JPY\n\nIs there something specific about payment I can help with?`;

    case "complaint":
      return `I'm truly sorry to hear about your experience. Your satisfaction is our top priority, and I want to make this right.\n\nCould you please share:\n1. Your order number\n2. What happened\n\nI'll escalate this to our senior team immediately. We typically resolve complaints within 24 hours. Is there anything else I should know?`;

    case "order_status":
      return `I'd be happy to check your order status! 📦\n\nCould you please provide:\n• Your **order number** (starts with BTK-)\n• Or the **email** used for the order\n\nI'll look it up right away. You can also check anytime at:\nMy Account → Order History`;

    case "technical_support":
      return `I'm sorry you're experiencing technical issues. Let me help!\n\nCommon solutions:\n• **Clear browser cache** and try again\n• **Try a different browser** (Chrome/Firefox recommended)\n• **Check internet connection**\n\nIf the issue persists, could you tell me:\n1. What you were trying to do\n2. What error you're seeing\n3. Which device/browser you're using\n\nI'll make sure this gets resolved quickly!`;

    default:
      return `Hello! 👋 Welcome to Batikora. I'm your AI assistant and I'm here to help!\n\nI can assist you with:\n• 🛍️ **Product recommendations** & details\n• 📦 **Shipping** information\n• 💳 **Payment** questions\n• 🔄 **Returns** & refunds\n• 📋 **Order tracking**\n\nWhat can I help you with today?`;
  }
}

export function getWelcomeMessage(): string {
  return `Hello! 👋 Welcome to **Batikora**.\n\nI'm your AI shopping assistant. I can help you with:\n\n• Finding the perfect batik piece\n• Shipping & delivery info\n• Order tracking\n• Returns & exchanges\n• Payment questions\n\nHow can I assist you today?`;
}

export function getAwayMessage(): string {
  return `Thank you for reaching out! 🙏\n\nOur human agents are currently offline (available Mon-Fri 9AM-6PM WIB).\n\nBut don't worry — I'm an AI assistant and I can help with most questions! Just type your question and I'll do my best.\n\nFor urgent matters, email: support@batikora.com`;
}

export function getQuickReplies(): string[] {
  return [
    "Show me bestsellers",
    "Shipping information",
    "Track my order",
    "Return policy",
    "Size guide",
    "Payment methods",
  ];
}

export function getAISuggestions(intent: IntentType): string[] {
  switch (intent) {
    case "product_inquiry":
      return [
        "Would you like to see our new arrivals?",
        "I can recommend pieces based on your occasion",
        "Let me show you our bestselling items",
      ];
    case "shipping_inquiry":
      return [
        "We offer free shipping on orders over $150",
        "Express shipping takes 5-7 business days",
        "I can calculate shipping for your country",
      ];
    case "refund_request":
      return [
        "I can help you start a return process",
        "Would you prefer an exchange instead?",
        "Let me connect you with our returns team",
      ];
    default:
      return [
        "How can I help you today?",
        "Would you like product recommendations?",
        "Feel free to ask me anything about our store",
      ];
  }
}
