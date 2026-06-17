"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Globe,
  Settings,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  Key,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface ShippingSettings {
  shipping_origin_city: string;
  shipping_origin_city_id: string;
  shipping_origin_postal_code: string;
  shipping_origin_country: string;
  shipping_origin_address: string;
  carrier_dhl_enabled: string;
  carrier_jne_enabled: string;
  carrier_pos_enabled: string;
}

interface TestRate {
  carrier: string;
  serviceName: string;
  price: number;
  estimatedDays: string;
}

export default function AdminShippingPage() {
  const [settings, setSettings] = useState<ShippingSettings>({
    shipping_origin_city: "Yogyakarta",
    shipping_origin_city_id: "501",
    shipping_origin_postal_code: "55000",
    shipping_origin_country: "ID",
    shipping_origin_address: "",
    carrier_dhl_enabled: "true",
    carrier_jne_enabled: "true",
    carrier_pos_enabled: "true",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testRates, setTestRates] = useState<TestRate[]>([]);
  const [testing, setTesting] = useState(false);
  const [testCountry, setTestCountry] = useState("US");
  const [activeTab, setActiveTab] = useState<"origin" | "carriers" | "test">("origin");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings?prefix=shipping_origin,carrier_");
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleTestRates() {
    setTesting(true);
    setTestRates([]);
    try {
      const res = await fetch(
        `/api/shipping/rates?country=${testCountry}&weight=0.5&city=&postalCode=`
      );
      if (res.ok) {
        const data = await res.json();
        setTestRates(data.rates || []);
      }
    } catch (error) {
      console.error("Test failed:", error);
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Shipping Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure carrier APIs, store origin, and shipping options
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: "origin" as const, label: "Store Origin", icon: MapPin },
          { id: "carriers" as const, label: "Carriers", icon: Truck },
          { id: "test" as const, label: "Test Rates", icon: RefreshCw },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Origin Settings */}
      {activeTab === "origin" && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Store Origin Address
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            This is where your packages ship from. Used for calculating shipping
            rates.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={settings.shipping_origin_city}
                onChange={(e) =>
                  setSettings({ ...settings, shipping_origin_city: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., Yogyakarta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                City ID (RajaOngkir)
              </label>
              <input
                type="text"
                value={settings.shipping_origin_city_id}
                onChange={(e) =>
                  setSettings({ ...settings, shipping_origin_city_id: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., 501"
              />
              <p className="text-xs text-gray-400 mt-1">
                Required for JNE/Pos domestic rates.{" "}
                <a
                  href="https://rajaongkir.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Find your city ID
                </a>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input
                type="text"
                value={settings.shipping_origin_postal_code}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping_origin_postal_code: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., 55000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country Code</label>
              <input
                type="text"
                value={settings.shipping_origin_country}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping_origin_country: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="ID"
                maxLength={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Full Address
              </label>
              <input
                type="text"
                value={settings.shipping_origin_address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping_origin_address: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Street address for pickup/label"
              />
            </div>
          </div>
        </div>
      )}

      {/* Carrier Settings */}
      {activeTab === "carriers" && (
        <div className="space-y-6">
          {/* DHL Express */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Image
                    src="/carriers/dhl.svg"
                    alt="DHL"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">DHL Express</h3>
                  <p className="text-xs text-gray-500">
                    International shipping worldwide
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.carrier_dhl_enabled === "true"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      carrier_dhl_enabled: e.target.checked ? "true" : "false",
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Key className="w-4 h-4" />
                <span className="font-medium">API Configuration</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Set these in your <code className="bg-gray-200 px-1 rounded">.env</code> file:
              </p>
              <div className="space-y-1 text-xs font-mono text-gray-600 bg-gray-100 rounded p-3">
                <p>DHL_API_KEY=&quot;your-api-key&quot;</p>
                <p>DHL_API_SECRET=&quot;your-api-secret&quot;</p>
                <p>DHL_ACCOUNT_NUMBER=&quot;your-account&quot;</p>
                <p>DHL_MODE=&quot;test&quot; # or &quot;production&quot;</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Register at{" "}
                <a
                  href="https://developer.dhl.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  developer.dhl.com
                </a>
              </p>
            </div>
          </div>

          {/* JNE */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <Image
                    src="/carriers/jne.svg"
                    alt="JNE"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">JNE</h3>
                  <p className="text-xs text-gray-500">
                    Domestic Indonesia &amp; ASEAN countries
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.carrier_jne_enabled === "true"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      carrier_jne_enabled: e.target.checked ? "true" : "false",
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Key className="w-4 h-4" />
                <span className="font-medium">API Configuration (via RajaOngkir)</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Set these in your <code className="bg-gray-200 px-1 rounded">.env</code> file:
              </p>
              <div className="space-y-1 text-xs font-mono text-gray-600 bg-gray-100 rounded p-3">
                <p>RAJAONGKIR_API_KEY=&quot;your-api-key&quot;</p>
                <p>RAJAONGKIR_TYPE=&quot;starter&quot; # starter/basic/pro</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Register at{" "}
                <a
                  href="https://rajaongkir.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  rajaongkir.com
                </a>{" "}
                — Starter plan is free
              </p>
            </div>
          </div>

          {/* Pos Indonesia */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Image
                    src="/carriers/pos.svg"
                    alt="Pos Indonesia"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">Pos Indonesia</h3>
                  <p className="text-xs text-gray-500">
                    Domestic &amp; International (EMS)
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.carrier_pos_enabled === "true"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      carrier_pos_enabled: e.target.checked ? "true" : "false",
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Key className="w-4 h-4" />
                <span className="font-medium">API Configuration (via RajaOngkir)</span>
              </div>
              <p className="text-xs text-gray-500">
                Uses the same RajaOngkir API key as JNE. Both carriers are
                available through the RajaOngkir platform.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Rates */}
      {activeTab === "test" && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Test Shipping Rates
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Test your carrier integrations by fetching rates for a sample
            destination.
          </p>

          <div className="flex items-end gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Destination Country
              </label>
              <select
                value={testCountry}
                onChange={(e) => setTestCountry(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              >
                <option value="ID">Indonesia (Domestic)</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="SG">Singapore</option>
                <option value="AU">Australia</option>
                <option value="JP">Japan</option>
                <option value="AE">UAE</option>
                <option value="DE">Germany</option>
              </select>
            </div>
            <button
              onClick={handleTestRates}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Fetch Rates
            </button>
          </div>

          {/* Results */}
          {testRates.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Carrier
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Service
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Delivery
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testRates.map((rate, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-3 font-medium">{rate.carrier}</td>
                      <td className="px-4 py-3">{rate.serviceName}</td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        ${rate.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {rate.estimatedDays}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          OK
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {testRates.length === 0 && !testing && (
            <div className="text-center py-8 text-gray-400 border rounded-lg">
              <Truck className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                Click &quot;Fetch Rates&quot; to test carrier integrations
              </p>
            </div>
          )}

          {/* API Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">API Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">DHL Express API</span>
                <span className="flex items-center gap-1">
                  {process.env.NEXT_PUBLIC_DHL_CONFIGURED === "true" ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600">Using fallback rates</span>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">RajaOngkir API (JNE + Pos)</span>
                <span className="flex items-center gap-1">
                  {process.env.NEXT_PUBLIC_RAJAONGKIR_CONFIGURED === "true" ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600">Using fallback rates</span>
                    </>
                  )}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Fallback rates are estimated based on weight and destination. For
              accurate real-time rates, configure the carrier API keys in your
              .env file.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
