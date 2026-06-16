import { NextResponse } from "next/server";

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE;

  // Check if credentials are present (don't expose actual values)
  const diagnostics: Record<string, unknown> = {
    mode,
    apiBase: PAYPAL_API_BASE,
    clientIdPresent: !!clientId,
    clientIdLength: clientId?.length || 0,
    clientIdPrefix: clientId?.substring(0, 5) || "EMPTY",
    secretPresent: !!clientSecret,
    secretLength: clientSecret?.length || 0,
  };

  // Try to get access token
  try {
    if (!clientId || !clientSecret) {
      return NextResponse.json({
        ...diagnostics,
        error: "Missing credentials",
      });
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const responseText = await res.text();

    if (!res.ok) {
      return NextResponse.json({
        ...diagnostics,
        tokenStatus: res.status,
        tokenError: responseText,
        success: false,
      });
    }

    const data = JSON.parse(responseText);

    // Try creating a test order
    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "10.00",
            },
          },
        ],
      }),
    });

    const orderText = await orderRes.text();

    return NextResponse.json({
      ...diagnostics,
      tokenSuccess: true,
      tokenAppId: data.app_id,
      orderCreateStatus: orderRes.status,
      orderCreateResponse: orderRes.ok
        ? { id: JSON.parse(orderText).id, status: JSON.parse(orderText).status }
        : JSON.parse(orderText),
      success: orderRes.ok,
    });
  } catch (error) {
    return NextResponse.json({
      ...diagnostics,
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    });
  }
}
