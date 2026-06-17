// WhatsApp notification helper
// Sends order notification to admin via WhatsApp API URL

const ADMIN_WHATSAPP = "6283184537099"; // +62 831-8453-7099

interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  transactionId: string;
}

/**
 * Generate WhatsApp message text for order notification
 */
export function generateOrderMessage(data: OrderNotificationData): string {
  const itemsList = data.items
    .map((item, i) => `${i + 1}. ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  const address = [
    data.shippingAddress.address1,
    data.shippingAddress.address2,
    `${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}`,
    data.shippingAddress.country,
  ]
    .filter(Boolean)
    .join("\n");

  const message = `🛒 *NEW ORDER - BATIKORA*

📋 *Order:* ${data.orderNumber}
📅 *Date:* ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}

👤 *Customer:*
Name: ${data.customerName}
Email: ${data.customerEmail}
${data.customerPhone ? `Phone: ${data.customerPhone}` : ""}

📦 *Items:*
${itemsList}

📍 *Shipping Address:*
${address}

🚚 *Shipping:* ${data.shippingMethod} - $${data.shippingCost.toFixed(2)}

💰 *Payment Summary:*
Subtotal: $${data.subtotal.toFixed(2)}
Shipping: $${data.shippingCost.toFixed(2)}
${data.discount > 0 ? `Discount: -$${data.discount.toFixed(2)}\n` : ""}*TOTAL: $${data.total.toFixed(2)}*

✅ *Payment:* ${data.paymentMethod}
🔑 *Transaction ID:* ${data.transactionId}

---
Please process this order promptly.`;

  return message;
}

/**
 * Get WhatsApp API URL for sending notification
 * Uses wa.me link which opens WhatsApp with pre-filled message
 */
export function getWhatsAppUrl(data: OrderNotificationData): string {
  const message = generateOrderMessage(data);
  return `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${encodeURIComponent(message)}`;
}

/**
 * Send WhatsApp notification via server-side
 * This creates a callback URL that the client can open,
 * or can be used with WhatsApp Business API if configured
 */
export function buildWhatsAppNotification(data: OrderNotificationData): {
  url: string;
  message: string;
  phone: string;
} {
  const message = generateOrderMessage(data);
  return {
    url: `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${encodeURIComponent(message)}`,
    message,
    phone: ADMIN_WHATSAPP,
  };
}
